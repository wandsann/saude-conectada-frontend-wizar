import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  flag: string;
  label: string;
}

const languages: Language[] = [
  { code: 'pt-BR', name: 'Português', flag: '🇧🇷', label: 'Português (Brasil)' },
  { code: 'en-US', name: 'English', flag: '🇺🇸', label: 'English (United States)' },
  { code: 'es-ES', name: 'Español', flag: '🇪🇸', label: 'Español (España)' },
  { code: 'libras', name: 'Libras', flag: '🤟', label: 'Língua Brasileira de Sinais' },
];

export default function LanguageSelector() {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('preferredLanguage');
    return saved || 'pt-BR';
  });

  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
    document.documentElement.lang = language;
  }, [language]);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    // TODO: Implementar mudança de idioma usando i18n
  };

  const selectedLanguage = languages.find(lang => lang.code === language);

  return (
    <Select 
      value={language} 
      onValueChange={handleLanguageChange}
      aria-label="Selecionar idioma"
    >
      <SelectTrigger
        className="w-[150px] h-10 bg-white/90 backdrop-blur-sm"
        aria-label={`Idioma atual: ${selectedLanguage?.label}`}
      >
        <SelectValue aria-label={selectedLanguage?.label}>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" aria-hidden="true" />
            <span role="img" aria-label={selectedLanguage?.name}>{selectedLanguage?.flag}</span>
            <span className="hidden md:inline">{selectedLanguage?.name}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map(lang => (
          <SelectItem
            key={lang.code}
            value={lang.code}
            className="flex items-center gap-2"
            aria-label={lang.label}
          >
            <span role="img" aria-label={lang.name}>{lang.flag}</span>
            <span>{lang.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
