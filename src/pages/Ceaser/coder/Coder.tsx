import { useEffect, useState } from 'react';
import { Button, Input, Radio, Card, Form, Space, Divider, RadioChangeEvent } from 'antd';
import { processText, encrypt, decrypt, adjustKey } from '../../../utils/cipher';

const { TextArea } = Input;

export const EncryptDecrypt = () => {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [key, setKey] = useState<number>(0)
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [error, setError] = useState<string>('')
  const [maxKey, setMaxKey] = useState(32)
  const [hasValidChars, setHasValidChars] = useState(false)
  const [hasCyrillic, setHasCyrillic] = useState(false)

  useEffect(() => {
    const cleaned = processText(input);
    const hasChars = cleaned.length > 0;
    setHasCyrillic(/[а-я]/.test(cleaned))
    
    setHasValidChars(hasChars);
    setMaxKey(hasCyrillic ? 32 : 26);
    setError(hasChars ? '' : 'Текст должен содержать буквы кириллицы или латиницы');
  }, [input]);

  const handleProcess = () => {
    setKey(0)
    setInput('')
    setOutput('')
    setError('')
  };

  const handleModeChange = (e: RadioChangeEvent) => {
    setMode(e.target.value);
    setError('');
  };

  const validateKey = (value: number): string => {
    if (value < -maxKey || value > maxKey) return `Ключ должен быть от ${-maxKey} до ${maxKey}`;
    if (isNaN(value)) return 'Введите числовое значение';
    return '';
  };

  const handleCipher = (action: 'encrypt' | 'decrypt') => {
    const keyError = validateKey(key);
    if (keyError) {
      setError(keyError);
      return;
    }

    if (!hasValidChars) {
      setError('Введите текст с допустимыми символами');
      return;
    }

    try {
      const cleaned = processText(input);
      const adjustedKey = adjustKey(key, hasCyrillic);
      const result = action === 'encrypt' 
        ? encrypt(cleaned, adjustedKey)
        : decrypt(cleaned, adjustedKey);
      
      setOutput(groupText(result));
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка обработки текста');
    }
  };

  const groupText = (text: string) => 
    text.match(/.{1,5}/g)?.join(' ') || '';
  return (
  <div style={{ width: '100%', margin: '0 auto' }}>
      <Card title="Шифр Цезаря">
        <Form layout="vertical">
          <Form.Item label="Режим работы">
            <Radio.Group onChange={handleModeChange} value={mode}>
              <Radio value="encode">Зашифровать</Radio>
              <Radio value="decode">Расшифровать</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label={mode === 'encode' ? 'Исходный текст' : 'Зашифрованный текст'}
            validateStatus={error ? 'error' : ''}
            help={error}
          >
            <TextArea 
              rows={4} 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Введите текст (кириллица или латиница)..."
            />
          </Form.Item>

          <Form.Item
            label={`Ключ шифрования (0-${maxKey})`}
            validateStatus={error ? 'error' : ''}
          >
            <Input 
              type="number"
              min={-maxKey}
              max={maxKey}
              value={key}
              onChange={e => {
                const value = Math.max(
                  Math.min(Number(e.target.value), maxKey),
                  -maxKey
                )
                setKey(Number.isNaN(value) ? 0 : value)
                setError('');
              }}
              onKeyDown={(e) => {
                if (!/[-0-9]/.test(e.key) && 
                  e.key !== 'Backspace' && 
                  e.key !== 'Delete' &&
                  e.key !== 'Tab' &&
                  e.key !== 'ArrowLeft' &&
                  e.key !== 'ArrowRight'
                ) {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button onClick={handleProcess}>Очистить</Button>
              <Button 
                type="primary" 
                onClick={() => handleCipher(mode === 'encode' ? 'encrypt' : 'decrypt')}
                disabled={!hasValidChars}
              >
                {mode === 'encode' ? 'Зашифровать' : 'Расшифровать'}
              </Button>
            </Space>
          </Form.Item>
        </Form>

        {output && (
          <>
            <Divider />
            <h3>Результат:</h3>
            <Card 
              bordered={false} 
              style={{ 
                background: '#fafafa',
                fontFamily: 'monospace',
                wordBreak: 'break-all'
              }}
            >
              {output}
            </Card>
            <Button 
              onClick={() => navigator.clipboard.writeText(output.replace(/ /g, ''))}
              style={{ marginTop: 16 }}
            >
              Копировать результат
            </Button>
          </>
        )}
      </Card>

    <Card title="О шифре Цезаря" style={{ marginTop: 20 }}>
      <p>
        Шифр Цезаря — это вид шифра подстановки, в котором каждый символ в тексте заменяется 
        символом, находящимся на некотором постоянном числе позиций левее или правее него в алфавите.
      </p>
      <p>
        <strong>Пример:</strong>
        <br />
        Текст: "привет"
        <br />
        Ключ: 5
        <br />
        Зашифрованный текст: "фхнзкч"
      </p>
    </Card>
  </div>
);
};