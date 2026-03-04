"""
agronex_map.py — Agronex India Map Crop Recommender
Click anywhere on the India map to get Top 3 crop recommendations for that location.
"""
#HOW TO USE THIS FILE 
#-> run these commands 
# pip install streamlit
# streamlit run agronex_map.py 
import streamlit as st
import folium
from streamlit_folium import st_folium
import json
import os
import math

# ─────────────────────────────────────────────────────────
# Page config
# ─────────────────────────────────────────────────────────
st.set_page_config(
    page_title="Agronex — India Crop Recommender",
    page_icon="🌾",
    layout="wide",
)

# ─────────────────────────────────────────────────────────
# Styling
# ─────────────────────────────────────────────────────────
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Inter', sans-serif;
    }
    
    .main { background: #f0f4f0; }
    
    .hero-header {
        background: linear-gradient(135deg, #1a6b2e 0%, #2d9e4e 50%, #4caf50 100%);
        color: white;
        padding: 2rem 2.5rem;
        border-radius: 16px;
        margin-bottom: 1.5rem;
        box-shadow: 0 8px 32px rgba(26,107,46,0.3);
    }
    .hero-header h1 { margin: 0; font-size: 2rem; font-weight: 700; }
    .hero-header p  { margin: 0.4rem 0 0; opacity: 0.9; font-size: 1rem; }

    .instruction-card {
        background: white;
        border-left: 4px solid #2d9e4e;
        border-radius: 8px;
        padding: 0.9rem 1.2rem;
        margin-bottom: 1rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        font-size: 0.92rem;
        color: #444;
    }

    .crop-card {
        background: white;
        border-radius: 14px;
        padding: 1.2rem 1.4rem;
        margin-bottom: 1rem;
        box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        border-top: 4px solid #2d9e4e;
        transition: transform 0.2s;
    }
    .crop-card:hover { transform: translateY(-2px); }
    .crop-card.rank-1 { border-top-color: #f5a623; }
    .crop-card.rank-2 { border-top-color: #7eb8f7; }
    .crop-card.rank-3 { border-top-color: #a8d5a2; }

    .rank-badge {
        display: inline-block;
        width: 32px; height: 32px;
        border-radius: 50%;
        font-weight: 700; font-size: 0.95rem;
        text-align: center; line-height: 32px;
        margin-right: 0.6rem;
        color: white;
    }
    .rank-1 .rank-badge { background: #f5a623; }
    .rank-2 .rank-badge { background: #7eb8f7; }
    .rank-3 .rank-badge { background: #4caf50; }

    .crop-name { font-size: 1.2rem; font-weight: 700; color: #1a6b2e; display: inline; }
    .crop-group { font-size: 0.78rem; background: #e8f5e9; color: #2d7a3a; border-radius: 20px;
                  padding: 2px 10px; margin-left: 8px; font-weight: 600; display: inline; }

    .stat-grid { display: flex; gap: 0.8rem; margin-top: 0.8rem; flex-wrap: wrap; }
    .stat-box {
        background: #f8faf8;
        border-radius: 8px;
        padding: 0.5rem 0.9rem;
        flex: 1; min-width: 100px;
        text-align: center;
    }
    .stat-label { font-size: 0.7rem; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
    .stat-value { font-size: 1rem; font-weight: 700; color: #1a6b2e; }

    .why-text { font-size: 0.82rem; color: #666; margin-top: 0.7rem; font-style: italic; }
    .trend-tag { font-size: 0.8rem; margin-top: 0.5rem; }

    .location-info {
        background: #e8f5e9;
        border-radius: 10px;
        padding: 0.8rem 1.1rem;
        margin-bottom: 1rem;
        font-size: 0.88rem;
        color: #2d5a35;
    }

    .section-title {
        font-size: 1rem; font-weight: 600; color: #444;
        margin: 1.2rem 0 0.6rem;
        border-bottom: 2px solid #e0e0e0;
        padding-bottom: 0.4rem;
    }

    .other-crops {
        background: #f9f9f9;
        border-radius: 8px;
        padding: 0.7rem 1rem;
        font-size: 0.85rem;
        color: #555;
    }

    .click-hint {
        text-align: center;
        padding: 3rem 1rem;
        color: #aaa;
        font-size: 1rem;
    }
    .click-hint .icon { font-size: 3rem; margin-bottom: 0.5rem; }
</style>
""", unsafe_allow_html=True)

# ─────────────────────────────────────────────────────────
# Crop recommendation logic (inline from tools.py)
# ─────────────────────────────────────────────────────────
def haversine_km(lat1, lon1, lat2, lon2):
    R = 6371
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi    = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

@st.cache_resource
def load_crop_lookup():
    # Try to find the lookup JSON relative to this script or common paths
    candidates = [
        os.path.join(os.path.dirname(__file__), "models", "district_crop_lookup.json"),
        os.path.join(os.getcwd(), "models", "district_crop_lookup.json"),
        "models/district_crop_lookup.json",
        "district_crop_lookup.json",
    ]
    for path in candidates:
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
    return None

def get_top3_crops(lat: float, lon: float, district_name: str = None):
    lookup = load_crop_lookup()
    if lookup is None:
        return {"error": "district_crop_lookup.json not found. Please place it in a 'models/' folder."}

    districts   = lookup["districts"]
    alias_index = lookup.get("alias_index", {})

    matched_district = None
    match_method     = ""
    distance_km      = None

    # Step 1: Exact name match
    if district_name:
        key = district_name.strip().lower()
        idx = alias_index.get(key)
        if idx is None:
            for alias, i in alias_index.items():
                if key in alias or alias.split()[0] in key:
                    idx = i
                    break
        if idx is not None:
            matched_district = districts[idx]
            match_method     = "exact"

    # Step 2: Nearest by GPS
    if matched_district is None:
        best_km = float("inf")
        for d in districts:
            km = haversine_km(lat, lon, d["latitude"], d["longitude"])
            if km < best_km:
                best_km = km
                matched_district = d
        distance_km  = round(best_km, 1)
        match_method = "nearest_gps"

    if not matched_district:
        return {"error": "Could not find any matching district."}

    top3 = matched_district["crops"][:3]
    runners_up = [c["name"] for c in matched_district["crops"][3:6]]

    result_crops = []
    for rank, crop in enumerate(top3, 1):
        result_crops.append({
            "rank":        rank,
            "crop":        crop["name"],
            "crop_group":  crop.get("crop_group", ""),
            "avg_area_ha": crop.get("avg_area_ha", 0),
            "avg_yield_kg_ha": crop.get("avg_yield_kg_ha", 0),
            "avg_production_tonnes": crop.get("avg_production_tonnes", 0),
            "years_grown": crop.get("years_grown", 0),
            "trend":       crop.get("trend_label", "➡️ Stable"),
            "season":      crop.get("season", "Annual"),
            "why":         crop.get("why_this_crop", ""),
        })

    return {
        "crops":       result_crops,
        "district":    matched_district["district"],
        "state":       matched_district["state"],
        "match_type":  match_method,
        "distance_km": distance_km,
        "runners_up":  runners_up,
    }

# ─────────────────────────────────────────────────────────
# Header
# ─────────────────────────────────────────────────────────
st.markdown("""
<div class="hero-header">
    <h1>🌾 Agronex — India Crop Recommender</h1>
    <p>Click anywhere on the map to get the top 3 crops best suited for that location</p>
</div>
""", unsafe_allow_html=True)

# ─────────────────────────────────────────────────────────
# Layout
# ─────────────────────────────────────────────────────────
col_map, col_results = st.columns([3, 2], gap="large")

with col_map:
    st.markdown("""
    <div class="instruction-card">
        📍 <strong>Click on the map</strong> to select a location in India — the nearest agricultural 
        district will be identified and its top 3 crops will appear on the right.
    </div>
    """, unsafe_allow_html=True)

    # Build Folium map centred on India
    m = folium.Map(
        location=[20.5937, 78.9629],
        zoom_start=5,
        tiles="CartoDB positron",
        min_zoom=4,
        max_zoom=12,
    )

    # India boundary style
    folium.TileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        attr="Esri",
        name="Esri Topo",
    ).add_to(m)

    # Show previously clicked marker
    if "clicked_lat" in st.session_state:
        folium.Marker(
            location=[st.session_state.clicked_lat, st.session_state.clicked_lon],
            popup=f"Selected: {st.session_state.clicked_lat:.3f}, {st.session_state.clicked_lon:.3f}",
            icon=folium.Icon(color="green", icon="leaf", prefix="fa"),
        ).add_to(m)

    # Render map & capture click
    map_data = st_folium(
        m,
        width="100%",
        height=540,
        returned_objects=["last_clicked"],
        key="india_map",
    )

    # Handle click
    if map_data and map_data.get("last_clicked"):
        lat = map_data["last_clicked"]["lat"]
        lon = map_data["last_clicked"]["lng"]

        # Basic India bounding box check
        if 6.5 <= lat <= 37.5 and 68.0 <= lon <= 97.5:
            if (st.session_state.get("clicked_lat") != lat or
                st.session_state.get("clicked_lon") != lon):
                st.session_state.clicked_lat  = lat
                st.session_state.clicked_lon  = lon
                st.session_state.crop_results = get_top3_crops(lat, lon)
                st.rerun()
        else:
            st.warning("⚠️ Please click within India's boundaries.")

    st.caption("Map data © Esri | Agricultural data © ICRISAT 1997-2019")

# ─────────────────────────────────────────────────────────
# Results panel
# ─────────────────────────────────────────────────────────
with col_results:
    if "crop_results" not in st.session_state:
        st.markdown("""
        <div class="click-hint">
            <div class="icon">🗺️</div>
            <strong>Click on the India map</strong><br>
            to discover the best crops<br>for any location
        </div>
        """, unsafe_allow_html=True)

    else:
        data = st.session_state.crop_results

        if "error" in data:
            st.error(f"❌ {data['error']}")
        else:
            # Location info
            match_note = ""
            if data["match_type"] == "nearest_gps":
                match_note = f"<br>📡 Nearest district match ({data['distance_km']} km away)"

            st.markdown(f"""
            <div class="location-info">
                📍 <strong>{data['district']}, {data['state']}</strong>
                {match_note}
                <br>🌐 {st.session_state.clicked_lat:.3f}°N, {st.session_state.clicked_lon:.3f}°E
            </div>
            """, unsafe_allow_html=True)

            st.markdown("### 🏆 Top 3 Recommended Crops")

            rank_class = {1: "rank-1", 2: "rank-2", 3: "rank-3"}
            rank_emoji = {1: "🥇", 2: "🥈", 3: "🥉"}

            for crop in data["crops"]:
                r     = crop["rank"]
                rclass = rank_class[r]
                st.markdown(f"""
                <div class="crop-card {rclass}">
                    <div>
                        <span class="rank-badge">{rank_emoji[r]}</span>
                        <span class="crop-name">{crop['crop']}</span>
                        <span class="crop-group">{crop['crop_group']}</span>
                    </div>
                    <div class="stat-grid">
                        <div class="stat-box">
                            <div class="stat-label">Avg Area</div>
                            <div class="stat-value">{crop['avg_area_ha']:,.0f} ha</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-label">Avg Yield</div>
                            <div class="stat-value">{crop['avg_yield_kg_ha']:,.0f} kg/ha</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-label">Years Grown</div>
                            <div class="stat-value">{crop['years_grown']} yrs</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-label">Season</div>
                            <div class="stat-value">{crop['season']}</div>
                        </div>
                    </div>
                    <div class="trend-tag">{crop['trend']}</div>
                    {f'<div class="why-text">💡 {crop["why"]}</div>' if crop["why"] else ''}
                </div>
                """, unsafe_allow_html=True)

            # Other viable crops
            if data.get("runners_up"):
                st.markdown('<div class="section-title">🌱 Other Viable Crops</div>', unsafe_allow_html=True)
                st.markdown(f"""
                <div class="other-crops">
                    {" &nbsp;•&nbsp; ".join(data["runners_up"])}
                </div>
                """, unsafe_allow_html=True)

            st.markdown("""
            <div style="font-size:0.72rem; color:#aaa; margin-top:1rem;">
                Data source: ICRISAT District-level Production Dataset (1997–2019)
            </div>

            """, unsafe_allow_html=True)
