import io
from pypdf import PdfReader

def parse_uploaded_file(file_bytes: bytes, filename: str) -> str:
    filename_lower = filename.lower()
    
    if filename_lower.endswith(".pdf"):
        reader = PdfReader(io.BytesIO(file_bytes))
        text = "".join(page.extract_text() or "" for page in reader.pages)
        return text.strip()
        
    return file_bytes.decode("utf-8", errors="ignore")