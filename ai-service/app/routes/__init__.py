from fastapi import APIRouter
from app.routes.parse import router as parse_router
from app.routes.job_matcher import router as job_matcher_router

api_router = APIRouter()
api_router.include_router(parse_router, prefix="/parse", tags=["parser"])
api_router.include_router(job_matcher_router, prefix="/job-matcher", tags=["job-matcher"])