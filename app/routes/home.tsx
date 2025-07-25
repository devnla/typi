import { useState, useEffect } from 'react';
import type { Route } from "./+types/home";
import { TypingTest } from '../components/TypingTest';
import { ResultsHistory, type TestResult } from '../components/ResultsHistory';
import { textOptions, getTextById } from '../components/TextGenerator';
import { Header } from '../components/Header';
import { ThemeProvider } from '../contexts/ThemeContext';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Typi - Typing Speed Test" },
    { name: "description", content: "Improve your typing speed and accuracy with Typi - a modern typing test application" },
  ];
}

export default function Home() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <HomeContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}

function HomeContent() {
  const { t, language } = useLanguage();
  const [currentView, setCurrentView] = useState<'test' | 'results'>('test');
  const [selectedTextType, setSelectedTextType] = useState('common-words');
  const [currentText, setCurrentText] = useState('');
  const [results, setResults] = useState<TestResult[]>([]);
  const [testKey, setTestKey] = useState(0);

  // Load results from localStorage on mount
  useEffect(() => {
    try {
      const savedResults = localStorage.getItem('typi-results');
      if (savedResults) {
        const parsedResults = JSON.parse(savedResults);
        if (Array.isArray(parsedResults)) {
          setResults(parsedResults);
        }
      }
    } catch (error) {
      console.warn('Failed to load results from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem('typi-results');
    }
  }, []);

  // Generate new text when text type changes
  useEffect(() => {
    setCurrentText(getTextById(selectedTextType));
  }, [selectedTextType]);

  const handleTestComplete = (wpm: number, accuracy: number, time: number) => {
    const newResult: TestResult = {
      id: Date.now().toString(),
      wpm,
      accuracy,
      time,
      textType: textOptions.find(opt => opt.id === selectedTextType)?.name || 'Unknown',
      date: new Date().toISOString(),
      errors: Math.round((currentText.length * (100 - accuracy)) / 100)
    };

    const updatedResults = [newResult, ...results];
    setResults(updatedResults);
    try {
      localStorage.setItem('typi-results', JSON.stringify(updatedResults));
    } catch (error) {
      console.warn('Failed to save results to localStorage:', error);
    }
  };

  const handleTextTypeChange = (textType: string) => {
    setSelectedTextType(textType);
    setCurrentText(getTextById(textType));
    setTestKey(prev => prev + 1);
  };

  const handleNewTest = () => {
    setCurrentText(getTextById(selectedTextType));
    setTestKey(prev => prev + 1);
  };

  const handleClearHistory = () => {
    setResults([]);
    try {
      localStorage.removeItem('typi-results');
    } catch (error) {
      console.warn('Failed to clear results from localStorage:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col">
      <Header 
        currentView={currentView}
        setCurrentView={setCurrentView}
        resultsCount={results.length}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-4 flex flex-col">
        {currentView === 'test' && (
          <div className="flex-1 flex flex-col">
            {/* Text Type Selector - Minimalist */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-4 flex-shrink-0">
              {textOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleTextTypeChange(option.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-150 ${
                    selectedTextType === option.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                   {t(`textTypes.${option.id}`) || option.name}
                 </button>
              ))}
              <button
                onClick={handleNewTest}
                className="px-2.5 py-1 text-xs font-medium bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-150 ml-1"
              title={t('common.generateNewText')}
              >
                ↻
              </button>
            </div>

            {/* Typing Test Component */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 relative">
              <TypingTest
                key={testKey}
                text={currentText}
                onComplete={handleTestComplete}
              />
            </div>
          </div>
        )}
        
        {currentView === 'results' && (
          <ResultsHistory
            results={results}
            onClearResults={handleClearHistory}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-8">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p 
              className="text-sm"
              style={{
                fontFamily: language === 'my'
                  ? '"Noto Sans Myanmar", "Padauk", "Myanmar Text", "Pyidaungsu", "Myanmar3", "Zawgyi-One", system-ui, sans-serif'
                  : 'inherit'
              }}
            >
              {t('common.developedBy')} <a href="https://github.com/devnla" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-150">@devnla</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
