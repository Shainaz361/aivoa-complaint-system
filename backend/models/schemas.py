from pydantic import BaseModel, Field
from typing import Optional, List

class ComplaintExtractionSchema(BaseModel):
    # Origin & Customer Details
    complaint_source: str = Field(default="Not Specified")
    customer_name: str = Field(default="Not Specified")
    
    # Product & Batch Identification
    product_name: str = Field(default="Not Specified")
    product_strength_grade: str = Field(default="Not Specified")
    batch_lot_number: str = Field(default="Not Specified")
    manufacturing_date: str = Field(default="Not Specified")
    expiry_date: str = Field(default="Not Specified")
    quantity_affected: str = Field(default="Not Specified")
    
    # Complaint Details
    complaint_type: str = Field(default="Not Specified")
    complaint_date: str = Field(default="Not Specified")
    detailed_complaint_description: str = Field(default="Not Specified")
    
    # Initial Assessment & Priority
    initial_severity: str = Field(default="Not Specified")
    priority: str = Field(default="Not Specified")

    # Bonus Features
    missing_critical_fields: List[str] = Field(default_factory=list, description="Fields missing from document")
    root_cause_recommendation: Optional[str] = Field(default="None identified")
    
    # --- NEW BONUS FIELDS REQUIRED BY REACT FRONTEND ---
    suggested_severity: str = Field(description="Classify as Minor, Major, or Critical based on patient risk.")
    suggested_next_action: str = Field(description="CAPA Recommendation: strictly provide the exact next action for the QA team.")
    initial_risk_assessment: str = Field(description="Strictly provide a 1-2 sentence summary of the risk to product quality and patient safety.")