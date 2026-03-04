import { useLanguage } from '../context/LanguageContext';
import translations from './translations';

/**
 * Hook that translates a flat object of English strings using a local dictionary.
 * No network requests — translations are instant and always available.
 *
 * Computes synchronously on every render so language changes are
 * always reflected immediately across all pages (including dashboard).
 *
 * Usage:
 *   const strings = useMemo(() => ({ title: 'Hello', btn: 'Click Me' }), []);
 *   const { t } = useTranslation(strings);
 *   <h1>{t.title}</h1>
 */
export function useTranslation(strings) {
  const { language } = useLanguage();

  // English is the source language — return as-is
  if (language === 'en') return { t: strings, language };

  const dict = translations[language] || {};
  const result = {};

  for (const [key, value] of Object.entries(strings)) {
    result[key] = dict[value] || value; // fallback to English if not in dictionary
  }

  return { t: result, language };
}
