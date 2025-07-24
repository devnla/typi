import { useState, useEffect } from 'react';
import type { Route } from "./+types/home";
import { TypingTest } from '../components/TypingTest';
import { ResultsHistory, type TestResult } from '../components/ResultsHistory';
import { textOptions, getTextById } from '../components/TextGenerator';
import { Header } from '../components/Header';
import { ThemeProvider } from '../contexts/ThemeContext';
import { LanguageProvider } from '../contexts/LanguageContext';

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header 
        currentView={currentView}
        setCurrentView={setCurrentView}
        resultsCount={results.length}
      />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {currentView === 'test' && (
          <div className="space-y-8">
            {/* Text Type Selector */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Choose Text Type</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {textOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleTextTypeChange(option.id)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      selectedTextType === option.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="font-medium text-sm">{option.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{option.description}</div>
                  </button>
                ))}
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleNewTest}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                  Generate New Text
                </button>
              </div>
            </div>

            {/* Typing Test Component */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
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
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p className="mb-2">Built with React Router and TypeScript</p>
            <p className="text-sm">Improve your typing speed and accuracy • Track your progress over time</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
