import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en/translation.json';
import deTranslation from './locales/de/translation.json';
import ruTranslation from './locales/ru/translation.json';
import frTranslation from './locales/fr/translation.json';
import ukTranslation from './locales/uk/translation.json';
import esTranslation from './locales/es/translation.json';
import itTranslation from './locales/it/translation.json';

const defaultResources = {
  en: { translation: enTranslation },
  de: { translation: deTranslation },
  ru: { translation: ruTranslation },
  fr: { translation: frTranslation },
  uk: { translation: ukTranslation },
  es: { translation: esTranslation },
  it: { translation: itTranslation },
};

// Load overrides from localStorage (CMS Feature)
const loadOverrides = () => {
  try {
    const overrides = localStorage.getItem('zetta_content_overrides');
    if (overrides) {
      return JSON.parse(overrides);
    }
  } catch (e) {
    console.error('Failed to load content overrides', e);
  }
  return {};
};

const applyOverrides = (resources: any, overrides: any) => {
  const merged = JSON.parse(JSON.stringify(resources));
  for (const lang in overrides) {
    if (merged[lang]) {
      merged[lang].translation = { ...merged[lang].translation, ...overrides[lang] };
    }
  }
  return merged;
};

const initialResources = applyOverrides(defaultResources, loadOverrides());

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: initialResources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['navigator', 'querystring', 'localStorage', 'htmlTag'],
      caches: ['localStorage'],
    }
  });

// Expose a method to dynamically update translations from CMS
export const updateTranslations = (overrides: any) => {
  localStorage.setItem('zetta_content_overrides', JSON.stringify(overrides));
  const newResources = applyOverrides(defaultResources, overrides);
  for (const lang in newResources) {
    i18n.addResourceBundle(lang, 'translation', newResources[lang].translation, true, true);
  }
  i18n.emit('loaded'); // Force re-render
};

export const getDefaultResources = () => defaultResources;

export default i18n;
