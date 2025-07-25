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

const longTexts = [
  "Technology has revolutionized the way we live, work, and communicate. From the invention of the wheel to the development of artificial intelligence, human innovation has consistently pushed the boundaries of what is possible. In today's digital age, we are witnessing unprecedented changes in how information is processed, shared, and utilized. The internet has connected billions of people across the globe, creating a vast network of knowledge and collaboration. Social media platforms have transformed how we interact with friends, family, and strangers, while e-commerce has revolutionized the way we shop and conduct business. Mobile devices have put powerful computing capabilities in our pockets, allowing us to access information, communicate, and work from virtually anywhere. As we continue to advance technologically, we must also consider the ethical implications of our innovations and ensure that progress benefits all of humanity.",
  "The art of writing has evolved significantly throughout human history. From ancient cave paintings to modern digital communication, the written word has served as a fundamental tool for preserving knowledge, expressing ideas, and connecting people across time and space. In the early days, writing was primarily used for record-keeping and religious purposes. As civilizations developed, literature emerged as a powerful form of artistic expression, giving birth to epic poems, philosophical treatises, and dramatic works that continue to influence us today. The invention of the printing press democratized access to written materials, leading to increased literacy rates and the spread of ideas. In the modern era, digital technology has once again transformed writing, making it easier than ever to create, edit, and share written content. Despite these technological advances, the fundamental principles of good writing remain unchanged: clarity, coherence, and the ability to engage and inform readers.",
  "Climate change represents one of the most pressing challenges of our time. Scientific evidence overwhelmingly demonstrates that human activities, particularly the burning of fossil fuels, have led to a significant increase in greenhouse gas concentrations in the atmosphere. This has resulted in rising global temperatures, melting ice caps, rising sea levels, and increasingly frequent extreme weather events. The impacts of climate change are already being felt around the world, affecting ecosystems, agriculture, water resources, and human health. Addressing this challenge requires unprecedented global cooperation and immediate action. Governments, businesses, and individuals must work together to reduce greenhouse gas emissions, transition to renewable energy sources, and implement sustainable practices. While the task ahead is daunting, there is still time to limit the worst effects of climate change if we act decisively and collectively. The future of our planet depends on the choices we make today."
];

const burmeseWords = [
  // Basic everyday words (simple and readable)
  'မြန်မာ', 'နိုင်ငံ', 'လူ', 'သား', 'သမီး', 'အိမ်', 'ရေ', 'စား', 'သောက်', 'အိပ်',
  'နေ', 'လ', 'ကြယ်', 'နံနက်', 'ညနေ', 'ည', 'နေ့', 'ရက်', 'လ', 'နှစ်', 'အချိန်', 'မိနစ်',
  
  // Simple technology words
  'ဖုန်း', 'ကွန်ပျူတာ', 'ရေဒီယို', 'တီဗီ', 'ကင်မရာ', 'ဓာတ်ပုံ', 'ဗီဒီယို', 'သီချင်း', 'ရုပ်ရှင်', 'စာ',
  
  // Family words
  'အဖေ', 'အမေ', 'သား', 'သမီး', 'ညီ', 'အစ်ကို', 'နှမ', 'အစ်မ', 'အဘိုး', 'အဘွား', 'ကလေး', 'မြေး',
  
  // Food words
  'ထမင်း', 'ဟင်း', 'ငါး', 'အသား', 'ရေ', 'နို့', 'မုန့်', 'သစ်သီး', 'ကြက်', 'ကြက်ဥ', 'ဆား', 'ချိုး',
  
  // Work words
  'အလုပ်', 'ရုံး', 'ဝန်ထမ်း', 'လုပ်', 'ရောင်း', 'ဝယ်', 'ပိုက်ဆံ', 'လစာ', 'အချိန်', 'နေ့', 'ညနေ',
  
  // Health words
  'ကျန်းမာ', 'ဆေးရုံ', 'ဆရာဝန်', 'ဆေး', 'နာ', 'ကိုယ်', 'ခေါင်း', 'လက်', 'ခြေ', 'မျက်လုံး', 'နား',
  
  // Travel words
  'ခရီး', 'သွား', 'လာ', 'ကား', 'ရထား', 'လေယာဉ်', 'လမ်း', 'ဟိုတယ်', 'အိမ်', 'နေ', 'ရောက်',
  
  // Weather & Time words
  'နေ', 'မိုး', 'လေ', 'နေ့', 'ည', 'နံနက်', 'ညနေ', 'အချိန်', 'နာရီ', 'မိနစ်', 'ရက်', 'လ', 'နှစ်',
  
  // Colors & Nature words
  'နီ', 'ပြာ', 'အစိမ်း', 'ဝါ', 'ဖြူ', 'မည်း', 'သစ်ပင်', 'ပန်း', 'ရွက်', 'တောင်', 'မြစ်', 'ပင်လယ်',
  
  // Education words
  'ကျောင်း', 'ဆရာ', 'ကျောင်းသား', 'စာ', 'စာအုပ်', 'ဖတ်', 'ရေး', 'သင်', 'လေ့လာ', 'စာမေးပွဲ',
  
  // Common verbs
  'လုပ်', 'သွား', 'လာ', 'နေ', 'စား', 'သောက်', 'အိပ်', 'ထ', 'ကြည့်', 'နား', 'ပြော', 'ပေး', 'ယူ', 'ရ',
  
  // Emotions words
  'ပျော်', 'ဝမ်းသာ', 'ကျေနပ်', 'ဝမ်းနည်း', 'ကြောက်', 'ဒေါသ', 'ချစ်', 'မုန်း', 'ပင်ပန်း', 'အားရ'
];

const burmeseQuotes = [
  // Simple wisdom
  'ပညာသည် အင်အား',
  'လုပ်ငန်းမှန် အချိန်နှင့်အညီ',
  'ကြိုးစားမှု အောင်မြင်မှု',
  'ယနေ့ကို ကောင်းအောင် လုပ်ပါ',
  'အမှားမှ သင်ခန်းစာ ယူပါ',
  
  // Life quotes
  'ကြင်နာမှုသည် အင်အား',
  'စိတ်ရှည်မှုသည် ပညာ',
  'မေတ္တာသည် အင်အား',
  'မိတ်ဆွေကောင်းသည် ရတနာ',
  'မိသားစုသည် အရေးကြီး'
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
  },
  {
    id: 'burmese',
    name: 'Burmese',
    description: 'Common Burmese words and phrases',
    getText: () => {
      const shuffled = [...burmeseWords].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 30).join(' ');
    }
  },
  {
    id: 'burmese-quotes',
    name: 'Burmese Quotes',
    description: 'Inspirational Burmese quotes',
    getText: () => {
      return burmeseQuotes[Math.floor(Math.random() * burmeseQuotes.length)];
    }
  },
  {
    id: 'long-text',
    name: 'Long Text',
    description: 'Extended passages for endurance practice',
    getText: () => {
      return longTexts[Math.floor(Math.random() * longTexts.length)];
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