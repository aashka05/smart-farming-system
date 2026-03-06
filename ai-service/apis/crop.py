from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import Optional
import numpy as np
from tools import recommend_top3_crops, _load_model

router = APIRouter()

class CropRecommendationRequest(BaseModel):
    latitude: float
    longitude: float
    district_name: Optional[str] = None


@router.get("/predict")
async def predict_crop(
    N: float = Query(..., description="Nitrogen content in soil (kg/ha)"),
    P: float = Query(..., description="Phosphorus content in soil (kg/ha)"),
    K: float = Query(..., description="Potassium content in soil (kg/ha)"),
    temperature: float = Query(..., description="Temperature in °C"),
    humidity: float = Query(..., description="Relative humidity in %"),
    ph: float = Query(..., description="Soil pH value"),
    rainfall: float = Query(..., description="Rainfall in mm"),
):
    """
    Predict the best crop using the ML model (VotingClassifier).
    Takes soil and climate parameters as query params and returns
    the predicted crop along with prediction probabilities for all classes.
    """
    try:
        model, scaler, label_encoder = _load_model()
        features = np.array([[N, P, K, temperature, humidity, ph, rainfall]])
        features_scaled = scaler.transform(features)
        prediction = model.predict(features_scaled)
        crop_name = label_encoder.inverse_transform(prediction)[0]

        # Get probabilities if the model supports it
        probabilities = {}
        if hasattr(model, "predict_proba"):
            proba = model.predict_proba(features_scaled)[0]
            for cls, prob in zip(label_encoder.classes_, proba):
                probabilities[cls] = round(float(prob), 4)

        return {
            "predicted_crop": crop_name,
            "confidence": probabilities.get(crop_name),
            "probabilities": probabilities,
            "input": {
                "N": N, "P": P, "K": K,
                "temperature": temperature,
                "humidity": humidity,
                "ph": ph,
                "rainfall": rainfall,
            },
        }
    except Exception as e:
        return {"error": str(e)}


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