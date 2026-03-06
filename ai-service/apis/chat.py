from fastapi import APIRouter , HTTPException, UploadFile
from fastapi.responses import JSONResponse
from starlette.responses import StreamingResponse 
from pydantic import BaseModel
from groq import AsyncGroq
from typing import Optional
from geopy.geocoders import Nominatim
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage
from prompts import system_prompt as system_prompt_template
from tools import (
    get_current_weather,
    get_soil_data,
    get_climate_history,
    get_soil_npk_ph,
    recommend_top3_crops,
    get_weather_forecast,
)
import json
import os
import traceback

router = APIRouter()

# ── Lazy LLM + agent (only if OLLAMA_API_KEY is configured) ──────────
_llm = None
_checkpointer = None
_agent_available = False

try:
    _api_key = os.getenv("OLLAMA_API_KEY")
    if _api_key and _api_key not in ("", "None"):
        from llm_config import get_llm
        from db import get_checkpointer as _get_cp
        _llm = get_llm()
        _checkpointer = _get_cp()
        _agent_available = True
        print("✅ LLM agent loaded (Ollama Cloud)")
    else:
        print("ℹ️  OLLAMA_API_KEY not set → using tool-only fallback mode")
except Exception as e:
    print(f"⚠️  LLM init failed ({e}) → using tool-only fallback mode")

_geocode_cache: dict[tuple[float, float], str] = {}


def _resolve_location(lat: float, lon: float) -> str:
    """Reverse-geocode with in-memory caching."""
    key = (round(lat, 2), round(lon, 2))
    if key in _geocode_cache:
        return _geocode_cache[key]
    try:
        geolocator = Nominatim(user_agent="agronex-farming-bot")
        location = geolocator.reverse((lat, lon), language="en", timeout=10)
        address = location.address if location else f"{lat}, {lon}"
    except Exception:
        address = f"{lat}, {lon}"
    _geocode_cache[key] = address
    return address


