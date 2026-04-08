'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type Lang = 'en' | 'es' | 'ko' | 'zh';
const STORAGE_KEY = 'furbrief_lang';
const VALID: Lang[] = ['en', 'es', 'ko', 'zh'];

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang;
    if (stored && VALID.includes(stored)) setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): [Lang, (l: Lang) => void] {
  const { lang, setLang } = useContext(LanguageContext);
  return [lang, setLang];
}
