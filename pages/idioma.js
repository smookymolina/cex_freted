import React, { useEffect, useMemo, useState } from 'react';
import { Globe, Check, Languages } from 'lucide-react';
import { LANGUAGES } from '../data/constants/languages';

const STORAGE_KEY = 'cex_freted_language';

const findLanguage = (code) =>
  LANGUAGES.find((language) => language.code === code) ?? LANGUAGES[0];

const IdiomaPage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(STORAGE_KEY);
    if (storedLanguage && findLanguage(storedLanguage).available) {
      setSelectedLanguage(storedLanguage);
      document.documentElement.lang = storedLanguage;
    }
  }, []);

  const currentLanguage = useMemo(
    () => findLanguage(selectedLanguage),
    [selectedLanguage]
  );

  const handleLanguageSelect = (code) => {
    const language = findLanguage(code);
    if (!language.available) return;
    setSelectedLanguage(code);
  };

  const handleSaveLanguage = () => {
    window.localStorage.setItem(STORAGE_KEY, selectedLanguage);
    document.documentElement.lang = selectedLanguage;
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Languages className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Selecciona tu idioma</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Personaliza tu experiencia en CEX Freted eligiendo tu idioma preferido.
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center gap-4">
            <div className="text-5xl" aria-hidden="true">{currentLanguage.flag}</div>
            <div>
              <p className="text-sm text-blue-100 mb-1">Idioma actual</p>
              <h2 className="text-2xl font-bold">{currentLanguage.nativeName}</h2>
              <p className="text-blue-100 text-sm">{currentLanguage.region}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {LANGUAGES.map((language) => {
            const isSelected = selectedLanguage === language.code;
            const cardClasses = [
              'relative p-6 rounded-xl border-2 transition-all text-left',
              language.available
                ? 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed',
              isSelected ? 'border-blue-600 bg-blue-50 shadow-lg' : '',
            ].join(' ');

            return (
              <button
                key={language.code}
                type="button"
                onClick={() => handleLanguageSelect(language.code)}
                disabled={!language.available}
                className={cardClasses}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl" aria-hidden="true">{language.flag}</span>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{language.nativeName}</h3>
                      <p className="text-sm text-gray-600">{language.region}</p>
                    </div>
                  </div>
                  {isSelected && language.available && (
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
                      Pr?ximamente
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSaveLanguage}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 ${
              saved ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <span className="flex items-center gap-2">
              {saved ? <Check className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
              {saved ? 'Idioma guardado' : 'Guardar idioma'}
            </span>
          </button>
        </div>

        <div className="mt-12 bg-white rounded-xl border border-gray-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Languages className="w-6 h-6 text-blue-600" />
            Sobre la internacionalizaci?n
          </h3>
          <div className="space-y-4 text-gray-700">
            <p>
              En CEX Freted estamos comprometidos con ofrecer una experiencia global. Actualmente
              soportamos <strong>espa?ol</strong> e <strong>ingl?s</strong>, y estamos trabajando en agregar m?s idiomas.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
              <h4 className="font-semibold text-blue-900 mb-2">Caracter?sticas</h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Detecci?n autom?tica seg?n tu navegador</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Preferencia guardada en todos tus dispositivos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Traducciones revisadas y consistentes</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Soporte en tu idioma 24/7</span>
                </li>
              </ul>
            </div>
            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded">
              <h4 className="font-semibold text-yellow-900 mb-2">Pr?ximamente</h4>
              <p className="text-sm text-yellow-800">
                Estamos trabajando en agregar <strong>portugu?s</strong> y <strong>franc?s</strong> para
                expandir nuestra presencia en Brasil, Portugal, Francia y Canad?.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdiomaPage;
