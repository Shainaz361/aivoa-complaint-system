AIVOA Copilot — Pharmaceutical Complaint Management System

An AI-powered Quality Management System (QMS) Copilot designed to automate unstructured complaint intake, clinical/batch entity extraction, dynamic risk triage, multi-turn conversational edits, and audit-ready database persistence.

================================================================================
KEY FEATURES
================================================================================

- Unstructured Intake & Document Parsing: Ingests raw emails, PDF defect reports, and customer service call logs.
- Dynamic Risk Triage: Uses LangGraph-driven state workflows to evaluate defect severity and recommend regulatory pathways (e.g., Immediate Batch Recall & CAPA vs. Quarantine & Inspection).
- Intelligent Identity Resolution: Distinguishes reporting stakeholders (distributors, pharmacists, clinic staff) from end consumers while safely handling missing clinical fields.
- Multi-Turn Conversational Memory: QA auditors can converse with the copilot to perform surgical field edits (e.g., batch number corrections, severity escalation) without wiping existing form state.
- Audit-Ready Persistence: Validates extraction against strict Pydantic schemas and commits records to a relational SQL database.

================================================================================
TECH STACK
================================================================================

- Frontend: React, Redux Toolkit, CSS3 / Modern UI
- Backend: FastAPI (Python 3.10+)
- Agent Framework: LangGraph, LangChain, Groq LLM
- Database: SQLAlchemy (SQLite / PostgreSQL)
- Validation: Pydantic v2

================================================================================
PROJECT STRUCTURE
================================================================================

aivoa-complaint-system/
├── backend/
│   ├── agent/
│   │   ├── graph.py               # LangGraph workflow & decision logic
│   │   └── state.py               # Agent state definitions
│   ├── models/
│   │   └── schemas.py             # Pydantic schemas
│   ├── utils/
│   │   └── document_parser.py     # Unstructured text & document parsers
│   ├── database.py                # Database connection & session setup
│   ├── db_models.py               # SQLAlchemy ORM models
│   ├── main.py                    # FastAPI entrypoint & API routes
│   └── requirements.txt           # Python dependencies
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── store/
│   │   │   ├── complaintSlice.js  # Redux complaint state management
│   │   │   └── store.js           # Redux store configuration
│   │   ├── App.css                # Application styles
│   │   ├── App.js                 # Primary dashboard & chat interface
│   │   └── index.js
│   ├── package.json
│   └── package-lock.json
├── sample_complaints/
│   ├── complaint-1-high-severity-email.txt
│   ├── complaint-2-medium-severity-packaging.txt
│   └── complaint-3-log-and-edit-prompts.txt
├── .gitignore
└── README.md

================================================================================
DEMO TEST DATASETS
================================================================================

The sample_complaints/ directory contains three standardized scenarios to test and reproduce system behavior:

1. High Severity (Amoxicillin Contamination): Blister discolouration and particulate matter with adverse patient gastrointestinal symptoms; triggers critical risk triage and recall recommendations.
2. Medium Severity (Metformin Packaging Defect): Damaged outer foil leaving tablets exposed to ambient air without patient ingestion; triggers quarantine and repackaging inspection.
3. Multi-Turn Chat Correction (Paracetamol): Ingests an initial telephone complaint log, followed by interactive auditor prompts that correct the batch identifier and escalate severity.

================================================================================
GETTING STARTED
================================================================================

1. Prerequisites:
   - Python 3.10+
   - Node.js 18+ and npm

2. Backend Setup:
   cd backend
   python -m venv .venv
   
   # Windows PowerShell:
   .venv\Scripts\Activate.ps1
   
   # macOS/Linux:
   source .venv/bin/activate
   
   pip install -r requirements.txt

   # Create .env in backend/:
   GROQ_API_KEY=your_groq_api_key_here
   DATABASE_URL=sqlite:///./qms_complaints.db

   # Start backend:
   uvicorn main:app --reload --port 8000
   API Docs: http://127.0.0.1:8000/docs

3. Frontend Setup:
   cd frontend
   npm install
   npm start
   App URL: http://localhost:3000
