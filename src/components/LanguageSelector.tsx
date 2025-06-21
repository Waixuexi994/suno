import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage, Language } from '../contexts/LanguageContext';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
    { code: 'zh' as Language, name: '中文', flag: '🇨🇳' },
    { code: 'ko' as Language, name: '한국어', flag: '🇰🇷' },
    { code: 'ja' as Language, name: '日本語', flag: '🇯🇵' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors duration-200 border border-white/10"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm">{currentLanguage?.flag}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 overflow-hidden z-50 min-w-[160px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-200 ${
                language === lang.code ? 'bg-gray-50 dark:bg-white/5' : ''
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;