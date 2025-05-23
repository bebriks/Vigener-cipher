import { useState } from 'react';
import { Button, Input, Alert, Radio, Card, Form } from 'antd';
import { crack, processText, decrypt } from '../../../utils/cipher';

const { TextArea } = Input;

export const CrackCipher = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isCyrillic, setIsCyrillic] = useState(true);

  const handleCrack = () => {
    const cleaned = processText(input, isCyrillic);

    if(cleaned.length === 0) {
      setResult('')
      setError('Зашифрованный текст должен содержать символы киррилицы или латиницы')
      return
    }
    
    const guessedKey = crack(cleaned, isCyrillic);
    console.log(guessedKey)
    const decrypted = decrypt(cleaned, guessedKey, isCyrillic);
    setError(null)
    setResult([
      `Определенный ключ: ${guessedKey}`,
      `Расшифрованный текст: ${groupText(decrypted)}`
    ].join('\n'));
  };
  const groupText = (text: string) => 
    text.match(/.{1,5}/g)?.join(' ') || '';

  return (
    <Card title="Взлом шифра Цезаря">
      <Form layout="vertical">
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
          label='Зашифрованный текст'
          name="text"
        >
            <TextArea
                value={input}
                onChange={e => setInput(e.target.value)}
                rows={4}
                placeholder="Введите зашифрованный текст..."
            />
      </Form.Item>

      <Button 
        onClick={handleCrack} 
        type="primary" 
        style={{ margin: '10px 0' }}
      >
        Взломать
      </Button>

      {result && <Alert message={result} type="success" />}
      {error && <Alert message={error} type="error" />}
      </Form>
    </Card>
  );
};