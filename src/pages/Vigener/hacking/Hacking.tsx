/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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

  const findRepeatedSequences = (text: string, minLength = 3) => {
    const sequences: { [key: string]: number[] } = {};
    
    for (let i = 0; i < text.length - minLength + 1; i++) {
      const sequence = text.slice(i, i + minLength);
      sequences[sequence] = sequences[sequence] ? [...sequences[sequence], i] : [i];
    }

    return Object.entries(sequences)
      .filter(([_, positions]) => positions.length > 1)
      .map(([seq, positions]) => ({ seq, positions }));
  };

  const findKeyLetter = (group: string): string => {
    const validGroup = group
      .toLowerCase()
      .split('')
      .filter(c => ALPHABET.includes(c))
      .join('');

    const length = validGroup.length || 1;
    const freqMap = new Map<string, number>();

    for (const char of validGroup) {
      freqMap.set(char, (freqMap.get(char) || 0) + 1);
    }

    let minM = 0;
    let minD = Infinity;

    for (let m = 0; m < ALPHABET.length; m++) {
      let sum = 0;
      for (let j = 0; j < ALPHABET.length; j++) {
        const pIndex = (j + m) % ALPHABET.length;
        const p = RUSSIAN_FREQ[pIndex] || 0;
        const w = (freqMap.get(ALPHABET[j]) || 0) / length;
        sum += Math.pow(p - w, 2);
      }
      if (sum < minD) {
        minD = sum;
        minM = m;
      }
    }
    return ALPHABET[minM];
  };

  const splitCipherText = (text: string, keyLength: number): string[] => {
    const groups = Array.from({ length: keyLength }, () => '');
    for (let i = 0; i < text.length; i++) {
      groups[i % keyLength] += text[i];
    }
    return groups;
  };

  const findGCD = (a: number, b: number): number => (b === 0 ? a : findGCD(b, a % b));

  const findKeyLength = (distances: number[]): number => {
    const gcdCounts = new Map<number, number>();
    
    for (let i = 0; i < distances.length; i++) {
      for (let j = i + 1; j < distances.length; j++) {
        const gcd = findGCD(distances[i], distances[j]);
        if (gcd > 1) gcdCounts.set(gcd, (gcdCounts.get(gcd) || 0) + 1);
      }
    }

    return Array.from(gcdCounts.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 0;
  };

  const kasiskiAnalysis = () => {
    try {
      if (!cipherText || cipherText.length < 10) {
        throw new Error('Введите достаточно длинный зашифрованный текст (минимум 10 символов)');
      }

      const cleanedText = cipherText.toLowerCase()
        .replace(/[^а-яё]/g, '')
        .replace(/ё/g, 'е');

      const sequences = findRepeatedSequences(cleanedText)
        .filter(({ positions }) => positions.length > 2);

      if (sequences.length === 0) {
        throw new Error('Не найдено повторяющихся последовательностей');
      }

      const distances = sequences.flatMap(({ positions }) => 
        positions.slice(1).map(pos => pos - positions[0])
      );

      const calculatedKeyLength = findKeyLength(distances);
      const groups = splitCipherText(cleanedText, calculatedKeyLength);
      const key = groups.map(findKeyLetter).join('');

      setKeyLength(calculatedKeyLength);
      setProbableKey(key);
      setAnalysisData(sequences.map(({ seq, positions }) => ({
        sequence: seq,
        positions: positions.join(', '),
        distances: positions.slice(1).map(pos => pos - positions[0]).join(', ')
      })));

      decryptText(cleanedText, key);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка анализа');
      resetResults();
    }
  };

  const decryptText = (text: string, key: string) => {
    let result = '';
    let keyIndex = 0;

    for (const char of text) {
      if (ALPHABET.includes(char)) {
        const textCode = ALPHABET.indexOf(char);
        const keyCode = ALPHABET.indexOf(key[keyIndex % key.length]);
        result += ALPHABET[(textCode - keyCode + ALPHABET.length) % ALPHABET.length];
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
    { title: 'Последовательность', dataIndex: 'sequence', key: 'sequence' },
    { title: 'Позиции', dataIndex: 'positions', key: 'positions' },
    { title: 'Расстояния', dataIndex: 'distances', key: 'distances' },
  ];

  const groupText = (text: string) => 
    text.match(/.{1,5}/g)?.join(' ') || '';

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
              <Paragraph style={{ textWrap: 'wrap'}}>{groupText(decryptedText.replace(/ё/g, 'е'))}</Paragraph>
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