# ── Tool-based fallback (no LLM needed) ─────────────────────────────
def _build_fallback_response(query: str, lat: float, lon: float, user_name: str) -> str:
    """
    Call the real farming tools directly based on keywords and
    return a nicely formatted Markdown response — no LLM required.
    """
    q = query.lower()
    sections = []

    # ---- Weather ----
    is_weather = any(k in q for k in [
        "weather", "rain", "temperature", "temp", "humidity", "wind",
        "climate", "hot", "cold", "monsoon", "forecast",
    ])
    if is_weather:
        try:
            w = get_current_weather.invoke({"latitude": lat, "longitude": lon})
            if "error" not in w:
                sections.append(
                    f"### 🌤️ Current Weather\n"
                    f"- **Temperature:** {w['temperature_celsius']} °C\n"
                    f"- **Humidity:** {w['relative_humidity_percent']}%\n"
                    f"- **Rainfall:** {w['rainfall_mm']} mm\n"
                    f"- **Wind:** {w['wind_speed_kmh']} km/h"
                )
        except Exception:
            pass

        if "forecast" in q or "week" in q or "next" in q:
            try:
                f = get_weather_forecast.invoke({"latitude": lat, "longitude": lon})
                if "error" not in f and f.get("forecast"):
                    rows = []
                    for day in f["forecast"]:
                        rows.append(
                            f"| {day['date']} | {day['max_temp_celsius']}° / {day['min_temp_celsius']}° "
                            f"| {day['precipitation_probability_percent']}% | {day['precipitation_mm']} mm |"
                        )
                    table = (
                        "### 📅 7-Day Forecast\n"
                        "| Date | Temp (Max/Min) | Rain Prob. | Precip. |\n"
                        "|------|---------------|-----------|--------|\n"
                        + "\n".join(rows)
                    )
                    sections.append(table)
            except Exception:
                pass

    # ---- Crop recommendation ----
    is_crop = any(k in q for k in [
        "crop", "grow", "plant", "recommend", "season", "cultivat",
        "sow", "harvest", "kharif", "rabi", "what should",
    ])
    if is_crop:
        try:
            c = recommend_top3_crops.invoke({
                "latitude": lat, "longitude": lon,
            })
            if "error" not in c:
                top = c.get("top_3_recommended_crops", [])
                loc = c.get("location_context", {})
                lines = [f"### 🌾 Top Crop Recommendations\n*Based on data from {loc.get('district', '')}, {loc.get('state', '')}*\n"]
                for crop in top:
                    lines.append(
                        f"**{crop['rank']}. {crop['crop']}** ({crop.get('season', '')})\n"
                        f"   - Avg area: {crop['historical_data']['avg_area_ha']:,.0f} ha\n"
                        f"   - Avg yield: {crop['historical_data']['avg_yield_kg_per_ha']:,.0f} kg/ha\n"
                        f"   - Trend: {crop.get('trend', '')}\n"
                        f"   - {crop.get('why_this_crop', '')}\n"
                    )
                others = c.get("other_viable_crops", [])
                if others:
                    lines.append(f"\n**Other options:** {', '.join(others)}")
                sections.append("\n".join(lines))
        except Exception:
            pass

    # ---- Soil ----
    is_soil = any(k in q for k in [
        "soil", "npk", "ph", "nutrient", "nitrogen", "phosphorus",
        "potassium", "fertility", "moisture",
    ])
    if is_soil:
        try:
            s = get_soil_npk_ph.invoke({"latitude": lat, "longitude": lon})
            if "error" not in s:
                sections.append(
                    f"### 🧪 Soil Analysis (estimated)\n"
                    f"- **Nitrogen (N):** {s['nitrogen_N_kg_per_ha']} kg/ha\n"
                    f"- **Phosphorus (P):** {s['phosphorus_P_kg_per_ha']} kg/ha\n"
                    f"- **Potassium (K):** {s['potassium_K_kg_per_ha']} kg/ha\n"
                    f"- **pH:** {s['ph']}\n"
                    f"- Region: {s['region_matched']}"
                )
        except Exception:
            pass

        try:
            sd = get_soil_data.invoke({"latitude": lat, "longitude": lon})
            if "error" not in sd:
                sections.append(
                    f"### 🌱 Live Soil Conditions\n"
                    f"- **Soil Temp:** {sd.get('current_soil_temperature_celsius')} °C\n"
                    f"- **Soil Moisture:** {sd.get('current_soil_moisture_m3_per_m3')} m³/m³"
                )
        except Exception:
            pass

    # ---- Irrigation ----
    is_irrigation = any(k in q for k in [
        "irrigat", "water", "when to water", "drip", "sprinkler",
    ])
    if is_irrigation:
        try:
            w = get_current_weather.invoke({"latitude": lat, "longitude": lon})
            sd = get_soil_data.invoke({"latitude": lat, "longitude": lon})
            lines = ["### 💧 Irrigation Advisory\n"]
            if "error" not in w:
                rain = w.get("rainfall_mm", 0) or 0
                humidity = w.get("relative_humidity_percent", 0) or 0
                if rain > 5:
                    lines.append("- ☔ **Recent rainfall detected** — irrigation may not be needed today.")
                elif humidity > 75:
                    lines.append("- 💦 **High humidity** — reduce irrigation frequency.")
                else:
                    lines.append("- 🌞 **Low rainfall & moderate humidity** — consider irrigating today.")
                lines.append(f"- Current rainfall: {rain} mm, humidity: {humidity}%")
            if "error" not in sd:
                moisture = sd.get("current_soil_moisture_m3_per_m3")
                if moisture is not None:
                    if moisture < 0.15:
                        lines.append(f"- ⚠️ Soil moisture is low ({moisture} m³/m³) — **irrigate soon**.")
                    elif moisture > 0.35:
                        lines.append(f"- ✅ Soil moisture is adequate ({moisture} m³/m³).")
                    else:
                        lines.append(f"- Soil moisture: {moisture} m³/m³ (moderate).")
            sections.append("\n".join(lines))
        except Exception:
            pass

    # ---- Pest / disease / market (generic info) ----
    is_pest = any(k in q for k in [
        "pest", "disease", "blight", "fungus", "insect", "wilt",
        "leaf", "rot", "mildew", "rust", "spot",
    ])
    if is_pest:
        sections.append(
            "### 🐛 Pest & Disease Advice\n"
            "For disease identification, please use the **Crop Health** feature "
            "(upload a photo of the affected leaf/plant).\n\n"
            "**General tips:**\n"
            "- Inspect crops early morning for pests\n"
            "- Use neem oil spray as a natural pesticide\n"
            "- Ensure proper drainage to prevent fungal diseases\n"
            "- Rotate crops each season to break pest cycles\n"
            "- Remove and destroy infected plant parts immediately"
        )

    is_market = any(k in q for k in ["price", "market", "mandi", "sell", "cost", "rate"])
    if is_market:
        sections.append(
            "### 📈 Market Prices\n"
            "For latest market prices, check the **Market Prices** page in the app.\n\n"
            "**Tips for better prices:**\n"
            "- Monitor mandi prices daily before selling\n"
            "- Consider storage facilities to sell when prices peak\n"
            "- Explore direct-to-consumer channels\n"
            "- Check government MSP (Minimum Support Price) rates"
        )

    # ---- Generic fallback (call weather + crops if nothing matched) ----
    if not sections:
        try:
            w = get_current_weather.invoke({"latitude": lat, "longitude": lon})
            c = recommend_top3_crops.invoke({"latitude": lat, "longitude": lon})
            loc = c.get("location_context", {})
            top_names = [cr["crop"] for cr in c.get("top_3_recommended_crops", [])]

            sections.append(
                f"I'm not sure I fully understood your question, but here's useful data for your location:\n\n"
                f"### 🌤️ Current Weather\n"
                f"- Temperature: {w.get('temperature_celsius')} °C\n"
                f"- Humidity: {w.get('relative_humidity_percent')}%\n"
                f"- Rainfall: {w.get('rainfall_mm')} mm\n\n"
                f"### 🌾 Top Crops for {loc.get('district', 'your area')}\n"
                f"{', '.join(top_names) if top_names else 'Data unavailable'}\n\n"
                f"Try asking specifically about **weather**, **crop recommendations**, "
                f"**soil analysis**, or **irrigation advice**!"
            )
        except Exception:
            sections.append(
                "🌾 I'm Agronex, your farming assistant! I can help with:\n\n"
                "- **Weather** — current conditions & 7-day forecast\n"
                "- **Crop recommendations** — best crops for your location\n"
                "- **Soil analysis** — NPK, pH, and moisture data\n"
                "- **Irrigation advice** — when and how much to water\n\n"
                "Try asking: *What crops should I grow?* or *What's the weather today?*"
            )

    greeting = f"Hey {user_name}! 🌾\n\n" if user_name and user_name != "Farmer" else ""
    return greeting + "\n\n---\n\n".join(sections)


