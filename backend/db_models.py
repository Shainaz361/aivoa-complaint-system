from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from database import Base

class ComplaintRecord(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    complaint_source = Column(String, default="Not Specified")
    customer_name = Column(String, default="Not Specified")
    product_name = Column(String, default="Not Specified")
    product_strength_grade = Column(String, default="Not Specified")
    batch_lot_number = Column(String, default="Not Specified")
    manufacturing_date = Column(String, default="Not Specified")
    expiry_date = Column(String, default="Not Specified")
    quantity_affected = Column(String, default="Not Specified")
    complaint_type = Column(String, default="Not Specified")
    complaint_date = Column(String, default="Not Specified")
    detailed_complaint_description = Column(Text, default="Not Specified")
    initial_severity = Column(String, default="Not Specified")
    priority = Column(String, default="Not Specified")
    root_cause_recommendation = Column(Text, default="Not Specified")
    capa_recommendation = Column(Text, default="Not Specified")
    created_at = Column(DateTime, default=datetime.utcnow)