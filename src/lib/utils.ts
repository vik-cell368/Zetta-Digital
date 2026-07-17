import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { de, enUS, ru, fr, uk, es, it } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

const locales: Record<string, any> = {
  de,
  en: enUS,
  ru,
  fr,
  uk,
  es,
  it
};

export function getDateLocale(lang: string) {
  return locales[lang] || enUS;
}

export function getTranslatedText(text: string | null, language: string): string {
  if (!text) return '';
  try {
    const parsed = JSON.parse(text);
    if (typeof parsed === 'object' && parsed !== null) {
      // Use current language, or fallback to 'en', or 'de', or the first available key, or raw string if object format unexpected
      const langPrefix = language.split('-')[0];
      return parsed[langPrefix] || parsed['en'] || parsed['de'] || Object.values(parsed)[0] || text;
    }
    return text;
  } catch (e) {
    return text; // Not JSON, return as is
  }
}
