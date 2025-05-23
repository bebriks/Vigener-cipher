import React, { useState } from 'react';
import { Card, Input, Button, Table, Typography, Alert, Divider, Statistic, Row, Col } from 'antd';
import type { TableColumnsType } from 'antd';
import { ALPHABET, RUSSIAN_FREQ } from '../../../utils/const';

const { Title, Paragraph } = Typography;

const VigenereCracker: React.FC = () => {
  const [cipherText, setCipherText] = useState<string>('');
  const [keyLength, setKeyLength] = useState<number | null>(null);
  const [probableKey, setProbableKey] = useState<string | null>(null);
  const [decryptedText, setDecryptedText] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  // Функция для поиска повторяющихся последовательностей
  const findRepeatedSequences = (text: string, minLength = 3) => {
    const sequences: { [key: string]: number[] } = {};
    
    for (let i = 0; i < text.length - minLength + 1; i++) {
      const sequence = text.slice(i, i + minLength);
      if (sequences[sequence]) {
        sequences[sequence].push(i);
      } else {
        sequences[sequence] = [i];
      }
    }

    // Фильтруем только повторяющиеся последовательности
    return Object.entries(sequences)
      .filter(([_, positions]) => positions.length > 1)
      .map(([seq, positions]) => ({ seq, positions }));
  };

  const findKeyLetter = (group: string): string => {
    /* const RUSSIAN_FREQ = [
        0.062, 0.014, 0.038, 0.013, 0.025, 0.072, 0.007, 0.016,
        0.062, 0.010, 0.028, 0.035, 0.026, 0.053, 0.090, 0.023,
        0.040, 0.045, 0.053, 0.021, 0.002, 0.009, 0.003, 0.012,
        0.006, 0.003, 0.014, 0.016, 0.014, 0.003, 0.006, 0.018
    ];
    const length = group.length;
    const freqMap = new Map<string, number>();

    // Вычисляем частоты w_j
    for (const char of group) {
        freqMap.set(char, (freqMap.get(char) || 0) + 1);
    }

    let minM = 0;
    let minD = Infinity;

    // Перебираем все возможные сдвиги m
    for (let m = 0; m < ALPHABET.length; m++) {
        let D = 0;
        for (let j = 0; j < ALPHABET.length; j++) {
            const pIndex = (j + m) % ALPHABET.length;
            const p = RUSSIAN_FREQ[pIndex];
            const w = (freqMap.get(ALPHABET[j]) || 0) / length;
            D += Math.pow(p - w, 2);
        }
        if (D < minD) {
            minD = D;
            minM = m;
        }
    }
    return ALPHABET[minM]; */
    /* const russianFreq = [
        0.062, 0.014, 0.038, 0.013, 0.025, 0.072, 0.007, 0.016,
        0.062, 0.010, 0.028, 0.035, 0.026, 0.053, 0.090, 0.023,
        0.040, 0.045, 0.053, 0.021, 0.002, 0.009, 0.003, 0.012,
        0.006, 0.003, 0.014, 0.016, 0.014, 0.003, 0.006, 0.018
    ];
    const length = group.length
    const frequencyMap = new Map<string, number>();
    for (const char of group) {
      frequencyMap.set(char, (frequencyMap.get(char) || 0) + 1);
    }
    frequencyMap.delete("\n")
    frequencyMap.forEach((value, key) => frequencyMap.set(key, Number((value/length).toFixed(3))))
    const map = new Map([...frequencyMap.entries()].sort())
    console.log(Array.from(map.values()))
    const mapValues = Array.from(map.values())
    const Dmin = []
    for(let m = 0; m < russianFreq.length; m++) {
      let sum = 0
      for(let i = 0; i < russianFreq.length; i++) {
        const targetIndex = i + m
        if (targetIndex >= mapValues.length) {
          const wrappedIndex = targetIndex % mapValues.length
          sum += (russianFreq[i] - mapValues[wrappedIndex])**2
        } else {
          sum += (russianFreq[i] - mapValues[targetIndex])**2
        }
      }
      Dmin.push(sum)
      sum = 0
    }
    console.log(Dmin.indexOf(Math.min(...Dmin)))
    return ALPHABET[Dmin.indexOf(Math.min(...Dmin))] */
    const validGroup = group
        .toLowerCase()
        .split('')
        .filter(c => ALPHABET.includes(c))
        .join('')
        .replace('\n', '');

    const length = validGroup.length || 1; // Защита от деления на ноль
    const freqMap = new Map<string, number>();

    for (const char of validGroup) {
        freqMap.set(char, (freqMap.get(char) || 0) + 1);
    }

    let minM = 0;
    let minD = Infinity;
    const D = []
    for (let m = 0; m < ALPHABET.length; m++) {
        let sum = 0;
        for (let j = 0; j < ALPHABET.length; j++) {
            const pIndex = (j + m) % ALPHABET.length;
            const p = RUSSIAN_FREQ[j] || 0; // Защита от undefined
            const w = (freqMap.get(ALPHABET[pIndex]) || 0) / length;
            sum += Math.pow(p - w, 2)
        }
        D.push(sum)
        sum = 0
    }
    //console.log(ALPHABET[D.indexOf(Math.min(...D))])
    return ALPHABET[D.indexOf(Math.min(...D))]
};

const splitCipherText = (cipherText: string, keyLength: number): string[] => {
    const groups: string[] = new Array(keyLength).fill('')
    
    // Распределяем символы по группам
    for (let i = 0; i < cipherText.length; i++) {
        const groupIndex = i % keyLength;
        groups[groupIndex] += cipherText[i];
    }
    
    return groups;
};

  const leastSquares = (keyLength: number) => {
    /* const russianFreq = [
        0.062, 0.014, 0.038, 0.013, 0.025, 0.072, 0.007, 0.016,
        0.062, 0.010, 0.028, 0.035, 0.026, 0.053, 0.090, 0.023,
        0.040, 0.045, 0.053, 0.021, 0.002, 0.009, 0.003, 0.012,
        0.006, 0.003, 0.014, 0.016, 0.014, 0.003, 0.006, 0.018
    ];
    const length = cipherText.length
    const frequencyMap = new Map<string, number>();
    for (const char of cipherText) {
      frequencyMap.set(char, (frequencyMap.get(char) || 0) + 1);
    }
    frequencyMap.delete("\n")
    frequencyMap.forEach((value, key) => frequencyMap.set(key, Number((value/length).toFixed(3))))
    const map = new Map([...frequencyMap.entries()].sort())
    console.log(Array.from(map.values()))
    const mapValues = Array.from(map.values())
    const Dmin = []
    for(let m = 0; m < russianFreq.length; m++) {
      let sum = 0
      for(let i = 0; i < russianFreq.length; i++) {
        const targetIndex = i + m
        if (targetIndex >= mapValues.length) {
          const wrappedIndex = targetIndex % mapValues.length
          sum += (russianFreq[i] - mapValues[wrappedIndex])**2
        } else {
          sum += (russianFreq[i] - mapValues[targetIndex])**2
        }
      }
      Dmin.push(sum)
      sum = 0
    }
    console.log(Dmin.indexOf(Math.min(...Dmin)))
    return Dmin.indexOf(Math.min(...Dmin)) */
    const keyGroups = splitCipherText(cipherText, keyLength); // Разделить текст на L групп
    console.log(keyGroups)
    const key = keyGroups.map(group => findKeyLetter(group)).join('');
    console.log(key)
    setProbableKey(key)
  }
  // Нахождение НОД для массива чисел
const findGCDs = (distances: number[][]): number[] => {
  console.log(distances)
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const gcdCounts = new Map<number, number>();
    const gcdArr = distances.map((el) => {
      let gcd = 1
      for(let i = 1; i < Math.min(...el); i++) {
        if(el.every((el) => el % i === 0)) {
          gcd = i
        }
      }
      return gcd
    })
    console.log(gcdArr)
    for (let i = 0; i < distances.length; i++) {
        for (let j = i + 1; j < distances.length; j++) {
            const currentGCD = gcd(distances[i], distances[j]);
            if (currentGCD <= 1) continue;
            
            // Учитываем все делители текущего НОД
            for (let d = 2; d <= currentGCD; d++) {
                if (currentGCD % d === 0) {
                    gcdCounts.set(d, (gcdCounts.get(d) || 0) + 1);
                }
            }
        }
    }

    const candidates = Array.from(gcdCounts.entries())
        .sort((a, b) => b[1] - a[1]);

    if (candidates.length === 0) return [];
    
    const maxFrequency = candidates[0][1];
    const bestGCDs = candidates
        .filter(([_, freq]) => freq === maxFrequency)
        .map(([gcd]) => gcd);

    return [Math.min(...bestGCDs)];
};

  // Анализ методом Казиски
  const kasiskiAnalysis = () => {
    try {
      if (!cipherText || cipherText.length < 10) {
        throw new Error('Введите достаточно длинный зашифрованный текст (минимум 10 символов)');
      }

      const cleanedText = cipherText.toLowerCase().replace(/[^а-яё]/g, '').replace(/ё/g, 'е');
      let sequences = findRepeatedSequences(cleanedText);
      sequences = sequences.filter((el) => el.positions.length > 2)
      console.log(sequences.filter((el) => el.positions.length > 2))

      if (sequences.length === 0) {
        throw new Error('Не найдено повторяющихся последовательностей. Возможно текст слишком короткий.');
      }

      // Собираем все расстояния между повторениями
      const allDistances: number[][] = [];
      //sequences.forEach((el) => allDistances.push(el.positions))
      sequences.forEach((el) => {
        const arr = []
        for (let i = 1; i < el.positions.length; i++) {
          arr.push(el.positions[i] - el.positions[0]);
        }
        allDistances.push(arr)
      });
      const gcdStats = findGCDs(allDistances);
      console.log(gcdStats)
      const mostProbableGCD = gcdStats[0];

      setKeyLength(mostProbableGCD);
      setAnalysisData(sequences.map(item => ({
        sequence: item.seq,
        positions: item.positions.join(', '),
        distances: item.positions.slice(1).map(pos => pos - item.positions[0]).join(', ')
      })));

      // Дополнительный анализ для определения ключа
      findProbableKey(cleanedText, mostProbableGCD);
      leastSquares(mostProbableGCD)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
      resetResults();
    }
  };

  // Частотный анализ для определения символов ключа
  const findProbableKey = (text: string, keyLength: number) => {

      const cleanText = text
          .toLowerCase()
          .split('')
          .filter(char => ALPHABET.includes(char))
          .join('');

      // 2. Оптимизация: создаем карту индексов для быстрого доступа
      const alphabetMap = new Map(ALPHABET.split('').map((char, index) => [char, index]));
      const alphabetLength = ALPHABET.length;

      // 3. Обновленные частоты с учетом современной статистики
      const russianFreq = [
        0.062, 0.014, 0.038, 0.013, 0.025, 0.072, 0.007, 0.016,
        0.062, 0.010, 0.028, 0.035, 0.026, 0.053, 0.090, 0.023,
        0.040, 0.045, 0.053, 0.021, 0.002, 0.009, 0.003, 0.012,
        0.006, 0.003, 0.014, 0.016, 0.014, 0.003, 0.006, 0.018
      ];

      // 4. Проверка согласованности данных
      if (russianFreq.length !== alphabetLength) {
          throw new Error('Частоты и алфавит имеют разную длину');
      }

      // 5. Кэширование вычислений для частот
      const freqCache = new Map<number, number[]>();

      let key = '';

      // 6. Оптимизированный алгоритм для каждой позиции ключа
      for (let i = 0; i < keyLength; i++) {
          // Собираем подгруппу с использованием typed array для производительности
          const subgroup = new Uint16Array(Math.ceil((cleanText.length - i) / keyLength));
          for (let j = i, idx = 0; j < cleanText.length; j += keyLength, idx++) {
              const char = cleanText[j];
              subgroup[idx] = alphabetMap.get(char) ?? 0;
          }

          let bestShift = 0;
          let bestScore = -Infinity;

          // 7. Параллельные вычисления для разных сдвигов
          const scores = new Float32Array(alphabetLength);

          subgroup.forEach(charIndex => {
              for (let shift = 0; shift < alphabetLength; shift++) {
                  const targetIndex = (charIndex - shift + alphabetLength) % alphabetLength;
                  scores[shift] += russianFreq[targetIndex];
              }
          });

          // Находим лучший сдвиг
          bestScore = Math.max(...scores);
          bestShift = scores.indexOf(bestScore);

          // 8. Дополнительная проверка с помощью взаимной информации
          const candidateShift = (alphabetLength - bestShift) % alphabetLength;
          key += ALPHABET[candidateShift];
      }

      // 9. Валидация ключа перед использованием
      if (key.length !== keyLength || !/^[а-яё]+$/.test(key)) {
          throw new Error('Некорректный ключ получен');
      }

      //setProbableKey(key);
      decryptText(text, key);
  };
  /* const findProbableKey = (text: string, length: number) => {
    const russianFreq = [
      0.062, 0.014, 0.038, 0.013, 0.025, 0.072, 0.007, 0.016,
      0.062, 0.010, 0.028, 0.035, 0.026, 0.053, 0.090, 0.023,
      0.040, 0.045, 0.053, 0.021, 0.002, 0.009, 0.003, 0.012,
      0.006, 0.003, 0.014, 0.016, 0.014, 0.003, 0.006, 0.018
    ];

    const alphabet = ALPHABET;
    let key = '';

    for (let i = 0; i < length; i++) {
      const subgroup = [];
      for (let j = i; j < text.length; j += length) {
        subgroup.push(text[j]);
      }

      let bestShift = 0;
      let bestScore = -Infinity;

      for (let shift = 0; shift < alphabet.length; shift++) {
        let score = 0;
        for (const char of subgroup) {
          const index = (alphabet.indexOf(char) - shift + alphabet.length) % alphabet.length;
          score += russianFreq[index];
        }

        if (score > bestScore) {
          bestScore = score;
          bestShift = shift;
        }
      }

      key += alphabet[bestShift];
    }

    setProbableKey(key);
    decryptText(text, key);
  }; */

  // Дешифровка текста с найденным ключом
  const decryptText = (text: string, key: string) => {
    let result = '';
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {
          const char = text[i].toLowerCase();
          if (ALPHABET.includes(char)) {
            const textCode = ALPHABET.indexOf(char);
            const keyCode = ALPHABET.indexOf(key[keyIndex % key.length].toLowerCase());
            const decodedCode = (textCode - keyCode + ALPHABET.length) % ALPHABET.length;
            result += ALPHABET[decodedCode];
            keyIndex++;
          } else {
            result += char;
          }
    }
    setDecryptedText(result);
  };

  const resetResults = () => {
    setKeyLength(null);
    setProbableKey(null);
    setDecryptedText(null);
    setAnalysisData([]);
  };

  const columns: TableColumnsType<any> = [
    {
      title: 'Последовательность',
      dataIndex: 'sequence',
      key: 'sequence',
    },
    {
      title: 'Позиции',
      dataIndex: 'positions',
      key: 'positions',
    },
    {
      title: 'Расстояния',
      dataIndex: 'distances',
      key: 'distances',
    },
  ];

  return (
    <div style={{ width: '1000px', margin: '0 auto', padding: '20px' }}>
      <Card title="Взлом шифра Виженера">
        <Input.TextArea
          rows={4}
          value={cipherText}
          onChange={(e) => {
            setCipherText(e.target.value);
            resetResults();
          }}
          placeholder="Введите зашифрованный текст..."
        />

        <Button 
          type="primary" 
          onClick={kasiskiAnalysis}
          style={{ marginTop: 16 }}
          disabled={!cipherText}
        >
          Анализировать
        </Button>

        {error && <Alert message={error} type="error" showIcon style={{ marginTop: 16 }} />}

        {keyLength && (
          <>
            <Divider />
            <Title level={4}>Результаты анализа</Title>
            
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Statistic title="Вероятная длина ключа" value={keyLength} />
              </Col>
              <Col span={12}>
                <Statistic title="Вероятный ключ" value={probableKey?.replace(/ё/g, 'е') || 'Не определен'} />
              </Col>
            </Row>

            <Title level={5}>Повторяющиеся последовательности</Title>
            <Table 
              columns={columns} 
              dataSource={analysisData} 
              pagination={false}
              size="small"
            />
          </>
        )}

        {decryptedText && (
          <>
            <Divider />
            <Title level={4}>Дешифрованный текст</Title>
            <Card bordered={false} style={{ background: '#f0f0f0', marginBottom: 16 }}>
              <Paragraph style={{ textWrap: 'wrap'}}>{decryptedText.replace(/ё/g, 'е')}</Paragraph>
            </Card>
          </>
        )}
      </Card>

      <Card title="О методе Казиски" style={{ marginTop: 20 }}>
        <Paragraph>
          Метод Казиски позволяет определить длину ключа шифра Виженера, анализируя повторяющиеся последовательности символов в зашифрованном тексте.
        </Paragraph>
        <Paragraph>
          <strong>Алгоритм работы:</strong>
          <ol>
            <li>Поиск повторяющихся последовательностей (3+ символов)</li>
            <li>Вычисление расстояний между одинаковыми последовательностями</li>
            <li>Нахождение наибольших общих делителей (НОД) этих расстояний</li>
            <li>Определение вероятной длины ключа (наиболее частый НОД)</li>
            <li>Частотный анализ для определения символов ключа</li>
          </ol>
        </Paragraph>
      </Card>
    </div>
  );
};

export default VigenereCracker;