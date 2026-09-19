from typing import TypedDict, Optional
from models.schemas import ComplaintExtractionSchema

class GraphState(TypedDict):
    raw_document_text: str
    extracted_complaint: Optional[ComplaintExtractionSchema]
    status: str