import { useState } from 'react';
import { Button, Input, Radio, Alert, Card, Form, Space, Divider, RadioChangeEvent } from 'antd';
import { processText, encrypt, decrypt, adjustKey } from '../../../utils/cipher';

const { TextArea } = Input;

export const EncryptDecrypt = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [key, setKey] = useState<number>();
  const [isCyrillic, setIsCyrillic] = useState(true);
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState<string>('');
  const [keyError, setKeyError] = useState<string>('');

  const handleProcess = () => {
    setInput('')
  };

  const handleModeChange = (e: RadioChangeEvent) => {
    setMode(e.target.value);
    setError('');
  };

  const handleEncrypt = () => {
    if(keyError.length === 0 && key) {
      const cleaned = processText(input, isCyrillic);
      const adjustedKey = adjustKey(key, isCyrillic);
      setOutput(groupText(encrypt(cleaned, adjustedKey, isCyrillic)))
    }
  };

  const handleDecrypt = () => {
    if(keyError.length === 0 && key) {
      const cleaned = processText(input, isCyrillic);
      const adjustedKey = adjustKey(key, isCyrillic);
      setOutput(groupText(decrypt(cleaned, adjustedKey, isCyrillic)));
    }
  };
  const groupText = (text: string) => 
    text.match(/.{1,5}/g)?.join(' ') || '';

  return (
  <div style={{ width: '100%', margin: '0 auto' }}>
    <Card title="Шифр Цезаря">
      <Form
        layout="vertical"
        initialValues={{ mode: 'encode', alphabet: 'cyrillic' }}
      >
        <Form.Item label="Режим работы" name="mode">
          <Radio.Group onChange={handleModeChange} value={mode}>
            <Radio value="encode">Зашифровать</Radio>
            <Radio value="decode">Расшифровать</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Алфавит" name="alphabet">
          <Radio.Group 
            value={isCyrillic}
            onChange={e => setIsCyrillic(e.target.value)}
          >
            <Radio value={true}>Кириллица (32 буквы без 'ё')</Radio>
            <Radio value={false}>Латиница (26 букв)</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label={mode === 'encode' ? 'Исходный текст' : 'Зашифрованный текст'}
          name="text"
          rules={[{ required: true, message: 'Введите текст' }]}
        >
          <TextArea 
            rows={4} 
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Введите текст..."
          />
        </Form.Item>

        <Form.Item
          label="Ключ шифрования"
          name="key"
          rules={[
            { required: true, message: 'Введите ключ' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const max = getFieldValue('alphabet') ? 32 : 26;
                if (value >= -max && value <= max) {
                  setKeyError('')
                  return Promise.resolve();
                }
                setKeyError(`Ключ должен быть от 0 до ${max}`)
                return Promise.reject(`Допустимый диапазон: от -${max} до ${max}`)
              },
            }),
          ]}
        >
          <Input 
            type="number"
            step="1"
            pattern="[0-9]*"
            value={key}
            onChange={e => setKey(Number.parseInt(e.target.value))}
            onKeyDown={(e) => {
              if (
                !/[-0-9]/.test(e.key) && 
                e.key !== 'Backspace' && 
                e.key !== 'Delete'
              ) {
                e.preventDefault();
              }
            }}
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button onClick={handleProcess}>Очистить текст</Button>
            <Button 
              type="primary" 
              onClick={mode === 'encode' ? handleEncrypt : handleDecrypt}
            >
              {mode === 'encode' ? 'Зашифровать' : 'Расшифровать'}
            </Button>
          </Space>
        </Form.Item>
      </Form>

      {error && <Alert message={error} type="error" showIcon />}

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