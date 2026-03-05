const axios = require('axios');
const pool = require('../config/db');

// Correct endpoint: /identification (NOT /health_assessment which returns 404)
const KINDWISE_API_URL = 'https://crop.kindwise.com/api/v1/identification';

// -------------------------------------------------------
// Google Translate (free, no key needed) — fallback to original on failure
// -------------------------------------------------------
async function gTranslate(text, targetLang) {
  if (!text || targetLang === 'en') return text;
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const resp = await axios.get(url, { timeout: 8000 });
    return resp.data[0].map(s => s[0]).join('');
  } catch {
    return text;
  }
}

// -------------------------------------------------------
// @desc    Identify crop disease from image via Kindwise API
// @route   POST /api/crop-health/identify
// @access  Private
// -------------------------------------------------------
const identifyCropDisease = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const apiKey = process.env.KINDWISE_API_KEY;
    if (!apiKey || apiKey === 'YOUR_KINDWISE_API_KEY_HERE') {
      return res.status(503).json({
        message: 'Crop Health API key not configured. Please add KINDWISE_API_KEY to server .env file.',
      });
    }

    // Language mapping for Kindwise API
    const langMap = { en: 'en', hi: 'hi', gu: 'gu' };
    const lang = langMap[req.body.language] || 'en';

    // Strip data URL prefix if present (e.g., "data:image/png;base64,...")
    const base64Data = image.includes(',') ? image.split(',')[1] : image;

    // Send as JSON with base64 image; request description + treatment details in user's language
    const response = await axios.post(
      `${KINDWISE_API_URL}?details=description,treatment&language=${lang}`,
      { images: [base64Data] },
      {
        headers: {
          'Api-Key': apiKey,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      }
    );

    const data = response.data;
    const diseaseResult = data.result?.disease;
    const cropResult = data.result?.crop;
    const isHealthyResult = data.result?.is_healthy;

    // Get top disease suggestion
    const topDisease = diseaseResult?.suggestions?.[0];
    const topCrop = cropResult?.suggestions?.[0];

    // Determine if plant is healthy
    // is_healthy may be undefined for /identification; derive from disease name
    const isHealthy = isHealthyResult?.binary
      ?? (topDisease?.name === 'healthy' || !topDisease);

    // Confidence: disease probability
    const confidence = Math.round((topDisease?.probability || 0) * 100);

    // Health score: inverse of disease confidence if unhealthy
    const healthScore = isHealthyResult?.probability != null
      ? Math.round(isHealthyResult.probability * 100)
      : (isHealthy ? 95 : Math.max(0, 100 - confidence));

    // Build treatment list from details
    const treatmentDetails = topDisease?.details?.treatment;
    const treatmentList = [];
    if (treatmentDetails) {
      if (treatmentDetails.biological) {
        const items = Array.isArray(treatmentDetails.biological)
          ? treatmentDetails.biological : [treatmentDetails.biological];
        treatmentList.push(...items.filter(Boolean));
      }
      if (treatmentDetails.chemical) {
        const items = Array.isArray(treatmentDetails.chemical)
          ? treatmentDetails.chemical : [treatmentDetails.chemical];
        treatmentList.push(...items.filter(Boolean));
      }
      if (treatmentDetails.prevention) {
        const items = Array.isArray(treatmentDetails.prevention)
          ? treatmentDetails.prevention : [treatmentDetails.prevention];
        treatmentList.push(...items.filter(Boolean));
      }
    }

    // --- Truncate description to first 2 sentences (max 300 chars) ---
    let shortDesc = null;
    const rawDesc = topDisease?.details?.description;
    if (rawDesc) {
      // Split on sentence-ending punctuation (. ! ? or Hindi ।)
      const sentences = rawDesc.match(/[^.!?।]+[.!?।]+/g);
      shortDesc = sentences && sentences.length > 2
        ? sentences.slice(0, 2).join('').trim()
        : rawDesc;
      // Hard cap at 300 characters
      if (shortDesc.length > 300) shortDesc = shortDesc.slice(0, 297) + '...';
    }

    const result = {
      disease: topDisease?.name || 'Healthy',
      confidence,
      healthScore,
      description: shortDesc,
      treatment: treatmentList.length > 0 ? treatmentList : null,
      isHealthy,
      crop: topCrop?.name || null,
    };

    // --- Translate to user's language if not English ---
    if (lang !== 'en') {
      const [diseaseTr, descTr, cropTr, ...treatmentTr] = await Promise.all([
        gTranslate(result.disease, lang),
        gTranslate(result.description, lang),
        gTranslate(result.crop, lang),
        ...(result.treatment || []).map(t => gTranslate(t, lang)),
      ]);
      result.disease = diseaseTr;
      result.description = descTr;
      result.crop = cropTr;
      if (result.treatment) result.treatment = treatmentTr;
    }

    console.log('✅ Crop health result:', result.disease, `(${result.confidence}%)`, 'Crop:', result.crop, 'Lang:', lang);
    res.json(result);

    // Save detection to database (fire-and-forget, does not block response)
    try {
      await pool.query(
        `INSERT INTO disease_detections (farmer_id, detected_disease, confidence_score, image_url)
         VALUES ($1, $2, $3, $4)`,
        [req.user.id, topDisease?.name || 'Healthy', topDisease?.probability || 0, 'uploaded']
      );
      console.log('✅ Disease detection saved to DB for farmer', req.user.id);
    } catch (dbErr) {
      console.error('⚠️ Could not save disease detection:', dbErr.message);
    }
  } catch (error) {
    console.error('Crop health identification error:', error.response?.status, error.response?.data || error.message);

    if (error.response?.status === 401) {
      return res.status(401).json({ message: 'Invalid Kindwise API key. Please check your KINDWISE_API_KEY.' });
    }
    if (error.response?.status === 429) {
      return res.status(429).json({ message: 'API rate limit exceeded. Please try again later.' });
    }

    res.status(500).json({
      message: 'Unable to analyze crop image. Please try again.',
      error: error.response?.data || error.message,
    });
  }
};

module.exports = { identifyCropDisease };
