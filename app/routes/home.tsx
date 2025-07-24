import { useState, useEffect } from 'react';
import type { Route } from "./+types/home";
import { TypingTest } from '../components/TypingTest';
import { ResultsHistory, type TestResult } from '../components/ResultsHistory';
import { textOptions, getTextById } from '../components/TextGenerator';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Typi - Typing Speed Test" },
    { name: "description", content: "Improve your typing speed and accuracy with Typi - a modern typing test application" },
  ];
}

export default function Home() {
  const [currentView, setCurrentView] = useState<'test' | 'results'>('test');
  const [selectedTextType, setSelectedTextType] = useState('common-words');
  const [currentText, setCurrentText] = useState('');
  const [results, setResults] = useState<TestResult[]>([]);
  const [testKey, setTestKey] = useState(0);

  // Load results from localStorage on mount
  useEffect(() => {
    const savedResults = localStorage.getItem('typi-results');
    if (savedResults) {
      setResults(JSON.parse(savedResults));
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
    localStorage.setItem('typi-results', JSON.stringify(updatedResults));
  };

  const handleNewTest = () => {
    setCurrentText(getTextById(selectedTextType));
    setTestKey(prev => prev + 1);
  };

  const handleClearHistory = () => {
    setResults([]);
    localStorage.removeItem('typi-results');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-blue-600">⚡ Typi</div>
              <div className="text-sm text-gray-500">Typing Speed Test</div>
            </div>
            <nav className="flex gap-4">
              <button
                onClick={() => setCurrentView('test')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  currentView === 'test'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Test
              </button>
              <button
                onClick={() => setCurrentView('results')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  currentView === 'results'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Results ({results.length})
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        {currentView === 'test' ? (
          <div>
            {/* Text Type Selector */}
            <div className="max-w-4xl mx-auto px-6 mb-8">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Text Type</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {textOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedTextType(option.id)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                        selectedTextType === option.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium">{option.name}</div>
                      <div className="text-sm text-gray-500 mt-1">{option.description}</div>
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
            </div>

            {/* Typing Test */}
            {currentText && (
              <TypingTest
                key={testKey}
                text={currentText}
                onComplete={handleTestComplete}
              />
            )}
          </div>
        ) : (
          <ResultsHistory
            results={results}
            onClearHistory={handleClearHistory}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center text-gray-500">
            <p className="mb-2">Built with React Router and TypeScript</p>
            <p className="text-sm">Improve your typing speed and accuracy • Track your progress over time</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
