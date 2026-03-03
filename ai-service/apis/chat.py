from fastapi import APIRouter
from fastapi.responses import JSONResponse
from starlette.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
from geopy.geocoders import Nominatim
from agent import create_chatbot_agent
from db import get_checkpointer
from llm_config import get_llm
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage
from prompts import system_prompt as system_prompt_template
import json

router = APIRouter()

# ── Initialise once at startup (not per request) ──
_llm = get_llm()
_checkpointer = get_checkpointer()

# ── Geocoding cache: (lat, lon) → address string ──
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


@router.post("/query")
async def respond(request: RequestQuery):
    """
    SSE streaming endpoint using agent.astream(stream_mode="messages").
    Emits events:
      - event: tool   → data: {"type":"tool","data":"tool_name"}
      - event: text   → data: {"type":"text","data":"...token..."}
      - event: done   → data: {}
      - event: error  → data: {"message":"..."}
    """
    location_address = _resolve_location(request.lat, request.lon)
    language = request.language or "English"

    formatted_prompt = system_prompt_template.format(
        name=request.user_name,
        location=location_address,
        language=language,
    )

    agent = create_chatbot_agent(
        system_prompt=formatted_prompt,
        model=_llm,
        checkpointer=_checkpointer,
    )

    config = {
        "configurable": {
            "thread_id": request.user_id,
        }
    }

    async def event_stream():
        try:
            async for mode, chunk in agent.astream(
                {"messages": [HumanMessage(content=request.query)]},
                config=config,
                stream_mode=["messages"],
            ):
                if mode == "messages":
                    token = chunk[0]

                    # ── AI Message: text or tool call ──
                    if isinstance(token, AIMessage):
                        # Tool call initiated
                        if token.tool_calls:
                            name = token.tool_calls[-1].get("name")
                            if name:
                                payload = {"type": "tool", "data": name}
                                yield f"event: tool\ndata: {json.dumps(payload)}\n\n"

                        # Text content (only when NOT a tool call chunk)
                        if not token.tool_calls and hasattr(token, "text") and token.text:
                            payload = {"type": "text", "data": token.text}
                            yield f"event: text\ndata: {json.dumps(payload)}\n\n"

            yield f"event: done\ndata: {json.dumps({})}\n\n"

        except Exception as e:
            yield f"event: error\ndata: {json.dumps({'message': str(e)})}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
