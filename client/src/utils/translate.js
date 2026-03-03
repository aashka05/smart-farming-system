import api from '../services/api';

/**
 * Translate text via the backend /api/translate proxy.
 * Falls back to returning the original text on failure.
 */
export const translateText = async (text, target) => {
  if (!text || target === 'en') return text;

  try {
    console.log('[translate] Calling POST /api/translate', { target, textLength: text.length });
    const { data } = await api.post('/translate', { text, target });
    console.log('[translate] Response received:', { translatedLength: data.translatedText?.length, error: data.error });
    return data.translatedText || text;
  } catch (err) {
    console.error('[translate] Error:', err.message);
    return text;
  }
};
