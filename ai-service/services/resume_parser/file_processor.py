# services/resume_parser/file_processor.py
import pdfplumber
import io
from docx import Document

def extract_text(file: bytes, content_type: str) -> str:
    if content_type == "application/pdf":
        with pdfplumber.open(io.BytesIO(file)) as pdf:
            text = ""
            for page in pdf.pages:
                text += page.extract_text()
            return text
    elif content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        doc = Document(file)
        return " ".join([para.text for para in doc.paragraphs])
    else:
        raise ValueError("Unsupported file type")