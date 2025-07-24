import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { RotateCcw, Zap, Target, Clock } from 'lucide-react';

interface TypingTestProps {
  text: string;
  onComplete: (wpm: number, accuracy: number, time: number) => void;
}

export function TypingTest({ text, onComplete }: TypingTestProps) {
  const [userInput, setUserInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [errors, setErrors] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const words = text.split(' ');
  const totalChars = text.length;

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (!startTime) {
      setStartTime(Date.now());
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

    // Check if test is complete
    if (value.length === text.length) {
      const endTime = Date.now();
      const timeInMinutes = (endTime - (startTime || endTime)) / 60000;
      const wordsTyped = value.split(' ').length;
      const wpm = Math.round(wordsTyped / timeInMinutes);
      const accuracy = Math.round(((totalChars - errorCount) / totalChars) * 100);
      
      setIsComplete(true);
      onComplete(wpm, accuracy, Math.round((endTime - (startTime || endTime)) / 1000));
    }
  }, [text, startTime, totalChars, onComplete]);

  const resetTest = () => {
    setUserInput('');
    setCurrentIndex(0);
    setStartTime(null);
    setIsComplete(false);
    setErrors(0);
    inputRef.current?.focus();
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const renderText = () => {
    return text.split('').map((char, index) => {
      let className = 'text-gray-400 dark:text-gray-500';
      let extraClasses = '';
      
      if (index < userInput.length) {
        if (userInput[index] === char) {
          className = 'text-gray-800 dark:text-gray-200 bg-green-100/50 dark:bg-green-900/20';
          extraClasses = 'animate-in fade-in duration-200';
        } else {
          className = 'text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
          extraClasses = 'animate-in shake duration-300';
        }
      } else if (index === currentIndex) {
        className = 'text-gray-800 dark:text-gray-200 bg-blue-200 dark:bg-blue-800/50';
        extraClasses = 'animate-pulse';
      }
      
      return (
        <span 
          key={index} 
          className={`${className} ${extraClasses} transition-all duration-300 ease-in-out px-0.5 py-0.5 rounded-sm inline-block`}
          style={{ 
            fontFamily: '"Noto Sans Myanmar", "Padauk", "Myanmar Text", "SF Mono", "Monaco", monospace',
            minWidth: char === ' ' ? '0.5em' : 'auto'
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  };

  const currentWpm = startTime ? Math.round((userInput.split(' ').length / ((Date.now() - startTime) / 60000)) || 0) : 0;
  const currentAccuracy = userInput.length > 0 ? Math.round(((userInput.length - errors) / userInput.length) * 100) : 100;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 overflow-hidden">
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
                <div className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white font-mono truncate">{errors}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate">{t('test.errors')}</div>
              </div>
            </div>
          </div>
          <button
            onClick={resetTest}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-300 ease-in-out text-sm font-medium text-gray-700 dark:text-gray-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md w-full sm:w-auto justify-center sm:justify-start"
          >
            <RotateCcw className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
            {t('test.reset')}
          </button>
        </div>
      </div>
      
      {/* Text Display */}
      <div className="mb-6 sm:mb-8 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 focus-within:border-blue-400 dark:focus-within:border-blue-500 transition-all duration-300 ease-in-out hover:shadow-lg overflow-hidden">
        <div className="text-lg sm:text-xl lg:text-2xl leading-relaxed font-mono tracking-wide text-left sm:text-center max-w-full mx-auto break-words overflow-wrap-anywhere" style={{ fontFamily: '"Noto Sans Myanmar", "Padauk", "Myanmar Text", "SF Mono", "Monaco", monospace', lineHeight: '1.8' }}>
          {renderText()}
        </div>
      </div>
      
      {/* Input Field */}
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={handleInputChange}
        disabled={isComplete}
        className="w-full p-4 sm:p-6 text-lg sm:text-xl font-mono border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 ease-in-out placeholder-gray-400 dark:placeholder-gray-500 hover:border-gray-400 dark:hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ fontFamily: '"Noto Sans Myanmar", "Padauk", "Myanmar Text", "SF Mono", "Monaco", monospace' }}
        placeholder={isComplete ? t('test.completed') : t('test.placeholder')}
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