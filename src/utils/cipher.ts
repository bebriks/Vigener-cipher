export const processTextCrack = (text: string, isCyrillic: boolean): string => {
  const regex = isCyrillic 
    ? /[^а-я]/g  
    : /[^a-z]/g;

  const cleaned = text
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(regex, '');

  return cleaned
};
export const processText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^а-яa-z]/g, '');
};

export const adjustKey = (key: number, isCyrillic?: boolean): number => {
  const max = isCyrillic ? 32 : 26;
  return ((key % max) + max) % max;
};

const cipher = (text: string, key: number, encrypt: boolean): string => {
  return text.split('').map(c => {
    // Определение алфавита для каждого символа
    const isCyrillic = /[а-я]/.test(c);
    const alphabetSize = isCyrillic ? 32 : 26;
    const baseCharCode = isCyrillic ? 1072 : 97;
    const direction = encrypt ? 1 : -1;

    const code = c.charCodeAt(0) - baseCharCode;
    if (code < 0 || code >= alphabetSize) return c;
    
    const shifted = (code + (key * direction) + alphabetSize) % alphabetSize;
    return String.fromCharCode(shifted + baseCharCode);
  }).join('');
};
export const encrypt = (text: string, key: number): string => {
  return cipher(text, key, true);
};

export const decrypt = (text: string, key: number): string => {
  return cipher(text, key, false);
}

const russianFrequencies: { [key: string]: number } = {
  'а': 0.062, 'б': 0.014, 'в': 0.038, 'г': 0.013, 'д': 0.025, 'е': 0.072,
  'ж': 0.007, 'з': 0.016, 'и': 0.062, 'й': 0.010, 'к': 0.028, 'л': 0.035,
  'м': 0.026, 'н': 0.053, 'о': 0.090, 'п': 0.023, 'р': 0.040, 'с': 0.045,
  'т': 0.053, 'у': 0.021, 'ф': 0.002, 'х': 0.009, 'ц': 0.003, 'ч': 0.012,
  'ш': 0.006, 'щ': 0.003, 'ъ': 0.014, 'ы': 0.016, 'ь': 0.014, 'э': 0.003,
  'ю': 0.006, 'я': 0.018
};

const englishFrequencies: { [key: string]: number } = {
  'a': 0.08167, 'b': 0.01492, 'c': 0.02782, 'd': 0.04258,
  'e': 0.12702, 'f': 0.02228, 'g': 0.02015, 'h': 0.06094,
  'i': 0.06966, 'j': 0.00153, 'k': 0.00772, 'l': 0.04025,
  'm': 0.02406, 'n': 0.06749, 'o': 0.07507, 'p': 0.01929,
  'q': 0.00095, 'r': 0.05987, 's': 0.06327, 't': 0.09056,
  'u': 0.02758, 'v': 0.00978, 'w': 0.02360, 'x': 0.00150,
  'y': 0.01974, 'z': 0.00074
};

export const crack = (cipherText: string, isCyrillic: boolean): number => {
  const cleanedText = processText(cipherText);
  const textLength = cleanedText.length;
  const frequencies = isCyrillic ? russianFrequencies : englishFrequencies;
  const alphabetSize = isCyrillic ? 32 : 26;
  let bestShift = 0;
  let minChiSquared = Infinity;
  for (let shift = 0; shift < alphabetSize; shift++) {
    const decrypted = decrypt(cleanedText, shift);
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
      minChiSquared = chiSquared
      bestShift = shift
    }
  }
  return alphabetSize - (alphabetSize - bestShift) % alphabetSize
}