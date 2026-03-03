"""
build_crop_lookup.py
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Reads area-production.xlsx and builds district → crop ranking lookup.

RANKING LOGIC (simple and correct):
  Rank crops by average AREA (hectares) across ALL historical years (1997-2019).
  The crop that farmers planted on the MOST LAND = best crop for that district.
  Farmers vote with their land — this is the ground truth.

  Tie-breaker: production trend (is area growing or shrinking?)

Run once:
    python build_crop_lookup.py
"""

import os, json, math
import pandas as pd
import numpy as np

CROP_NAMES = {
    "RICE": "Rice",           "WHT":  "Wheat",
    "SORG": "Sorghum (Jowar)","PMLT": "Pearl Millet (Bajra)",
    "MAIZ": "Maize (Corn)",   "FMLT": "Finger Millet (Ragi)",
    "BRLY": "Barley",         "SMLM": "Small Millets",
    "CPEA": "Chickpea (Gram)","PPEA": "Pigeon Pea (Arhar/Tur)",
    "BLCK": "Black Gram (Urad)","HORS":"Horse Gram",
    "LENT": "Lentil (Masoor)","GREN": "Green Gram (Moong)",
    "MOTH": "Moth Bean",      "COWP": "Cowpea",
    "PEBE": "Field Pea",      "KHES": "Khesari (Grass Pea)",
    "OKFP": "Other Kharif Pulses","ORBP":"Other Rabi Pulses",
    "GNUT": "Groundnut",      "SESA": "Sesame (Til)",
    "RM":   "Rapeseed & Mustard","SAFF":"Safflower",
    "CAST": "Castor",         "LINS": "Linseed",
    "SUNF": "Sunflower",      "SOYA": "Soybean",
    "NIGS": "Nigerseed",      "OOIL": "Other Oilseeds",
    "SCAN": "Sugarcane",      "SGUR": "Sugar (Gur)",
    "COTN": "Cotton",         "JUTE": "Jute",
    "MEST": "Mesta",          "SANH": "Sannhemp",
    "TOBA": "Tobacco",        "ONIO": "Onion",
    "POTA": "Potato",         "SWTP": "Sweet Potato",
    "TURM": "Turmeric",       "CORI": "Coriander",
    "TAPI": "Tapioca",        "AREC": "Areca Nut",
    "COCO": "Coconut",        "CASH": "Cashew",
    "BANA": "Banana",         "DRYC": "Dry Chillies",
    "GARL": "Garlic",         "GING": "Ginger",
    "BLKP": "Black Pepper",   "CARD": "Cardamom",
    "GUAR": "Guar (Cluster Bean)",
}

CROP_GROUPS = {
    "cereals":      ["RICE","WHT","SORG","PMLT","MAIZ","FMLT","BRLY","SMLM"],
    "pulses":       ["CPEA","PPEA","BLCK","HORS","LENT","GREN","MOTH","COWP","PEBE","KHES","OKFP","ORBP"],
    "oilseeds":     ["GNUT","SESA","RM","SAFF","CAST","LINS","SUNF","SOYA","NIGS","OOIL"],
    "commercial":   ["SCAN","SGUR","COTN","JUTE","MEST","SANH","TOBA","GUAR"],
    "horticulture": ["ONIO","POTA","SWTP","BANA","DRYC","GARL","GING","TAPI"],
    "plantation":   ["AREC","COCO","CASH","TURM","CORI","BLKP","CARD"],
}
CODE_TO_GROUP = {code: grp for grp, codes in CROP_GROUPS.items() for code in codes}


def _trend_label(series: pd.Series) -> str:
    if len(series) < 3:
        return "➡️ Stable"
    slope = np.polyfit(np.arange(len(series)), series.values.astype(float), 1)[0]
    mean_ = series.mean()
    if mean_ == 0:
        return "➡️ Stable"
    ratio = slope / mean_
    if ratio > 0.03:  return "📈 Growing"
    if ratio < -0.03: return "📉 Declining"
    return "➡️ Stable"


