import i18n from 'i18n-js';

import translations from './Translations';

i18n.translations = translations;
i18n.fallbacks = true;

export function supportedLanguages(): string[] {
  return ['en', 'fr', 'rn', 'sw'];
}

export function defaultLanguage(): string {
  return 'en';
}

export function __(string: string): string {
  const translated = i18n.t(string);

  // If the translation is missing completely, return the input string.
  if (translated.indexOf('[missing') > -1) {
    return string;
  }

  return translated;
}

export default i18n;
