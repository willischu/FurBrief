'use client';

import { useEffect, useState } from 'react';

export type Lang = 'en' | 'es' | 'ko' | 'zh';
const STORAGE_KEY = 'furbrief_lang';
const VALID: Lang[] = ['en', 'es', 'ko', 'zh'];

export function useLanguage(): [Lang, (l: Lang) => void] {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang;
    if (stored && VALID.includes(stored)) setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  };

  return [lang, setLang];
}
