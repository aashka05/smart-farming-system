const axios = require('axios');

// @desc    Translate text to target language
// @route   POST /api/translate
// @access  Public
const translateText = async (req, res) => {
  try {
    const { text, target } = req.body;

    console.log('[Translate] Request received:', { target, textLength: text?.length });

    if (!text || !target) {
      return res.status(400).json({ message: 'text and target language are required' });
    }

    const allowedLangs = ['en', 'hi', 'gu'];
    if (!allowedLangs.includes(target)) {
      return res.status(400).json({ message: `Invalid target language. Allowed: ${allowedLangs.join(', ')}` });
    }

    // If target is English, return text as-is (source is English)
    if (target === 'en') {
      return res.json({ translatedText: text });
    }

    const apiUrl = process.env.LIBRE_TRANSLATE_URL || 'https://libretranslate.de/translate';
    console.log('[Translate] Calling API:', apiUrl);

    const response = await axios.post(
      apiUrl,
      {
        q: text,
        source: 'en',
        target: target,
        format: 'text',
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000,
      }
    );

    console.log('[Translate] API response OK, translated length:', response.data?.translatedText?.length);
    res.json({ translatedText: response.data.translatedText });
  } catch (error) {
    console.error('[Translate] Error:', error.message);
    if (error.response) {
      console.error('[Translate] API status:', error.response.status);
      console.error('[Translate] API data:', JSON.stringify(error.response.data));
    }
    // Return original text on failure so the app doesn't break
    res.status(200).json({
      translatedText: req.body?.text || '',
      error: 'Translation service unavailable, returning original text',
    });
  }
};

module.exports = { translateText };
