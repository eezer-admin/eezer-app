import i18n from 'i18n-js';
import { createContext, useState, useMemo } from 'react';

export const LanguageContext = createContext<string>('en');

export const LanguageProvider = (props) => {
  const [language, setLanguage] = useState(props.language);

  // Update the i18n locale config before re-rendering the app.
  useMemo(() => {
    i18n.locale = language;
  }, [language]);

  return <LanguageContext.Provider value={[language, setLanguage]}>{props.children}</LanguageContext.Provider>;
};
