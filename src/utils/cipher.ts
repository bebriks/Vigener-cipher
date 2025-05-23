// Предварительная обработка текста
export const processText = (text: string, isCyrillic: boolean): string => {
  const cleaned = text
    .toLowerCase()
    .replace(/ё/g, 'е');

  const regex = isCyrillic ? /[^а-я]/g : /[^a-z]/g;
  return cleaned.replace(regex, '');
};

// Корректировка ключа
export const adjustKey = (key: number, isCyrillic: boolean): number => {
  const max = isCyrillic ? 32 : 26;
  //console.log(((key % max) + max) % max)
  return ((key % max) + max) % max;
};

// Шифрование
/* export const encrypt = (text: string, key: number, isCyrillic: boolean): string => {
  const adjustedKey = adjustKey(key, isCyrillic);
  return text.split('').map(c => {
    if (isCyrillic) {
      const code = c.charCodeAt(0);
      const shifted = (code - 1072 + adjustedKey) % 32;
      return String.fromCharCode(shifted + 1072);
    } else {
      const code = c.charCodeAt(0);
      const shifted = (code - 97 + adjustedKey) % 26;
      return String.fromCharCode(shifted + 97);
    }
  }).join('');
}; */
const cipher = (text: string, key: number, isCyrillic: boolean, encrypt: boolean): string => {
  const adjustedKey = adjustKey(key, isCyrillic) * (encrypt ? 1 : -1);
  console.log(adjustedKey)
  const alphabetSize = isCyrillic ? 32 : 26;
  const baseCharCode = isCyrillic ? 1072 : 97; // 'а' для кириллицы, 'a' для латиницы

  return text.split('').map(c => {
    const code = c.charCodeAt(0) - baseCharCode;
    if (code < 0 || code >= alphabetSize) return '';
    
    const shifted = (code + adjustedKey + alphabetSize) % alphabetSize;
    return String.fromCharCode(shifted + baseCharCode);
  }).join('');
};
export const encrypt = (text: string, key: number, isCyrillic: boolean): string => {
  return cipher(text, key, isCyrillic, true);
};
// Дешифрование
/* export const decrypt = (text: string, key: number, isCyrillic: boolean): string => {
    console.log(encrypt(text, -key, isCyrillic))
  return encrypt(text, -key, isCyrillic);
}; */
export const decrypt = (text: string, key: number, isCyrillic: boolean): string => {
  return cipher(text, key, isCyrillic, false);
};
// Частоты русских букв (примерные значения)
const russianFrequencies: { [key: string]: number } = {
  'а': 0.062, 'б': 0.014, 'в': 0.038, 'г': 0.013, 'д': 0.025, 'е': 0.072,
  'ж': 0.007, 'з': 0.016, 'и': 0.062, 'й': 0.010, 'к': 0.028, 'л': 0.035,
  'м': 0.026, 'н': 0.053, 'о': 0.090, 'п': 0.023, 'р': 0.040, 'с': 0.045,
  'т': 0.053, 'у': 0.021, 'ф': 0.002, 'х': 0.009, 'ц': 0.003, 'ч': 0.012,
  'ш': 0.006, 'щ': 0.003, 'ъ': 0.014, 'ы': 0.016, 'ь': 0.014, 'э': 0.003,
  'ю': 0.006, 'я': 0.018
};
// Частоты для английского языка
const englishFrequencies: { [key: string]: number } = {
  'a': 0.08167, 'b': 0.01492, 'c': 0.02782, 'd': 0.04258,
  'e': 0.12702, 'f': 0.02228, 'g': 0.02015, 'h': 0.06094,
  'i': 0.06966, 'j': 0.00153, 'k': 0.00772, 'l': 0.04025,
  'm': 0.02406, 'n': 0.06749, 'o': 0.07507, 'p': 0.01929,
  'q': 0.00095, 'r': 0.05987, 's': 0.06327, 't': 0.09056,
  'u': 0.02758, 'v': 0.00978, 'w': 0.02360, 'x': 0.00150,
  'y': 0.01974, 'z': 0.00074
};

// Взлом шифра
/* export const crack = (cipherText: string): number => {
  const calculateFrequency = (text: string) => {
    const freq: { [key: string]: number } = {};
    text.split('').forEach(c => freq[c] = (freq[c] || 0) + 1);
    return freq;
  };

  let minSum = Infinity;
  let bestShift = 0;

  for (let shift = 0; shift < 32; shift++) {
    const decrypted = decrypt(cipherText, shift, true);
    const observedFreq = calculateFrequency(decrypted);
    let sum = 0;

    Object.keys(russianFrequencies).forEach(char => {
      const expected = russianFrequencies[char];
      const observed = (observedFreq[char] || 0) / decrypted.length;
      sum += Math.pow(observed - expected, 2);
    });

    if (sum < minSum) {
      minSum = sum;
      bestShift = shift;
    }
  }

  return bestShift;
}; */
export const crack = (cipherText: string, isCyrillic: boolean): number => {
  const cleanedText = processText(cipherText, isCyrillic);
  const textLength = cleanedText.length;
  
  const frequencies = isCyrillic ? russianFrequencies : englishFrequencies;
  const alphabetSize = isCyrillic ? 32 : 26;

  let bestShift = 0;
  let minChiSquared = Infinity;

  for (let shift = 0; shift < alphabetSize; shift++) {
    const decrypted = decrypt(cleanedText, shift, isCyrillic);
    const observedCounts: { [key: string]: number } = {};

    for (const char of decrypted) {
      observedCounts[char] = (observedCounts[char] || 0) + 1;
    }

    let chiSquared = 0;
    for (const [char, expectedFreq] of Object.entries(frequencies)) {
      const expected = expectedFreq * textLength;
      const observed = observedCounts[char] || 0;
      chiSquared += Math.pow(observed - expected, 2) / (expected || 1);
    }

    if (chiSquared < minChiSquared) {
      minChiSquared = chiSquared;
      bestShift = shift;
    }
  }
  return alphabetSize - (alphabetSize - bestShift) % alphabetSize;
};