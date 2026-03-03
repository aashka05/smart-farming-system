import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';

const LanguageContext = createContext(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};

// In-memory cache to avoid repeated API calls for the same text+lang
const cache = {};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('sf_language') || 'en';
  });

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang);
    localStorage.setItem('sf_language', lang);
  }, []);

  // Translate a single string
  const translate = useCallback(async (text, targetLang) => {
    const target = targetLang || language;
    if (!text || target === 'en') return text;

    const cacheKey = `${target}::${text}`;
    if (cache[cacheKey]) return cache[cacheKey];

    try {
      console.log('[LanguageCtx] translate →', { target, textLength: text.length });
      const { data } = await api.post('/translate', { text, target });
      const result = data.translatedText || text;
      cache[cacheKey] = result;
      return result;
    } catch (err) {
      console.error('[LanguageCtx] translate error:', err.message);
      return text;
    }
  }, [language]);

  // Translate an array of strings in one batch (concatenate, translate, split)
  const translateBatch = useCallback(async (texts, targetLang) => {
    const target = targetLang || language;
    if (!texts || texts.length === 0) return texts;
    if (target === 'en') return texts;

    // Check which ones are already cached
    const results = new Array(texts.length);
    const toTranslate = [];
    const indices = [];

    texts.forEach((t, i) => {
      const cacheKey = `${target}::${t}`;
      if (cache[cacheKey]) {
        results[i] = cache[cacheKey];
      } else {
        toTranslate.push(t);
        indices.push(i);
      }
    });

    if (toTranslate.length === 0) return results;

    // Batch translate by joining with a separator
    const separator = ' ||| ';
    const joined = toTranslate.join(separator);

    try {
      console.log('[LanguageCtx] translateBatch →', { target, count: toTranslate.length });
      const { data } = await api.post('/translate', { text: joined, target });
      console.log('[LanguageCtx] translateBatch response OK');
      const translated = (data.translatedText || joined).split(separator);

      indices.forEach((origIdx, j) => {
        const val = (translated[j] || toTranslate[j]).trim();
        const cacheKey = `${target}::${toTranslate[j]}`;
        cache[cacheKey] = val;
        results[origIdx] = val;
      });
    } catch (err) {
      console.error('[LanguageCtx] translateBatch error:', err.message);
      indices.forEach((origIdx, j) => {
        results[origIdx] = toTranslate[j];
      });
    }

    return results;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate, translateBatch }}>
      {children}
    </LanguageContext.Provider>
  );
};