class RequestQuery(BaseModel):
    lat: float
    lon: float
    query: str
    user_id: str
    user_name: str
    language: Optional[str] = "English"


@router.get("/")
async def health_check():
    return {"message": "Chat service is up and running!"}

def messages_to_dict(messages) -> list[dict]:
    """Convert LangChain message objects to JSON-serializable dicts."""
    result = []
    for msg in messages:
        entry = {"content": msg.content}
        if isinstance(msg, HumanMessage):
            entry["role"] = "user"
        elif isinstance(msg, AIMessage):
            entry["role"] = "assistant"
            if msg.tool_calls:
                entry["tool_calls"] = msg.tool_calls
        elif isinstance(msg, ToolMessage):
            entry["role"] = "tool"
            entry["name"] = getattr(msg, "name", None)
        else:
            entry["role"] = "unknown"
        result.append(entry)
    return result
@router.post("/get_chat")
async def get_chat(chat_id: str):
    """
    Fetch chat messages from LangGraph agent state using thread_id.
    """
    if not (_agent_available and _llm):
        return JSONResponse(content={"messages": []})

    from agent import create_chatbot_agent

    agent = create_chatbot_agent(
        system_prompt="You are a helpful farming assistant.",
        model=_llm,
        checkpointer=_checkpointer,
    )

    state = await agent.aget_state(
        config={"configurable": {"thread_id": chat_id}}
    )

    messages = state.values.get("messages", [])

    return JSONResponse(content={"messages": messages_to_dict(messages)})

