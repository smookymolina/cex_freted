import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

const LANGUAGES = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
];

export default function LanguageSwitcher({ className = '' }) {
  const [currentLang, setCurrentLang] = useState('es');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Cargar idioma guardado del localStorage
    const savedLang = localStorage.getItem('cex_freted_language');
    if (savedLang && ['es', 'en'].includes(savedLang)) {
      setCurrentLang(savedLang);
    }
  }, []);

  const handleLanguageChange = (langCode) => {
    setCurrentLang(langCode);
    localStorage.setItem('cex_freted_language', langCode);
    setIsOpen(false);

    // Aquí puedes agregar lógica adicional como:
    // - Cambiar el idioma de la aplicación usando i18n
    // - Recargar contenido traducido
    // - Actualizar el atributo lang del HTML
    document.documentElement.lang = langCode;

    // Mostrar notificación (opcional)
    console.log(`Idioma cambiado a: ${langCode === 'es' ? 'Español' : 'English'}`);
  };

  const getCurrentLanguage = () => {
    return LANGUAGES.find(lang => lang.code === currentLang) || LANGUAGES[0];
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium text-sm"
        aria-label="Seleccionar idioma"
      >
        <Globe className="w-4 h-4" />
        <span>{getCurrentLanguage().code.toUpperCase()}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Overlay para cerrar al hacer clic fuera */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center gap-3 ${
                  currentLang === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
                {currentLang === lang.code && (
                  <svg className="w-5 h-5 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Componente simple para usar en el link directo
export function LanguageLink({ className = '' }) {
  const [currentLang, setCurrentLang] = useState('es');

  useEffect(() => {
    const savedLang = localStorage.getItem('cex_freted_language') || 'es';
    setCurrentLang(savedLang);
  }, []);

  const toggleLanguage = () => {
    const newLang = currentLang === 'es' ? 'en' : 'es';
    setCurrentLang(newLang);
    localStorage.setItem('cex_freted_language', newLang);
    document.documentElement.lang = newLang;
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`inline-flex items-center gap-1 hover:text-blue-600 transition-colors ${className}`}
      title="Cambiar idioma"
    >
      <Globe className="w-4 h-4" />
      <span className="font-medium">{currentLang.toUpperCase()}</span>
    </button>
  );
}
