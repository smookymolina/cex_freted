import React, { useState, useEffect } from 'react';
import { Globe, Check, Languages } from 'lucide-react';

const AVAILABLE_LANGUAGES = [
  {
    code: 'es',
    name: 'Español',
    nativeName: 'Español',
    flag: '🇪🇸',
    region: 'España / América Latina',
    available: true
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    region: 'United States / International',
    available: true
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
    region: 'Brasil / Portugal',
    available: false,
    comingSoon: true
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    region: 'France / Canada',
    available: false,
    comingSoon: true
  }
];

export default function IdiomaPage() {
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Cargar idioma guardado
    const savedLang = localStorage.getItem('cex_freted_language') || 'es';
    setSelectedLanguage(savedLang);
  }, []);

  const handleLanguageSelect = (langCode) => {
    const language = AVAILABLE_LANGUAGES.find(l => l.code === langCode);
    if (!language || !language.available) return;

    setSelectedLanguage(langCode);
  };

  const handleSaveLanguage = () => {
    localStorage.setItem('cex_freted_language', selectedLanguage);
    document.documentElement.lang = selectedLanguage;
    setSaved(true);

    // Simular recarga de contenido
    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  const currentLanguage = AVAILABLE_LANGUAGES.find(l => l.code === selectedLanguage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Languages className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Selecciona tu Idioma
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Personaliza tu experiencia en CEX Freted eligiendo tu idioma preferido
          </p>
        </div>

        {/* Current Selection */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{currentLanguage?.flag}</div>
            <div>
              <p className="text-sm text-blue-100 mb-1">Idioma actual</p>
              <h2 className="text-2xl font-bold">{currentLanguage?.nativeName}</h2>
              <p className="text-blue-100 text-sm">{currentLanguage?.region}</p>
            </div>
          </div>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {AVAILABLE_LANGUAGES.map(language => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language.code)}
              disabled={!language.available}
              className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                selectedLanguage === language.code
                  ? 'border-blue-600 bg-blue-50 shadow-lg'
                  : language.available
                  ? 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                  : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{language.flag}</span>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {language.nativeName}
                    </h3>
                    <p className="text-sm text-gray-600">{language.region}</p>
                  </div>
                </div>

                {selectedLanguage === language.code && language.available && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}
              </div>

              {!language.available && language.comingSoon && (
                <div className="mt-4">
                  <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                    Próximamente
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSaveLanguage}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
              saved
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } shadow-lg hover:shadow-xl transform hover:scale-105`}
          >
            {saved ? (
              <span className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                Idioma Guardado
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Guardar Idioma
              </span>
            )}
          </button>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-xl border border-gray-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Languages className="w-6 h-6 text-blue-600" />
            Sobre la internacionalización
          </h3>
          <div className="space-y-4 text-gray-700">
            <p>
              En CEX Freted estamos comprometidos con ofrecer una experiencia global. Actualmente
              soportamos <strong>Español</strong> e <strong>Inglés</strong>, y estamos trabajando en agregar más idiomas.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
              <h4 className="font-semibold text-blue-900 mb-2">Características</h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Detección automática según tu navegador</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Preferencia guardada en todos tus dispositivos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Traducciones certificadas y revisadas</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Soporte en tu idioma 24/7</span>
                </li>
              </ul>
            </div>
            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded">
              <h4 className="font-semibold text-yellow-900 mb-2">Próximamente</h4>
              <p className="text-sm text-yellow-800">
                Estamos trabajando en agregar <strong>Portugués</strong> y <strong>Francés</strong> para
                expandir nuestra presencia en Brasil, Portugal, Francia y Canadá.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