@router.post("/query")
async def respond(request: RequestQuery):
    """
    SSE streaming endpoint.

    If the LLM agent is available, use full agent.astream().
    Otherwise, call farming tools directly and stream the result.
    """
    location_address = _resolve_location(request.lat, request.lon)
    language = request.language or "English"

    # ── Agent path (LLM available) ───────────────────────────────────
    if _agent_available and _llm:
        formatted_prompt = system_prompt_template.format(
            name=request.user_name,
            location=location_address,
            language=language,
        )
        from agent import create_chatbot_agent
        agent = create_chatbot_agent(
            system_prompt=formatted_prompt,
            model=_llm,
            checkpointer=_checkpointer,
        )
        config = {"configurable": {"thread_id": request.user_id}}

        async def agent_stream():
            try:
                async for mode, chunk in agent.astream(
                    {"messages": [HumanMessage(content=request.query)]},
                    config=config,
                    stream_mode=["messages"],
                ):
                    if mode == "messages":
                        token = chunk[0]
                        if isinstance(token, AIMessage):
                            if token.tool_calls:
                                name = token.tool_calls[-1].get("name")
                                if name:
                                    yield f"event: tool\ndata: {json.dumps({'type': 'tool', 'data': name})}\n\n"
                            if not token.tool_calls and hasattr(token, "text") and token.text:
                                yield f"event: text\ndata: {json.dumps({'type': 'text', 'data': token.text})}\n\n"
                yield f"event: done\ndata: {json.dumps({})}\n\n"
            except Exception as e:
                err_str = str(e).lower()
                if "401" in err_str or "unauthorized" in err_str or "auth" in err_str:
                    # LLM auth failed — fall back to tool-only mode
                    fallback = _build_fallback_response(
                        request.query, request.lat, request.lon, request.user_name,
                    )
                    for chunk in _chunk_text(fallback, 8):
                        yield f"event: text\ndata: {json.dumps({'type': 'text', 'data': chunk})}\n\n"
                    yield f"event: done\ndata: {json.dumps({})}\n\n"
                else:
                    yield f"event: error\ndata: {json.dumps({'message': str(e)})}\n\n"

        return StreamingResponse(
            agent_stream(),
            media_type="text/event-stream",
            headers={"Cache-Control": "no-cache", "Connection": "keep-alive", "X-Accel-Buffering": "no"},
        )

    # ── Tool-only path (no LLM) ─────────────────────────────────────
    async def tool_stream():
        try:
            # Emit tool-call pills for realism
            q = request.query.lower()
            if any(k in q for k in ["weather", "rain", "temperature", "forecast", "climate"]):
                yield f"event: tool\ndata: {json.dumps({'type': 'tool', 'data': 'get_current_weather'})}\n\n"
            if any(k in q for k in ["crop", "grow", "plant", "recommend", "season"]):
                yield f"event: tool\ndata: {json.dumps({'type': 'tool', 'data': 'recommend_top3_crops'})}\n\n"
            if any(k in q for k in ["soil", "npk", "ph", "nutrient", "moisture"]):
                yield f"event: tool\ndata: {json.dumps({'type': 'tool', 'data': 'get_soil_npk_ph'})}\n\n"
            if any(k in q for k in ["irrigat", "water"]):
                yield f"event: tool\ndata: {json.dumps({'type': 'tool', 'data': 'get_current_weather'})}\n\n"
                yield f"event: tool\ndata: {json.dumps({'type': 'tool', 'data': 'get_soil_data'})}\n\n"

            fallback = _build_fallback_response(
                request.query, request.lat, request.lon, request.user_name,
            )

            for chunk in _chunk_text(fallback, 8):
                yield f"event: text\ndata: {json.dumps({'type': 'text', 'data': chunk})}\n\n"

            yield f"event: done\ndata: {json.dumps({})}\n\n"
        except Exception as e:
            traceback.print_exc()
            yield f"event: error\ndata: {json.dumps({'message': str(e)})}\n\n"

    return StreamingResponse(
        tool_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive", "X-Accel-Buffering": "no"},
    )
class SpeechToText:
    def __init__(self):
        self.model : AsyncGroq = AsyncGroq(api_key=os.getenv('GROQ_API_KEY'))

    async def speech_to_text(self , file : UploadFile):
        if file.content_type not in ("audio/wav" , "audio/x-wav"):
            raise HTTPException(400 , "Only wav files are supported")
        audio = await file.read()
        if(len(audio) <= 1000):
            return dict(filename = file.filename , text = "")
        if(len(audio)>10*1024*1024):
            raise HTTPException(400,"File Size must be less than 10 mb")
        result = await self.model.audio.transcriptions.create(
            file = (file.filename , audio),
            model = "whisper-large-v3-turbo"
        )
        return dict(filename = file.filename , text = result.text.strip())

@router.post("/stt")
async def get_text_from_speech(file:UploadFile):
    st = SpeechToText()
    response_dict : dict = await st.speech_to_text(file)
    #response_dict schema (text : str , filename:str) 
    return JSONResponse(content=response_dict)
def _chunk_text(text: str, size: int = 8) -> list[str]:
    """Split text into small chunks for streaming effect."""
    words = text.split(" ")
    chunks = []
    for i in range(0, len(words), size):
        chunk = " ".join(words[i : i + size])
        if i > 0:
            chunk = " " + chunk
        chunks.append(chunk)
    return chunks