import React, { useState } from 'react';
import { Card, Input, Button, Radio, Form, Alert, Divider } from 'antd';
import type { RadioChangeEvent } from 'antd';

import { ALPHABET } from '../../../utils/const';
import { validateChar } from '../../../utils/utils';

const VigenereCipher: React.FC = () => {
  const [form] = Form.useForm();
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleModeChange = (e: RadioChangeEvent) => {
    setMode(e.target.value);
    setResult('');
    setError('');
  };

  const processText = (values: { text: string; key: string }) => {
    try {
      const { text, key } = values;
      if (!text || !key) {
        throw new Error('Заполните все поля');
      }

      const processedText = mode === 'encode' 
        ? vigenereEncode(text, key) 
        : vigenereDecode(text, key);
      console.log(processedText)
      setResult(processedText);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
      setResult('');
    }
  };

  const vigenereEncode = (text: string, key: string): string => {
    let result = '';
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {
      const char = validateChar(text[i].toLowerCase())
      if (ALPHABET.includes(char)) {
        const textCode = ALPHABET.indexOf(char);
        const keyCode = ALPHABET.indexOf(key[keyIndex % key.length].toLowerCase());
        const encodedCode = (textCode + keyCode) % ALPHABET.length;

        result += ALPHABET[encodedCode];
        keyIndex++;
      } else {
        result += char;
      }
    }

    return result;
  };

  const vigenereDecode = (text: string, key: string): string => {
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

    return result;
  };

  return (
    <div style={{ width: '100%', margin: '0 auto' }}>
      <Card title="Шифр Виженера">
        <Form
          form={form}
          layout="vertical"
          onFinish={processText}
          initialValues={{ mode: 'encode' }}
        >
          <Form.Item>
            <Radio.Group onChange={handleModeChange} value={mode}>
              <Radio value="encode">Зашифровать</Radio>
              <Radio value="decode">Расшифровать</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label={mode === 'encode' ? 'Исходный текст' : 'Зашифрованный текст'}
            name="text"
            rules={[{ required: true, message: 'Введите текст' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Ключ"
            name="key"
            rules={[{ required: true, message: 'Введите ключ' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {mode === 'encode' ? 'Зашифровать' : 'Расшифровать'}
            </Button>
          </Form.Item>
        </Form>

        {error && <Alert message={error} type="error" showIcon />}

        {result && (
          <>
            <Divider />
            <h3>Результат:</h3>
            <Card variant={'borderless'} style={{ background: '#f0f0f0' }}>
              {result}
            </Card>
            <Button 
              onClick={() => navigator.clipboard.writeText(result)}
              style={{ marginTop: 16 }}
            >
              Копировать результат
            </Button>
          </>
        )}
      </Card>

      <Card title="О шифре Виженера" style={{ marginTop: 20 }}>
        <p>
          Шифр Виженера — это метод полиалфавитного шифрования буквенного текста с использованием ключевого слова.
        </p>
        <p>
          <strong>Пример:</strong>
          <br />
          Текст: "привет"
          <br />
          Ключ: "ключ"
          <br />
          Зашифрованный текст: "ъьжщпю"
        </p>
      </Card>
    </div>
  );
};

export default VigenereCipher;