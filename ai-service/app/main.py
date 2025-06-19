# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routes import api_router
from app.utils.redis_cache import RedisClient
import os

# Initialize FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI Service for Resume Parsing and Job Matching",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")

redis_client = RedisClient()

# Startup Event: Initialize connections
@app.on_event("startup")
async def startup_event():
    # Initialize Redis connection
    redis_client.initialize()
    # Load ML models
    from services.resume_parser.skill_extractor import load_models
    load_models()
    print("✅ AI Service ready")

# Shutdown Event: Cleanup resources
@app.on_event("shutdown")
async def shutdown_event():
    # Close Redis connection
    redis_client.close()
    print("❌ AI Service shutdown")

# Health check endpoint
@app.get("/")
async def health_check():
    return {
        "status": "active",
        "service": settings.PROJECT_NAME,
        "version": app.version
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=int(5000),
        reload=settings.DEBUG
    )