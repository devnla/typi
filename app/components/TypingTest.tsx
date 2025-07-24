import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { RotateCcw, Zap, Target, Clock, Timer } from 'lucide-react';

interface TypingTestProps {
  text: string;
  onComplete: (wpm: number, accuracy: number, time: number) => void;
}

type TestMode = 'normal' | 'timer';
type TimerDuration = 15 | 30 | 60 | 120;

export function TypingTest({ text, onComplete }: TypingTestProps) {
  const [userInput, setUserInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [errors, setErrors] = useState(0);
  const [testMode, setTestMode] = useState<TestMode>('normal');
  const [timerDuration, setTimerDuration] = useState<TimerDuration>(60);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { t } = useLanguage();

  const words = text.split(' ');
  const totalChars = text.length;

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (!startTime) {
      setStartTime(Date.now());
      if (testMode === 'timer') {
        startTimer();
      }
    }

    setUserInput(value);
    
    // Count errors
    let errorCount = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== text[i]) {
        errorCount++;
      }
    }
    setErrors(errorCount);
    setCurrentIndex(value.length);

    // Check if test is complete (only in normal mode)
    if (testMode === 'normal' && value.length === text.length) {
      completeTest(value, errorCount);
    }
  }, [text, startTime, totalChars, onComplete, testMode]);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          completeTest(userInput, errors);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const completeTest = (finalInput: string, finalErrors: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    const endTime = Date.now();
    const timeInMinutes = testMode === 'timer' 
      ? (timerDuration - timeLeft) / 60
      : (endTime - (startTime || endTime)) / 60000;
    const wordsTyped = finalInput.trim().split(/\s+/).length;
    const wpm = Math.round(wordsTyped / timeInMinutes) || 0;
    const accuracy = finalInput.length > 0 
      ? Math.round(((finalInput.length - finalErrors) / finalInput.length) * 100)
      : 100;
    
    setIsComplete(true);
    const testTime = testMode === 'timer' 
      ? timerDuration - timeLeft
      : Math.round((endTime - (startTime || endTime)) / 1000);
    onComplete(wpm, accuracy, testTime);
  };

  const resetTest = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setUserInput('');
    setCurrentIndex(0);
    setStartTime(null);
    setIsComplete(false);
    setErrors(0);
    setTimeLeft(timerDuration);
    inputRef.current?.focus();
  };

  const switchTestMode = (mode: TestMode) => {
    setTestMode(mode);
    if (mode === 'timer') {
      setTimeLeft(timerDuration);
    }
    resetTest();
  };

  const changeDuration = (duration: TimerDuration) => {
    setTimerDuration(duration);
    setTimeLeft(duration);
    resetTest();
  };

  useEffect(() => {
    inputRef.current?.focus();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default behavior for certain keys
      if (e.key === 'Tab' || e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
      }
      
      // Focus the hidden input to capture typing
      if (!isComplete && inputRef.current) {
        inputRef.current.focus();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isComplete]);

  const renderText = () => {
    const isBurmese = /[\u1000-\u109F\u1040-\u1049\uAA60-\uAA7F]/.test(text);
    
    return text.split('').map((char, index) => {
      let className = 'text-gray-400 dark:text-gray-500';
      let extraClasses = 'char';
      
      if (index < userInput.length) {
        if (userInput[index] === char) {
          className = 'text-gray-800 dark:text-gray-200';
          extraClasses += ' transition-colors duration-150';
        } else {
          className = 'text-red-500 dark:text-red-400 bg-red-500/20 dark:bg-red-400/20';
          extraClasses += ' transition-colors duration-150 rounded-sm';
        }
      } else if (index === currentIndex) {
        className = 'text-gray-800 dark:text-gray-200 bg-yellow-400/60 dark:bg-yellow-500/40';
        extraClasses += ' animate-pulse rounded-sm';
      }
      
      // Add word boundary class for better spacing
      if (char === ' ' && isBurmese) {
        extraClasses += ' word-boundary';
      }
      
      return (
        <span 
          key={index} 
          className={`${className} ${extraClasses} inline-block relative ${isBurmese ? 'burmese-text' : ''}`}
          style={{ 
            fontFamily: isBurmese 
              ? '"Noto Sans Myanmar", "Padauk", "Myanmar Text", "Pyidaungsu", "Myanmar3", "Zawgyi-One", system-ui, sans-serif'
              : '"JetBrains Mono", "Fira Code", "SF Mono", "Monaco", monospace',
            textRendering: 'optimizeLegibility',
            fontFeatureSettings: '"liga" 1, "calt" 1, "kern" 1, "clig" 1',
            fontVariantLigatures: 'common-ligatures contextual discretionary-ligatures',
            wordBreak: 'keep-all',
            overflowWrap: 'normal',
            unicodeBidi: 'normal',
            direction: 'ltr'
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  };

  const currentWpm = startTime ? Math.round((userInput.split(' ').length / ((Date.now() - startTime) / 60000)) || 0) : 0;
  const currentAccuracy = userInput.length > 0 ? Math.round(((userInput.length - errors) / userInput.length) * 100) : 100;
  const displayTime = testMode === 'timer' ? timeLeft : (startTime ? Math.round((Date.now() - startTime) / 1000) : 0);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 overflow-hidden">
      {/* Test Mode Controls */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => switchTestMode('normal')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                testMode === 'normal'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => switchTestMode('timer')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                testMode === 'timer'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Timer className="w-4 h-4 inline mr-1" />
              Timer
            </button>
          </div>
          
          {testMode === 'timer' && (
            <div className="flex gap-2">
              {[15, 30, 60, 120].map((duration) => (
                <button
                  key={duration}
                  onClick={() => changeDuration(duration as TimerDuration)}
                  className={`px-3 py-1 rounded text-sm transition-all duration-200 ${
                    timerDuration === duration
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {duration}s
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <div className="grid grid-cols-3 sm:flex gap-4 sm:gap-8 w-full sm:w-auto">
            <div className="flex items-center gap-2 min-w-0">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white font-mono truncate">{currentWpm}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate">{t('test.wpm')}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white font-mono truncate">{currentAccuracy}%</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate">{t('test.accuracy')}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white font-mono truncate">
                  {testMode === 'timer' ? `${displayTime}s` : errors}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate">
                  {testMode === 'timer' ? 'Time Left' : t('test.errors')}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={resetTest}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-300 ease-in-out text-sm font-medium text-gray-700 dark:text-gray-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md w-full sm:w-auto justify-center sm:justify-start"
          >
            <RotateCcw className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
            Reset
          </button>
        </div>
      </div>
      
      {/* Text Display - Monkeytype Style */}
      <div 
        className="mb-6 sm:mb-8 p-8 sm:p-12 lg:p-16 min-h-[200px] flex items-center justify-center cursor-text focus:outline-none transition-all duration-300 ease-in-out"
        onClick={() => inputRef.current?.focus()}
        tabIndex={0}
      >
        <div 
          className={`text-2xl sm:text-3xl lg:text-4xl leading-loose text-center max-w-5xl mx-auto ${/[\u1000-\u109F\u1040-\u1049\uAA60-\uAA7F]/.test(text) ? 'burmese-text' : ''}`}
          style={{ 
            fontFamily: /[\u1000-\u109F\u1040-\u1049\uAA60-\uAA7F]/.test(text)
              ? '"Noto Sans Myanmar", "Padauk", "Myanmar Text", "Pyidaungsu", "Myanmar3", "Zawgyi-One", system-ui, sans-serif'
              : '"JetBrains Mono", "Fira Code", "SF Mono", "Monaco", monospace',
            lineHeight: '1.8',
            letterSpacing: '0.02em',
            textRendering: 'optimizeLegibility',
            fontFeatureSettings: '"liga" 1, "calt" 1, "kern" 1, "clig" 1',
            fontVariantLigatures: 'common-ligatures contextual discretionary-ligatures',
            wordBreak: 'keep-all',
            overflowWrap: 'normal',
            unicodeBidi: 'normal',
            direction: 'ltr'
          }}
        >
          {renderText()}
        </div>
      </div>
      
      {/* Hidden Input Field */}
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={handleInputChange}
        disabled={isComplete}
        className="absolute opacity-0 pointer-events-none -z-10"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
      
      {/* Completion Modal */}
      {isComplete && (
        <div className="mt-6 sm:mt-8 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-green-200 dark:border-green-700 rounded-2xl animate-in slide-in-from-bottom-4 duration-500 ease-out">
          <h3 className="text-xl sm:text-2xl font-bold text-green-800 dark:text-green-300 mb-4 sm:mb-6 text-center animate-in fade-in duration-700 delay-200">{t('test.complete.title')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-in slide-in-from-left duration-500 delay-300">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 font-mono">{currentWpm}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wide mt-1">{t('test.wpm')}</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-in slide-in-from-bottom duration-500 delay-400">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 font-mono">{currentAccuracy}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wide mt-1">{t('test.accuracy')}</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-in slide-in-from-right duration-500 delay-500">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400 font-mono">{Math.round(((Date.now() - (startTime || Date.now())) / 1000))}s</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wide mt-1">{t('test.time')}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}