import { useState, useEffect, useRef, useCallback } from 'react';

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
      let className = 'text-gray-400';
      
      if (index < userInput.length) {
        className = userInput[index] === char ? 'text-green-500 bg-green-100' : 'text-red-500 bg-red-100';
      } else if (index === currentIndex) {
        className = 'text-gray-900 bg-yellow-200 animate-pulse';
      }
      
      return (
        <span key={index} className={`${className} transition-colors duration-150`}>
          {char}
        </span>
      );
    });
  };

  const currentWpm = startTime ? Math.round((userInput.split(' ').length / ((Date.now() - startTime) / 60000)) || 0) : 0;
  const currentAccuracy = userInput.length > 0 ? Math.round(((userInput.length - errors) / userInput.length) * 100) : 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex gap-6 text-sm">
          <div className="text-gray-600">
            WPM: <span className="font-mono text-lg font-semibold text-blue-600">{currentWpm}</span>
          </div>
          <div className="text-gray-600">
            Accuracy: <span className="font-mono text-lg font-semibold text-green-600">{currentAccuracy}%</span>
          </div>
          <div className="text-gray-600">
            Errors: <span className="font-mono text-lg font-semibold text-red-600">{errors}</span>
          </div>
        </div>
        <button
          onClick={resetTest}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors duration-200 text-sm font-medium"
        >
          Reset
        </button>
      </div>
      
      <div className="mb-6 p-6 bg-gray-50 rounded-lg border-2 border-gray-200 focus-within:border-blue-400 transition-colors">
        <div className="text-lg leading-relaxed font-mono tracking-wide">
          {renderText()}
        </div>
      </div>
      
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={handleInputChange}
        disabled={isComplete}
        className="w-full p-4 text-lg font-mono border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
        placeholder={isComplete ? "Test completed! Click reset to try again." : "Start typing here..."}
      />
      
      {isComplete && (
        <div className="mt-6 p-6 bg-green-50 border-2 border-green-200 rounded-lg">
          <h3 className="text-xl font-semibold text-green-800 mb-2">Test Complete! 🎉</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{currentWpm}</div>
              <div className="text-sm text-gray-600">WPM</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{currentAccuracy}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{Math.round(((Date.now() - (startTime || Date.now())) / 1000))}s</div>
              <div className="text-sm text-gray-600">Time</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}