
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";

interface Language {
  code: string;
  name: string;
  flag: string;
}

const availableLanguages: Language[] = [
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'libras', name: 'Libras', flag: '👐' }
];

export default function LanguageSelector() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(availableLanguages[0]);

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    // In a real app, we would use i18n to change the language
    console.log(`Language changed to ${language.name}`);
    
    // Mock implementation of i18next changeLanguage
    // This would normally update all translated text on the page
    setTimeout(() => {
      console.log(`Language updated to ${language.name} in less than 1s`);
    }, 500);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 rounded-full"
          aria-label={`Mudar idioma. Idioma atual: ${currentLanguage.name}`}
        >
          <span className="sr-only">Mudar idioma</span>
          <span className="flex items-center gap-2">
            <span className="text-lg" aria-hidden="true">{currentLanguage.flag}</span>
            <Languages className="h-4 w-4" aria-hidden="true" />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white shadow-lg">
        {availableLanguages.map((language) => (
          <DropdownMenuItem 
            key={language.code}
            onClick={() => handleLanguageChange(language)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="text-lg" aria-hidden="true">{language.flag}</span>
            <span>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
