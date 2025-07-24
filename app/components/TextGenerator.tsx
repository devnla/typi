export interface TextOption {
  id: string;
  name: string;
  description: string;
  getText: () => string;
}

const commonWords = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their',
  'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him',
  'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only',
  'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want',
  'because', 'any', 'these', 'give', 'day', 'most', 'us', 'is', 'was', 'are', 'been', 'has', 'had', 'were', 'said', 'each', 'which', 'their',
  'time', 'will', 'about', 'if', 'up', 'out', 'many', 'then', 'them', 'these', 'so', 'some', 'her', 'would', 'make', 'like', 'into', 'him',
  'has', 'two', 'more', 'very', 'what', 'know', 'just', 'first', 'get', 'over', 'think', 'where', 'much', 'go', 'well', 'were', 'me', 'back',
  'call', 'came', 'each', 'she', 'may', 'say', 'which', 'their', 'use', 'her', 'all', 'there', 'been', 'many', 'then', 'them', 'these', 'so'
];

const programmingWords = [
  'function', 'variable', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'interface', 'type', 'import', 'export',
  'async', 'await', 'promise', 'callback', 'array', 'object', 'string', 'number', 'boolean', 'null', 'undefined', 'true', 'false',
  'console', 'log', 'error', 'warn', 'debug', 'try', 'catch', 'finally', 'throw', 'new', 'this', 'super', 'extends', 'implements',
  'public', 'private', 'protected', 'static', 'abstract', 'override', 'readonly', 'enum', 'namespace', 'module', 'require',
  'component', 'props', 'state', 'useState', 'useEffect', 'useCallback', 'useMemo', 'useRef', 'useContext', 'reducer', 'dispatch',
  'map', 'filter', 'reduce', 'forEach', 'find', 'some', 'every', 'includes', 'indexOf', 'slice', 'splice', 'push', 'pop', 'shift', 'unshift',
  'length', 'toString', 'valueOf', 'hasOwnProperty', 'constructor', 'prototype', 'bind', 'call', 'apply', 'setTimeout', 'setInterval',
  'clearTimeout', 'clearInterval', 'JSON', 'parse', 'stringify', 'Math', 'random', 'floor', 'ceil', 'round', 'max', 'min', 'abs'
];

const quotes = [
  "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",
  "Innovation distinguishes between a leader and a follower. Stay hungry, stay foolish.",
  "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.",
  "The future belongs to those who believe in the beauty of their dreams. Success is not final, failure is not fatal.",
  "It is during our darkest moments that we must focus to see the light. The way to get started is to quit talking and begin doing.",
  "Life is what happens to you while you're busy making other plans. The greatest glory in living lies not in never falling, but in rising every time we fall.",
  "In the end, we will remember not the words of our enemies, but the silence of our friends. Darkness cannot drive out darkness; only light can do that.",
  "The only impossible journey is the one you never begin. Success is not how high you have climbed, but how you make a positive difference to the world.",
  "Programming is not about typing, it's about thinking. Code is like humor. When you have to explain it, it's bad.",
  "First, solve the problem. Then, write the code. Any fool can write code that a computer can understand. Good programmers write code that humans can understand."
];

export const textOptions: TextOption[] = [
  {
    id: 'common-words',
    name: 'Common Words',
    description: 'Most frequently used English words',
    getText: () => {
      const shuffled = [...commonWords].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 50).join(' ');
    }
  },
  {
    id: 'programming',
    name: 'Programming',
    description: 'Programming keywords and terms',
    getText: () => {
      const shuffled = [...programmingWords].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 40).join(' ');
    }
  },
  {
    id: 'quotes',
    name: 'Quotes',
    description: 'Inspirational and famous quotes',
    getText: () => {
      return quotes[Math.floor(Math.random() * quotes.length)];
    }
  },
  {
    id: 'numbers',
    name: 'Numbers',
    description: 'Random numbers and digits',
    getText: () => {
      const numbers = [];
      for (let i = 0; i < 30; i++) {
        numbers.push(Math.floor(Math.random() * 1000).toString());
      }
      return numbers.join(' ');
    }
  },
  {
    id: 'punctuation',
    name: 'Punctuation',
    description: 'Text with various punctuation marks',
    getText: () => {
      const words = commonWords.slice(0, 30);
      const punctuations = ['.', ',', '!', '?', ';', ':', '"', "'", '(', ')', '-'];
      let result = '';
      
      for (let i = 0; i < words.length; i++) {
        result += words[i];
        if (Math.random() > 0.7) {
          result += punctuations[Math.floor(Math.random() * punctuations.length)];
        }
        if (i < words.length - 1) result += ' ';
      }
      
      return result;
    }
  },
  {
    id: 'mixed-case',
    name: 'Mixed Case',
    description: 'Text with mixed uppercase and lowercase',
    getText: () => {
      const words = commonWords.slice(0, 40);
      return words.map(word => {
        if (Math.random() > 0.5) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }
        return word;
      }).join(' ');
    }
  }
];

export function getTextById(id: string): string {
  const option = textOptions.find(opt => opt.id === id);
  return option ? option.getText() : textOptions[0].getText();
}

export function getRandomText(): string {
  const randomOption = textOptions[Math.floor(Math.random() * textOptions.length)];
  return randomOption.getText();
}