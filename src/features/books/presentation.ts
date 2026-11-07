import type { Category } from './types';

export const CATEGORY_PRESENTATION: Record<Category, { className: string; color: string }> = {
  CNTT: { className: 'tech', color: '#448674' },
  'Kinh tế': { className: 'business', color: '#a57b3e' },
  'Ngoại ngữ': { className: 'language', color: '#7b87a9' },
};
