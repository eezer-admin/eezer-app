import { createContext, useEffect, useState } from 'react';

import i18n, { defaultLanguage } from '../localization/Localization';

export const LanguageContext = createContext<string>(defaultLanguage());

export const LanguageProvider = (props) => {
  const [language, setLanguage] = useState(props.language);

  // Update the i18n locale config before re-rendering the app.
  useEffect(() => {
    i18n.locale = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={[language, setLanguage]}>
      {props.children}
    </LanguageContext.Provider>
  );
};
