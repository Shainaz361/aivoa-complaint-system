from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional
import traceback

from agent.graph import complaint_agent
from utils.document_parser import parse_uploaded_file
import db_models
from database import engine, get_db

# Automatically create database tables
db_models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AIVOA QMS AI System")

# Explicit CORS configuration ensuring headers are returned on all responses
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://shainaz361.github.io",
        "http://localhost:3000",
        "*",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Health-check endpoint: Prevents 404 on the root domain
@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "AIVOA QMS Backend",
        "docs_url": "/docs"
    }

@app.post("/api/extract")
async def extract_complaint_endpoint(
    text_content: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    raw_text = ""
    
    try:
        if file and file.filename:
            content = await file.read()
            raw_text = parse_uploaded_file(content, file.filename)
        elif text_content and text_content.strip():
            raw_text = text_content.strip()
        else:
            raise HTTPException(status_code=400, detail="Provide a valid document file or complaint text.")

        initial_state = {
            "raw_document_text": raw_text,
            "extracted_complaint": None,
            "status": "processing"
        }

        # Run the LangGraph agent
        final_output = complaint_agent.invoke(initial_state)
        
        return {"success": True, "data": final_output.get("extracted_complaint")}

    except HTTPException:
        raise
    except Exception as e:
        # Print full stack trace to Render logs for debugging
        print("Detailed Extraction Error:")
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"AI Agent failed during processing: {str(e)}"
        )

@app.post("/api/save")
async def save_complaint(complaint_data: dict, db: Session = Depends(get_db)):
    try:
        # Filter out fields not present in the DB model schema
        db_data = {k: v for k, v in complaint_data.items() if k != "missing_critical_fields"}
        
        new_record = db_models.ComplaintRecord(**db_data)
        db.add(new_record)
        db.commit()
        db.refresh(new_record)
        
        return {
            "success": True,
            "message": "Complaint saved to QMS successfully",
            "id": new_record.id
        }
    except Exception as e:
        db.rollback()
        print("Database Save Error:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)