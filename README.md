# AIVOA Copilot — Pharmaceutical Complaint Management System

An AI-powered Quality Management System (QMS) copilot built with FastAPI, LangGraph, React, and SQLAlchemy. It automates unstructured complaint intake, dynamic risk evaluation, multi-turn conversational edits, and audit-ready database persistence.

---

## Key Features

- **Document Parsing**: Ingests unstructured emails, PDF reports, and customer service transcripts.
- **Dynamic Risk Triage**: Uses LangGraph to categorize complaint severity (e.g., Major batch recall for contamination vs. targeted packaging re-inspection).
- **Intelligent Identity Resolution**: Distinguishes reporting agents (store managers, distributors) from end consumers, defaulting missing values cleanly to prevent schema failures.
- **Multi-Turn Conversational Memory**: Enables QA auditors to make surgical field updates via chat without wiping existing form state.
- **Audit-Ready Persistence**: Validates data schemas and commits verified records to a SQL database.

---

## Tech Stack

- **Frontend**: React, Redux Toolkit, Tailwind CSS
- **Backend**: FastAPI, Python 3.10+
- **Agent Orchestration**: LangGraph, LangChain, Groq
- **Database**: SQLAlchemy (SQLite / PostgreSQL)

---

## Project Structure

\\\	ext
aivoa-complaint-system/
+-- backend/
¦   +-- agent/
¦   ¦   +-- graph.py
¦   ¦   +-- state.py
¦   +-- models/
¦   ¦   +-- schemas.py
¦   +-- utils/
¦   ¦   +-- document_parser.py
¦   +-- database.py
¦   +-- db_models.py
¦   +-- main.py
¦   +-- requirements.txt
+-- frontend/
¦   +-- public/
¦   +-- src/
¦   ¦   +-- store/
¦   ¦   +-- App.js
¦   ¦   +-- index.js
¦   +-- package.json
+-- sample_complaints/
+-- .gitignore
+-- README.md
\\\

---

## Getting Started

### 1. Backend Setup

\\\ash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
\\\

Create a \.env\ file inside \ackend/\:
\\\env
GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=sqlite:///./qms_complaints.db
\\\

Start the FastAPI server:
\\\ash
uvicorn main:app --reload --port 8000
\\\

### 2. Frontend Setup

\\\ash
cd frontend
npm install
npm start
\\\

The application runs locally at \http://localhost:3000\.
