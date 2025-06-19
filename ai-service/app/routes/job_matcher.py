from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from typing import List, Dict, Any, Union
from services.job_matcher.hybrid_matcher import compute_similarity

router = APIRouter()

class JobMatcherInput(BaseModel):
    skills: List[str]
    experience: int  # Changed to int to match your backend conversion
    jobs: List[Dict[str, Any]]

@router.post("/")
def get_matched_jobs(data: JobMatcherInput = Body(...)):
    try:
        print(f"Received job matching request with {len(data.jobs)} jobs")
        matched_jobs = compute_similarity(
            data.skills, 
            data.experience,
            data.jobs
        )
        return {"matched_jobs": matched_jobs}
    except Exception as e:
        error_message = f"Error matching jobs: {str(e)}"
        print(error_message)
        raise HTTPException(status_code=500, detail=error_message)
