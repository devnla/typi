import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Language = 'en' | 'my';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    app: {
      title: 'Typi',
      subtitle: 'Master Your Typing Speed'
    },
    nav: {
      test: 'Test',
      results: 'Results'
    },
    settings: {
      language: 'Language',
      theme: {
        light: 'Light Mode',
        dark: 'Dark Mode'
      }
    },
    test: {
      wpm: 'WPM',
      accuracy: 'Accuracy',
      time: 'Time',
      errors: 'Errors',
      restart: 'Restart Test',
      textType: 'Text Type'
    },
    results: {
      title: 'Typing Test Results',
      noResults: 'No Results Yet',
      noResultsDesc: 'Complete some typing tests to see your progress here!',
      clearHistory: 'Clear History',
      avgWpm: 'Average WPM',
      avgAccuracy: 'Average Accuracy',
      bestWpm: 'Best WPM',
      bestAccuracy: 'Best Accuracy',
      date: 'Date',
      textType: 'Text Type',
      progressChart: 'Progress Chart',
      progressDesc: 'Track your typing speed improvement over time'
    },
    common: {
      start: 'Start',
      restart: 'Restart',
      finish: 'Finish'
    }
  },
  my: {
    app: {
      title: 'တိုက်ပီ',
      subtitle: 'သင့်ရိုက်နှိပ်မှုအမြန်နှုန်းကို မြှင့်တင်ပါ'
    },
    nav: {
      test: 'စမ်းသပ်မှု',
      results: 'ရလဒ်များ'
    },
    settings: {
      language: 'ဘာသာစကား',
      theme: {
        light: 'အလင်းရောင်',
        dark: 'အမှောင်ရောင်'
      }
    },
    test: {
      wpm: 'မိနစ်လျှင်စာလုံး',
      accuracy: 'တိကျမှု',
      time: 'အချိန်',
      errors: 'အမှားများ',
      restart: 'ပြန်စတင်',
      textType: 'စာသားအမျိုးအစား'
    },
    results: {
      title: 'ရိုက်နှိပ်မှုစမ်းသပ်ရလဒ်များ',
      noResults: 'ရလဒ်များမရှိသေးပါ',
      noResultsDesc: 'သင့်တိုးတက်မှုကိုကြည့်ရှုရန် ရိုက်နှိပ်မှုစမ်းသပ်မှုများပြုလုပ်ပါ!',
      clearHistory: 'မှတ်တမ်းရှင်းလင်းရန်',
      avgWpm: 'ပျမ်းမျှ မိနစ်လျှင်စာလုံး',
      avgAccuracy: 'ပျမ်းမျှတိကျမှု',
      bestWpm: 'အကောင်းဆုံး မိနစ်လျှင်စာလုံး',
      bestAccuracy: 'အကောင်းဆုံးတိကျမှု',
      date: 'ရက်စွဲ',
      textType: 'စာသားအမျိုးအစား',
      progressChart: 'တိုးတက်မှုဇယား',
      progressDesc: 'အချိန်ကြာလာသည်နှင့်အမျှ သင့်ရိုက်နှိပ်မှုအမြန်နှုန်းတိုးတက်မှုကို ခြေရာခံပါ'
    },
    common: {
      start: 'စတင်',
      restart: 'ပြန်စတင်',
      finish: 'ပြီးဆုံး'
    }
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('typi-language', newLanguage);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return typeof value === 'string' ? value : key;
  };

  // Load saved language on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('typi-language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'my')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}