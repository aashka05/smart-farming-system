from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from tools import recommend_top3_crops

router = APIRouter()

class CropRecommendationRequest(BaseModel):
    latitude: float
    longitude: float
    district_name: Optional[str] = None

@router.post("/recommend")
async def get_crop_recommendation(request: CropRecommendationRequest):
    """
    Direct API to get top 3 crop recommendations using the offline dataset (1997-2019).
    Bypasses the LLM agent and returns the raw JSON from the tool.
    """
    try:
        result = recommend_top3_crops.invoke({
            "latitude": request.latitude,
            "longitude": request.longitude,
            "district_name": request.district_name
        })
        return result
    except Exception as e:
        return {"error": str(e)}
