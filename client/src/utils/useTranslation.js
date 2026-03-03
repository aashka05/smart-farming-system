import { useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import translations from './translations';

/**
 * Hook that translates a flat object of English strings using a local dictionary.
 * No network requests — translations are instant and always available.
 *
 * Usage:
 *   const strings = useMemo(() => ({ title: 'Hello', btn: 'Click Me' }), []);
 *   const { t } = useTranslation(strings);
 *   <h1>{t.title}</h1>
 */
export function useTranslation(strings) {
  const { language } = useLanguage();
  const stringsKey = JSON.stringify(strings);

  const translated = useMemo(() => {
    const current = JSON.parse(stringsKey);

    // English is the source language — return as-is
    if (language === 'en') return current;

    const dict = translations[language] || {};
    const result = {};

    for (const [key, value] of Object.entries(current)) {
      result[key] = dict[value] || value; // fallback to English if not in dictionary
    }

    return result;
  }, [language, stringsKey]);

  return { t: translated, language };
}
