const pool = require('../config/db');
const axios = require('axios');
const { getLatestStationData } = require('./weatherStationController');

// -------------------------------------------------------
// @desc    Get farmer dashboard data (weather, crop health,
//          market alerts, irrigation advice, risk alerts)
// @route   GET /api/dashboard
// @access  Private
// -------------------------------------------------------
const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;

    // ── 1. Link auth user → farmer via email ──────────
    let farmerId = null;

    const farmerResult = await pool.query(
      'SELECT id, full_name FROM farmers WHERE email = $1 LIMIT 1',
      [userEmail]
    );

    if (farmerResult.rows.length > 0) {
      farmerId = farmerResult.rows[0].id;
    }

    // ── 2. Weather summary ────────────────────────────
    let weather = { temp: null, humidity: null, rainfall: null, wind: null };
    let soilMoisture = null;

    if (farmerId) {
      const sensorResult = await pool.query(
        `SELECT sd.air_temperature_c,
                sd.air_humidity_percent,
                sd.soil_moisture_percent,
                sd.rainfall_mm,
                sd.wind_speed_mps,
                sd.recorded_at
         FROM sensor_data sd
         JOIN weather_stations ws ON sd.station_id = ws.id
         JOIN fields f           ON ws.field_id   = f.id
         WHERE f.farmer_id = $1
         ORDER BY sd.recorded_at DESC
         LIMIT 1`,
        [farmerId]
      );

      if (sensorResult.rows.length > 0) {
        const s = sensorResult.rows[0];
        weather = {
          temp: parseFloat(s.air_temperature_c),
          humidity: parseFloat(s.air_humidity_percent),
          rainfall: parseFloat(s.rainfall_mm),
          wind: parseFloat(s.wind_speed_mps),
        };
        soilMoisture = parseFloat(s.soil_moisture_percent);
      }
    }

    // Fallback: in-memory station data (IoT live feed)
    if (weather.temp === null) {
      const stationData = getLatestStationData();
      if (stationData) {
        weather = {
          temp: stationData.air_temperature,
          humidity: stationData.humidity,
          rainfall: stationData.rainfall || 0,
          wind: stationData.wind_speed,
        };
        soilMoisture = stationData.soil_moisture;
      }
    }

    // Final fallback: live Open-Meteo API, then reasonable defaults
    if (weather.temp === null) {
      try {
        const meteoUrl = process.env.OPEN_METEO_BASE_URL || 'https://api.open-meteo.com/v1/forecast';
        const meteoRes = await axios.get(meteoUrl, {
          params: {
            latitude: parseFloat(process.env.DEFAULT_LATITUDE) || 22.3072,
            longitude: parseFloat(process.env.DEFAULT_LONGITUDE) || 73.1812,
            current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation',
            timezone: 'auto',
          },
          timeout: 10000,
        });
        const cur = meteoRes.data.current;
        weather = {
          temp: cur?.temperature_2m ?? 31.2,
          humidity: cur?.relative_humidity_2m ?? 58,
          rainfall: cur?.precipitation ?? 0,
          wind: cur?.wind_speed_10m ?? 4.5,
        };
        console.log('\ud83c\udf10 Dashboard weather from Open-Meteo API');
      } catch (meteoErr) {
        console.error('\u26a0\ufe0f Dashboard Open-Meteo fallback failed:', meteoErr.message);
        weather = { temp: 31.2, humidity: 58, rainfall: 0, wind: 4.5 };
      }
      soilMoisture = soilMoisture ?? 42;
    }

    // ── 3. Crop health ────────────────────────────────
    let cropHealth = {
      cropName: 'N/A',
      healthScore: 0,
      diseaseRisk: 'No data',
    };

    if (farmerId) {
      // Latest disease detection for this farmer's fields
      const diseaseResult = await pool.query(
        `SELECT dd.detected_disease, dd.confidence_score, f.field_name
         FROM disease_detections dd
         JOIN fields f ON dd.field_id = f.id
         WHERE f.farmer_id = $1
         ORDER BY dd.detected_at DESC
         LIMIT 1`,
        [farmerId]
      );

      // Primary field
      const fieldResult = await pool.query(
        'SELECT field_name, soil_type FROM fields WHERE farmer_id = $1 ORDER BY created_at ASC LIMIT 1',
        [farmerId]
      );

      if (fieldResult.rows.length > 0) {
        const field = fieldResult.rows[0];
        const disease = diseaseResult.rows[0] || null;
        // Health score: inverse of latest disease confidence (higher conf = lower health)
        const healthScore = disease
          ? Math.max(0, Math.round(100 - parseFloat(disease.confidence_score)))
          : 85;

        cropHealth = {
          cropName: field.field_name
            .replace(/(Field|Farm|Plot|Paddy|Garden|Grove|Plantation|Orchard|Station)/gi, '')
            .replace(/\s+/g, ' ')
            .trim(),
          healthScore,
          diseaseRisk: disease ? disease.detected_disease : 'None detected',
        };
      }
    }

    // ── 4. Market price alert ─────────────────────────
    //    (No PostgreSQL market table exists — derive from
    //     field crop names + simulated price logic)
    let market = {
      topCrop: 'Rice',
      currentPrice: 2100,
      priceChange: 3.2,
      alert: 'Price rising — consider selling',
    };

    if (farmerId) {
      // Derive primary crop from field names
      const cropField = await pool.query(
        'SELECT field_name FROM fields WHERE farmer_id = $1 ORDER BY area_hectares DESC LIMIT 1',
        [farmerId]
      );

      if (cropField.rows.length > 0) {
        const cropName = cropField.rows[0].field_name
          .replace(/(Field|Farm|Plot|Paddy|Garden|Grove|Plantation|Orchard|Station|North|South|East|West)/gi, '')
          .replace(/\s+/g, ' ')
          .trim();

        // Simulated price data keyed by common crops
        const priceTable = {
          Rice: { price: 2100, change: 3.2 },
          Wheat: { price: 2300, change: -1.5 },
          Cotton: { price: 5800, change: 4.1 },
          Sugarcane: { price: 310, change: 1.8 },
          Groundnut: { price: 5200, change: -3.5 },
          Millet: { price: 2200, change: 2.0 },
          Soybean: { price: 4500, change: -4.2 },
          Maize: { price: 1600, change: 2.8 },
          Tea: { price: 18000, change: 1.2 },
          Coconut: { price: 12000, change: 0.5 },
          Onion: { price: 1600, change: 5.5 },
          Tomato: { price: 1100, change: -6.0 },
          Mustard: { price: 5100, change: 2.1 },
          Lentil: { price: 5600, change: -1.0 },
          Apple: { price: 8500, change: 3.8 },
          Rubber: { price: 16000, change: -0.8 },
          Potato: { price: 800, change: -2.5 },
          Turmeric: { price: 7200, change: 4.6 },
        };

        // Try matching crop name to price table
        const matched = Object.keys(priceTable).find((c) =>
          cropName.toLowerCase().includes(c.toLowerCase())
        );

        if (matched) {
          const p = priceTable[matched];
          let alert;
          if (p.change > 3) {
            alert = `${matched} prices up ${p.change}% — consider selling`;
          } else if (p.change < -3) {
            alert = `${matched} prices down ${Math.abs(p.change)}% — consider holding`;
          } else {
            alert = `${matched} prices stable — monitor market`;
          }

          market = {
            topCrop: matched,
            currentPrice: p.price,
            priceChange: p.change,
            alert,
          };
        }
      }
    }

    // Try live market API for real-time prices
    try {
      const MARKET_API_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';
      const marketRes = await axios.get(MARKET_API_URL, {
        params: {
          'api-key': '579b464db66ec23bdd0000010aa6c3f3acb747e15ce120e5c74de5ce',
          format: 'json',
          limit: 5,
          ...(market.topCrop !== 'Rice' ? { 'filters[commodity]': market.topCrop } : {}),
        },
        timeout: 10000,
      });

      const records = marketRes.data?.records || [];
      if (records.length > 0) {
        const rec = records[0];
        const livePrice = Number(rec.modal_price);
        if (livePrice > 0) {
          market = {
            topCrop: rec.commodity || market.topCrop,
            currentPrice: livePrice,
            priceChange: market.priceChange,
            alert: `Live price from ${rec.market || 'mandi'} — ₹${livePrice.toLocaleString('en-IN')}/q`,
          };
          console.log('📊 Dashboard market from live API');
        }
      }
    } catch (marketErr) {
      console.error('⚠️ Live market API failed:', marketErr.message);
    }

    // ── 5. Irrigation advisory ────────────────────────
    let irrigation = {
      recommendation: 'No sensor data available',
      soilMoistureStatus: 'Unknown',
    };

    if (soilMoisture !== null) {
      if (soilMoisture < 30) {
        irrigation = {
          recommendation: 'Irrigation required',
          soilMoistureStatus: 'Low',
        };
      } else if (weather.rainfall > 5) {
        irrigation = {
          recommendation: 'Delay irrigation',
          soilMoistureStatus: 'Adequate (recent rainfall)',
        };
      } else {
        irrigation = {
          recommendation: 'Optimal moisture',
          soilMoistureStatus: 'Good',
        };
      }
    }

    // ── 6. Risk alerts ────────────────────────────────
    const risks = [];

    if (weather.temp > 38) {
      risks.push({
        type: 'Heat Stress',
        severity: 'critical',
        message: `Temperature is ${weather.temp.toFixed(1)}°C — heat stress risk. Increase irrigation and provide shade where possible.`,
      });
    }

    if (weather.humidity > 80) {
      risks.push({
        type: 'Fungal Disease',
        severity: 'warning',
        message: `Humidity at ${weather.humidity.toFixed(0)}% — elevated fungal disease risk. Monitor crops closely and apply preventive fungicide.`,
      });
    }

    if (weather.wind > 20) {
      risks.push({
        type: 'Spray Caution',
        severity: 'warning',
        message: `Wind speed ${weather.wind.toFixed(1)} m/s — avoid pesticide spraying. Drift may damage neighboring crops.`,
      });
    }

    if (risks.length === 0) {
      risks.push({
        type: 'All Clear',
        severity: 'safe',
        message: 'No critical risks detected. Conditions are favorable for farming operations.',
      });
    }

    // ── Build response ────────────────────────────────
    res.json({
      weather: {
        temp: weather.temp,
        humidity: weather.humidity,
        rainfall: weather.rainfall,
        wind: weather.wind,
      },
      cropHealth,
      market,
      irrigation,
      risks,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      message: 'Error fetching dashboard data',
      error: error.message,
    });
  }
};

module.exports = { getDashboard };
