import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { RotateCcw, Zap, Target, Clock, Timer, Volume2, VolumeX } from 'lucide-react';

interface TypingTestProps {
  text: string;
  onComplete: (wpm: number, accuracy: number, time: number, errors: number) => void;
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
  const [timerDuration, setTimerDuration] = useState<TimerDuration>(15);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const currentCharRef = useRef<HTMLSpanElement>(null);
  const { t } = useLanguage();

  const words = text.split(' ');
  const totalChars = text.length;

  // Sound effects
  const playSound = useCallback((type: 'correct' | 'error' | 'complete') => {
    if (!soundEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Resume audio context if suspended
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      switch (type) {
        case 'correct':
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
          break;
        case 'error':
          oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          break;
        case 'complete':
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.1);
          oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.2);
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
          break;
      }
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + (type === 'complete' ? 0.4 : type === 'error' ? 0.2 : 0.1));
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, [soundEnabled]);

  const [finalWpm, setFinalWpm] = useState(0);
  const [finalAccuracy, setFinalAccuracy] = useState(100);

  const completeTest = useCallback((finalInput: string, finalErrors: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    const endTime = Date.now();
    
    // Calculate elapsed time in seconds
    let timeInSeconds: number;
    if (testMode === 'timer') {
      // For timer mode, calculate actual elapsed time from start
      timeInSeconds = startTime ? Math.max((endTime - startTime) / 1000, 0.1) : timerDuration;
    } else {
      // For normal mode, calculate time from start to end
      timeInSeconds = Math.max((endTime - (startTime || endTime)) / 1000, 0.1);
    }
    
    // Convert to minutes for WPM calculation
    const timeInMinutes = timeInSeconds / 60;
    
    // Calculate WPM using standard formula: (characters typed / 5) / time in minutes
    // This is the industry standard for typing tests
    const charactersTyped = finalInput.length;
    const wpm = timeInMinutes > 0 ? Math.round((charactersTyped / 5) / timeInMinutes) : 0;
    
    // Calculate accuracy based on correct characters vs total characters typed
    const correctChars = finalInput.length - finalErrors;
    const accuracy = finalInput.length > 0 
      ? Math.round((correctChars / finalInput.length) * 100)
      : 100;
    
    // Store final values for display in completion modal
    setFinalWpm(wpm);
    setFinalAccuracy(accuracy);
    
    setIsComplete(true);
    playSound('complete');
    onComplete(wpm, accuracy, timeInSeconds, finalErrors);
  }, [testMode, timerDuration, startTime, onComplete, playSound]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (!startTime) {
      setStartTime(Date.now());
      if (testMode === 'timer') {
        startTimer();
      }
    }

    // Play sound for typing
    if (value.length > userInput.length) {
      const newChar = value[value.length - 1];
      const expectedChar = text[value.length - 1];
      playSound(newChar === expectedChar ? 'correct' : 'error');
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

    // Auto-scroll to keep current character in view
    setTimeout(() => {
      if (currentCharRef.current && textContainerRef.current) {
        const charRect = currentCharRef.current.getBoundingClientRect();
        const containerRect = textContainerRef.current.getBoundingClientRect();
        
        // Check if character is outside the visible area
        const isAbove = charRect.top < containerRect.top + 100;
        const isBelow = charRect.bottom > containerRect.bottom - 100;
        
        if (isAbove || isBelow) {
          currentCharRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          });
        }
      }
    }, 0);

    // Check if test is complete - use setTimeout to avoid state update during render
    if (value.length === text.length) {
      setTimeout(() => completeTest(value, errorCount), 0);
    }
  }, [text, startTime, testMode, userInput.length, playSound, completeTest]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Get current values from state instead of closure
          setTimeout(() => {
            const currentInput = inputRef.current?.value || '';
            let currentErrors = 0;
            for (let i = 0; i < currentInput.length; i++) {
              if (currentInput[i] !== text[i]) {
                currentErrors++;
              }
            }
            completeTest(currentInput, currentErrors);
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [completeTest, text]);



  const resetTest = useCallback(() => {
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
    setFinalWpm(0);
    setFinalAccuracy(100);
    inputRef.current?.focus();
  }, [timerDuration]);

  const switchTestMode = useCallback((mode: TestMode) => {
    setTestMode(mode);
    localStorage.setItem('typi-test-mode', mode);
    if (mode === 'timer') {
      setTimeLeft(timerDuration);
    }
    resetTest();
  }, [timerDuration, resetTest]);

  const changeDuration = useCallback((duration: TimerDuration) => {
    setTimerDuration(duration);
    setTimeLeft(duration);
    localStorage.setItem('typi-timer-duration', duration.toString());
    
    // Reset test state directly to avoid stale closure issues
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setUserInput('');
    setCurrentIndex(0);
    setStartTime(null);
    setIsComplete(false);
    setErrors(0);
    setFinalWpm(0);
    setFinalAccuracy(100);
    inputRef.current?.focus();
  }, []);

  // Load settings from localStorage
  useEffect(() => {
    const savedSoundSetting = localStorage.getItem('typi-sound-enabled');
    if (savedSoundSetting !== null) {
      setSoundEnabled(JSON.parse(savedSoundSetting));
    }
    
    const savedTestMode = localStorage.getItem('typi-test-mode');
    if (savedTestMode && (savedTestMode === 'normal' || savedTestMode === 'timer')) {
      setTestMode(savedTestMode as TestMode);
    }
    
    const savedTimerDuration = localStorage.getItem('typi-timer-duration');
    if (savedTimerDuration) {
      const duration = parseInt(savedTimerDuration);
      if ([15, 30, 60, 120].includes(duration)) {
        setTimerDuration(duration as TimerDuration);
        setTimeLeft(duration);
      }
    }
  }, []);

  // Save sound setting to localStorage
  const toggleSound = useCallback(() => {
    const newSoundEnabled = !soundEnabled;
    setSoundEnabled(newSoundEnabled);
    localStorage.setItem('typi-sound-enabled', JSON.stringify(newSoundEnabled));
  }, [soundEnabled]);

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
    
    // Render text as a continuous paragraph
    return (
      <div className="font-mono text-left leading-loose transition-all duration-300 ease-out">
        <p className="mb-0">
          {text.split('').map((char, charIdx) => {
            let className = 'text-gray-400 dark:text-gray-500';
            let extraClasses = 'char transition-all duration-200 ease-out';
            
            if (charIdx < userInput.length) {
              if (userInput[charIdx] === char) {
                className = 'text-gray-800 dark:text-gray-200';
                extraClasses += ' scale-105 transform';
              } else {
                className = 'text-red-500 dark:text-red-400 bg-red-500/30 dark:bg-red-400/30';
                extraClasses += ' rounded-sm animate-shake';
              }
            } else if (charIdx === currentIndex) {
              className = 'text-gray-800 dark:text-gray-200';
              extraClasses += ' typing-cursor cursor-blink rounded-sm shadow-lg scale-110 transform';
            }
            
            return (
              <span 
                key={charIdx}
                ref={charIdx === currentIndex ? currentCharRef : null}
                className={`${className} ${extraClasses} inline-block relative ${isBurmese ? 'burmese-text' : ''}`}
                style={{ 
                  fontFamily: isBurmese 
                    ? '"Noto Sans Myanmar", "Padauk", "Myanmar Text", "Pyidaungsu", "Myanmar3", "Zawgyi-One", system-ui, sans-serif'
                    : '"JetBrains Mono", "Fira Code", "SF Mono", "Monaco", monospace',
                  textRendering: 'optimizeLegibility',
                  fontFeatureSettings: '"liga" 1, "calt" 1, "kern" 1, "clig" 1',
                  fontVariantLigatures: 'common-ligatures contextual discretionary-ligatures'
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            );
          })}
        </p>
      </div>
    );
  };

  const currentWpm = startTime && userInput.length > 0 ? (() => {
    const timeElapsed = (Date.now() - startTime) / 60000; // time in minutes
    if (timeElapsed < 0.01) return 0; // Prevent infinity for very short durations
    const charactersTyped = userInput.length;
    return Math.round((charactersTyped / 5) / timeElapsed) || 0;
  })() : 0;
  const currentAccuracy = userInput.length > 0 ? Math.round(((userInput.length - errors) / userInput.length) * 100) : 100;
  const displayTime = testMode === 'timer' ? timeLeft : (startTime ? Math.round((Date.now() - startTime) / 1000) : 0);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden p-4">
      {/* Test Mode Controls */}
      <div className="mb-4 flex-shrink-0">
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
              {t('test.modes.normal')}
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
              {t('test.modes.timer')}
            </button>
            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              title={soundEnabled ? t('test.sound.enabled') : t('test.sound.disabled')}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="text-xs hidden sm:inline">
                {soundEnabled ? t('test.sound.enabled') : t('test.sound.disabled')}
              </span>
            </button>
          </div>
          
          {testMode === 'timer' && (
            <div className="flex gap-2">
              {[15, 30, 60, 120].map((duration) => (
                <button
                  key={duration}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    changeDuration(duration as TimerDuration);
                  }}
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
      <div className="mb-4 flex-shrink-0">
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
                  {testMode === 'timer' ? t('test.timeLeft') : t('test.errors')}
                </div>
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
      
      {/* Text Display - Paragraph Style with Auto-Scroll */}
      <div 
        ref={textContainerRef}
        className="flex-1 typing-text-container cursor-text focus:outline-none transition-all duration-300 ease-out"
        onClick={() => inputRef.current?.focus()}
        tabIndex={0}
      >
        <div 
          className={`text-xl sm:text-2xl lg:text-3xl max-w-4xl mx-auto relative z-0 ${/[\u1000-\u109F\u1040-\u1049\uAA60-\uAA7F]/.test(text) ? 'burmese-text' : ''}`}
          style={{ 
            fontFamily: /[\u1000-\u109F\u1040-\u1049\uAA60-\uAA7F]/.test(text)
              ? '"Noto Sans Myanmar", "Padauk", "Myanmar Text", "Pyidaungsu", "Myanmar3", "Zawgyi-One", system-ui, sans-serif'
              : '"JetBrains Mono", "Fira Code", "SF Mono", "Monaco", monospace',
            lineHeight: '2.5rem',
            letterSpacing: '0.02em',
            textRendering: 'optimizeLegibility',
            fontFeatureSettings: '"liga" 1, "calt" 1, "kern" 1, "clig" 1',
            fontVariantLigatures: 'common-ligatures contextual discretionary-ligatures',
            minHeight: '12rem',
            overflow: 'visible'
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
      
      {/* Completion Modal - Key Results Only */}
      {isComplete && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="p-6 lg:p-8 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/90 dark:to-blue-900/90 border-2 border-green-200 dark:border-green-700 rounded-2xl animate-in slide-in-from-bottom-4 duration-500 ease-out max-w-lg mx-4">
            <h3 className="text-xl sm:text-2xl font-bold text-green-800 dark:text-green-300 mb-4 sm:mb-6 text-center animate-in fade-in duration-700 delay-200">{t('test.complete.title')}</h3>
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-in slide-in-from-left duration-500 delay-300">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 font-mono">{finalWpm}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wide mt-1">{t('test.wpm')}</div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-in slide-in-from-right duration-500 delay-400">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 font-mono">{finalAccuracy}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wide mt-1">{t('test.accuracy')}</div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={resetTest}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 font-medium"
              >
                {t('common.restart')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}