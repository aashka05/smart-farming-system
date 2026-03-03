"""
main.py — FastAPI entry point for the Agronex Smart Farming AI Service.

Run with:
    uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apis.chat import router as chat_router

app = FastAPI(
    title="Agronex — Smart Farming AI",
    description="AI-powered farming assistant with crop recommendations, weather insights, and soil analysis.",
    version="1.0.0",
)

# Allow the React frontend (and Node server) to call this service
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the chat routes
app.include_router(chat_router, prefix="/chat", tags=["Chat"])


@app.get("/")
async def root():
    return {
        "service": "Agronex AI Service",
        "status": "running",
        "endpoints": {
            "health": "/chat/",
            "query": "POST /chat/query",
        },
    }
