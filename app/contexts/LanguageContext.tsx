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
        dark: 'Dark Mode',
        system: 'System Theme'
      }
    },
    test: {
      wpm: 'WPM',
      accuracy: 'Accuracy',
      time: 'Time',
      errors: 'Errors',
      restart: 'Restart Test',
      textType: 'Text Type',
      timeLeft: 'Time Left',
      reset: 'Reset',
      complete: {
        title: 'Test Complete!',
        congratulations: 'Congratulations!',
        newRecord: 'New Personal Best!',
        tryAgain: 'Try Again'
      },
      modes: {
        normal: 'Normal Mode',
        timer: 'Timer Mode'
      },
      sound: {
        enabled: 'Sound On',
        disabled: 'Sound Off'
      }
    },
    textTypes: {
      'common-words': 'Common Words',
      'programming': 'Programming',
      'quotes': 'Quotes',
      'numbers': 'Numbers',
      'punctuation': 'Punctuation',
      'mixed-case': 'Mixed Case',
      'burmese': 'Burmese',
      'burmese-quotes': 'Burmese Quotes',
      'long-text': 'Long Text'
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
      progressDesc: 'Track your typing speed improvement over time',
      progressOverTime: 'Progress Over Time',
      chartVisualization: 'Chart Visualization',
      chartDescription: 'Chart Description',
      noResultsDescription: 'Complete some typing tests to see your progress here!',
      averageWpm: 'Average WPM',
      averageAccuracy: 'Average Accuracy',
      errors: 'Errors',
      wpm: 'WPM',
      accuracy: 'Accuracy',
      time: 'Time'
    },
    common: {
      start: 'Start',
      restart: 'Restart',
      finish: 'Finish',
      generateNewText: 'Generate New Text',
      developedBy: 'Developed by'
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
        dark: 'အမှောင်ရောင်',
        system: 'စနစ်အလိုက်'
      }
    },
    test: {
      wpm: 'မိနစ်လျှင်စာလုံး',
      accuracy: 'တိကျမှု',
      time: 'အချိန်',
      errors: 'အမှားများ',
      restart: 'ပြန်စတင်',
      textType: 'စာသားအမျိုးအစား',
      timeLeft: 'ကျန်ရှိသောအချိန်',
      reset: 'ပြန်လည်သတ်မှတ်',
      complete: {
        title: 'စမ်းသပ်မှုပြီးဆုံးပါပြီ!',
        congratulations: 'ဂုဏ်ယူပါသည်!',
        newRecord: 'ကိုယ်ပိုင်စံချိန်အသစ်!',
        tryAgain: 'ထပ်စမ်းကြည့်ပါ'
      },
      modes: {
        normal: 'ပုံမှန်စနစ်',
        timer: 'အချိန်သတ်မှတ်စနစ်'
      },
      sound: {
        enabled: 'အသံဖွင့်',
        disabled: 'အသံပိတ်'
      }
    },
    textTypes: {
      'common-words': 'အသုံးများသောစကားလုံးများ',
      'programming': 'ပရိုဂရမ်မင်း',
      'quotes': 'ကိုးကားချက်များ',
      'numbers': 'ဂဏန်းများ',
      'punctuation': 'ပုဒ်ဖြတ်ပုဒ်ရပ်များ',
      'mixed-case': 'ရောနှောအက္ခရာများ',
      'burmese': 'မြန်မာစကားလုံးများ',
      'burmese-quotes': 'မြန်မာကိုးကားချက်များ',
      'long-text': 'ရှည်လျားသောစာသား'
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
      progressDesc: 'အချိန်ကြာလာသည်နှင့်အမျှ သင့်ရိုက်နှိပ်မှုအမြန်နှုန်းတိုးတက်မှုကို ခြေရာခံပါ',
      progressOverTime: 'အချိန်ကြာလာသည်နှင့်အမျှ တိုးတက်မှု',
      chartVisualization: 'ဇယားမြင်ကွင်း',
      chartDescription: 'ဇယားဖော်ပြချက်',
      noResultsDescription: 'သင့်တိုးတက်မှုကိုကြည့်ရှုရန် ရိုက်နှိပ်မှုစမ်းသပ်မှုများပြုလုပ်ပါ!',
      averageWpm: 'ပျမ်းမျှ မိနစ်လျှင်စာလုံး',
      averageAccuracy: 'ပျမ်းမျှတိကျမှု',
      errors: 'အမှားများ',
      wpm: 'မိနစ်လျှင်စာလုံး',
      accuracy: 'တိကျမှု',
      time: 'အချိန်'
    },
    common: {
      start: 'စတင်',
      restart: 'ပြန်စတင်',
      finish: 'ပြီးဆုံး',
      generateNewText: 'စာသားအသစ်ထုတ်လုပ်ရန်',
      developedBy: 'ဖန်တီးသူ'
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