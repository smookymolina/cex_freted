import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

const STORAGE_KEY = 'cex_freted_language';
const LANGUAGE_OPTIONS = [
  { code: 'es', label: 'Espa\u00f1ol', flag: '\uD83C\uDDEA\uD83C\uDDF8' },
  { code: 'en', label: 'English', flag: '\uD83C\uDDFA\uD83C\uDDF8' },
];

const isBrowser = () => typeof window !== 'undefined';

const persistLanguage = (langCode) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, langCode);
  document.documentElement.lang = langCode;
};

const getLanguage = (code) =>
  LANGUAGE_OPTIONS.find((option) => option.code === code) ?? LANGUAGE_OPTIONS[0];

export default function LanguageSwitcher({ className = '' }) {
  const [currentLang, setCurrentLang] = useState('es');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isBrowser()) return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && LANGUAGE_OPTIONS.some((option) => option.code === stored)) {
      setCurrentLang(stored);
      document.documentElement.lang = stored;
    }
  }, []);

  const handleLanguageChange = (langCode) => {
    setCurrentLang(langCode);
    persistLanguage(langCode);
    setIsOpen(false);

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.info(
        `Idioma cambiado a: ${langCode === 'es' ? 'Espa\u00f1ol' : 'English'}`
      );
    }
  };

  const activeLanguage = getLanguage(currentLang);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium text-sm"
        aria-label="Seleccionar idioma"
        type="button"
      >
        <Globe className="w-4 h-4" />
        <span>{activeLanguage.code.toUpperCase()}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            role="presentation"
          ></div>

          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
            {LANGUAGE_OPTIONS.map((option) => {
              const isActive = option.code === currentLang;
              return (
                <button
                  key={option.code}
                  type="button"
                  onClick={() => handleLanguageChange(option.code)}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center gap-3 ${
                    isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                  role="menuitemradio"
                  aria-checked={isActive}
                >
                  <span className="text-2xl" aria-hidden="true">
                    {option.flag}
                  </span>
                  <span className="font-medium">{option.label}</span>
                  {isActive && (
                    <svg className="w-5 h-5 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export function LanguageLink({ className = '' }) {
  const [currentLang, setCurrentLang] = useState('es');

  useEffect(() => {
    if (!isBrowser()) return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && LANGUAGE_OPTIONS.some((option) => option.code === stored)) {
      setCurrentLang(stored);
      document.documentElement.lang = stored;
    }
  }, []);

  const toggleLanguage = () => {
    const nextLang = currentLang === 'es' ? 'en' : 'es';
    setCurrentLang(nextLang);
    persistLanguage(nextLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`inline-flex items-center gap-1 hover:text-blue-600 transition-colors ${className}`}
      title="Cambiar idioma"
      type="button"
    >
      <Globe className="w-4 h-4" />
      <span className="font-medium">{currentLang.toUpperCase()}</span>
    </button>
  );
}