def build_lookup():
    base      = os.path.dirname(os.path.abspath(__file__))
    xlsx_path = os.path.join(base, "area-production.xlsx")
    out_dir   = os.path.join(base, "models")
    os.makedirs(out_dir, exist_ok=True)

    print("📂 Loading area-production.xlsx …")
    df = pd.read_excel(xlsx_path, header=9)
    print(f"   Loaded {len(df):,} rows × {len(df.columns)} cols")

    # Column maps: code → column name
    ta_map = {c.replace("_TA","").strip(): c for c in df.columns if str(c).strip().endswith("_TA")}
    tq_map = {c.replace("_TQ","").strip(): c for c in df.columns if str(c).strip().endswith("_TQ")}
    ty_map = {c.replace("_TY","").strip(): c for c in df.columns if str(c).strip().endswith("_TY")}
    # Only process crops that have at least an area column
    all_crop_codes = list(ta_map.keys())
    print(f"   {len(all_crop_codes)} crops with area data")

    df["DISTNAME_CLEAN"] = df["DISTNAME"].astype(str).str.strip().str.title()
    df["STNAME_CLEAN"]   = df["STNAME"].astype(str).str.strip().str.title()
    df["YEAR"]           = pd.to_numeric(df["YEAR"], errors="coerce")

    group_cols = ["DISTNAME_CLEAN","STNAME_CLEAN","Latitude","Longitude"]
    districts  = df[group_cols].drop_duplicates().dropna(subset=["Latitude","Longitude"])
    print(f"   Processing {len(districts):,} districts …")

    records = []
    for _, drow in districts.iterrows():
        dname = drow["DISTNAME_CLEAN"]
        sname = drow["STNAME_CLEAN"]
        lat   = float(drow["Latitude"])
        lon   = float(drow["Longitude"])

        sub = df[df["DISTNAME_CLEAN"] == dname].sort_values("YEAR")
        if len(sub) == 0:
            continue

        crop_rows = []
        for code in all_crop_codes:
            ta_col = ta_map[code]
            readable = CROP_NAMES.get(code, code)

            # ── PRIMARY SIGNAL: historical average area (ALL years 1997-2019) ──
            area_vals = pd.to_numeric(sub[ta_col], errors="coerce").dropna()
            area_vals = area_vals[area_vals > 0]
            if len(area_vals) < 2:
                continue  # never meaningfully grown here

            avg_area    = float(area_vals.mean())
            years_grown = int(len(area_vals))

            # ── Trend on area ──────────────────────────────────────────────
            trend = _trend_label(area_vals)

            # ── Yield (for display only, recent median to avoid bad years) ──
            ty_col = ty_map.get(code)
            if ty_col:
                y_vals = pd.to_numeric(sub[ty_col], errors="coerce").dropna()
                y_vals = y_vals[y_vals > 0]
                avg_yield = float(y_vals.median()) if len(y_vals) > 0 else 0.0
            else:
                avg_yield = 0.0

            # ── Production (for display only) ─────────────────────────────
            tq_col = tq_map.get(code)
            if tq_col:
                q_vals = pd.to_numeric(sub[tq_col], errors="coerce").dropna()
                q_vals = q_vals[q_vals > 0]
                avg_prod = float(q_vals.median()) if len(q_vals) > 0 else 0.0
            else:
                avg_prod = 0.0

            # ── Season ─────────────────────────────────────────────────────
            season = "Annual"
            try:
                possible_ka = [c for c in df.columns if c.startswith(code+"_K") and c.endswith("A")]
                possible_ra = [c for c in df.columns if c.startswith(code+"_R") and c.endswith("A")]
                k = pd.to_numeric(sub[possible_ka[0]], errors="coerce").fillna(0).sum() if possible_ka else 0
                r = pd.to_numeric(sub[possible_ra[0]], errors="coerce").fillna(0).sum() if possible_ra else 0
                if k > 0 and r > 0:   season = "Kharif & Rabi"
                elif k > r:            season = "Kharif (Monsoon)"
                elif r > k:            season = "Rabi (Winter)"
            except Exception:
                pass

            crop_rows.append({
                "code":                  code,
                "name":                  readable,
                "crop_group":            CODE_TO_GROUP.get(code, "other"),
                "avg_area_ha":           round(avg_area, 1),    # PRIMARY ranking key
                "avg_yield_kg_ha":       round(avg_yield, 1),
                "avg_production_tonnes": round(avg_prod, 1),
                "years_grown":           years_grown,
                "trend_label":           trend,
                "season":                season,
            })

        if not crop_rows:
            continue

        # ── RANK by avg_area descending (farmers vote with their land) ────
        crop_rows.sort(key=lambda x: x["avg_area_ha"], reverse=True)

        records.append({
            "district":  dname,
            "state":     sname,
            "latitude":  lat,
            "longitude": lon,
            "crops":     crop_rows,
        })

    print(f"   Built lookup for {len(records):,} districts")

    # Alias index
    alias_index = {}
    for i, rec in enumerate(records):
        alias_index[rec["district"].lower()] = i
        alias_index[f"{rec['district'].lower()} {rec['state'].lower()}"] = i

    lookup = {"districts": records, "alias_index": alias_index}
    out_path = os.path.join(out_dir, "district_crop_lookup.json")
    print(f"💾 Saving → {out_path} …")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(lookup, f, separators=(",", ":"))

    size_mb = os.path.getsize(out_path) / (1024 * 1024)
    print(f"✅ Done!  {size_mb:.1f} MB  |  {len(records)} districts")

    # ── Sample output ──────────────────────────────────────────────────────
    for target in ["Jamnagar", "Ludhiana", "Pune", "Thrissur"]:
        idx = alias_index.get(target.lower())
        if idx is None: continue
        s = records[idx]
        print(f"\n{s['district']}, {s['state']}:")
        for c in s["crops"][:5]:
            print(f"  {c['name']:<30} area={c['avg_area_ha']:>8.1f} ha  yield={c['avg_yield_kg_ha']:>7.1f} kg/ha  {c['trend_label']}  [{c['season']}]")


if __name__ == "__main__":
    build_lookup()
