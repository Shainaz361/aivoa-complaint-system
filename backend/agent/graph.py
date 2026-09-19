import os
import json
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, START, END
from agent.state import GraphState

load_dotenv()

# Initialize Groq LLM using the mandated openai/gpt-oss-20b model
llm = ChatGroq(
    model="openai/gpt-oss-20b",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.0
)

def extract_complaint_node(state: GraphState) -> GraphState:
    raw_text = state["raw_document_text"]
    
    # We explicitly define the JSON schema in the prompt to bypass tool-calling restrictions
    system_prompt = (
        "You are an expert Pharmaceutical Quality Assurance Auditor.\n"
        "Analyze the customer complaint text and extract the required details.\n"
        "You MUST return ONLY a valid JSON object. Do not include markdown formatting or conversational text.\n"
        "Use this exact JSON structure:\n"
        "{\n"
        '  "complaint_source": "string",\n'
        '  "customer_name": "string",\n'
        '  "product_name": "string",\n'
        '  "product_strength_grade": "string",\n'
        '  "batch_lot_number": "string",\n'
        '  "manufacturing_date": "string",\n'
        '  "expiry_date": "string",\n'
        '  "quantity_affected": "string",\n'
        '  "complaint_type": "string",\n'
        '  "complaint_date": "string",\n'
        '  "detailed_complaint_description": "string",\n'
        '  "initial_severity": "Critical, Major, or Minor",\n'
        '  "priority": "High, Medium, or Low",\n'
        '  "missing_critical_fields": [],\n'
        '  "root_cause_recommendation": "string",\n'
        '  "capa_recommendation": "string"\n'
        "}\n"
        "If a detail is missing, output 'Not Specified'."
    )
    
    try:
        # Standard invoke directly triggers Gemma 2 without structured output limits
        response = llm.invoke([
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": raw_text}
        ])
        
        # Clean the response to ensure strict JSON formatting
        cleaned_text = response.content.replace("```json", "").replace("```", "").strip()
        parsed_json = json.loads(cleaned_text)
        
        return {"extracted_complaint": parsed_json, "status": "completed"}
        
    except Exception as e:
        print(f"Extraction failed: {str(e)}")
        # Safe fallback to prevent frontend crashes during processing
        return {"extracted_complaint": {}, "status": "failed"}

def build_agent():
    workflow = StateGraph(GraphState)
    workflow.add_node("extract_complaint", extract_complaint_node)
    workflow.add_edge(START, "extract_complaint")
    workflow.add_edge("extract_complaint", END)
    return workflow.compile()

complaint_agent = build_agent()