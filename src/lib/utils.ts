import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
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
