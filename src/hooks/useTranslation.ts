import { useCallback } from 'react';
import { en } from '../i18n/en';
import { mr } from '../i18n/mr';
import { useAppStore } from './useAppStore';
import type { Language } from '../types';

const translations: Record<Language, typeof en> = { en, mr };

export function useTranslation() {
  const { state, dispatch } = useAppStore();
  const lang = state.language;
  const t = translations[lang] || en;
  
  const setLanguage = useCallback((newLang: Language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: newLang });
  }, [dispatch]);
  
  return { t, lang, setLanguage };
}
