import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

import i18n, { defaultLanguage } from '../localization/Localization';

// The provider supplies the [value, setter] pair returned by useState.
export type LanguageContextData = [string, Dispatch<SetStateAction<string>>];

export const LanguageContext = createContext<LanguageContextData>([defaultLanguage(), () => {}]);

export const LanguageProvider = (props: PropsWithChildren<{ language: string }>) => {
  const [language, setLanguage] = useState<string>(props.language);

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
