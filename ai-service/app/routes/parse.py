# app/routes/parser.py
from fastapi import APIRouter, HTTPException
from services.resume_parser.file_processor import extract_text
from services.resume_parser.skill_extractor import extract_skills
from services.resume_parser.experience_extractor import extract_experience
import requests
from pydantic import BaseModel
from io import BytesIO

router = APIRouter()

class FileUrl(BaseModel):
    fileUrl: str

@router.post("/")
async def parse_resume(fileUrl: FileUrl):
    response = requests.get(fileUrl.fileUrl)
    response.raise_for_status()
    file_content = BytesIO(response.content)
    
    # Determine the content type
    content_type = response.headers.get('Content-Type', 'application/pdf')
    
    # Debugging information
    print(f"File content type: {content_type}")
    
    try:
        # Read the content from BytesIO and pass it as bytes
        text = extract_text(file_content.read(), content_type)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    return {
        "skills": extract_skills(text),
        "experience": extract_experience(text)
    }