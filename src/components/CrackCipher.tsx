import { useState } from 'react';
import { Button, Input, Typography, Alert, Radio, message } from 'antd';
import { crack, processText, decrypt } from '../utils/cipher';

const { TextArea } = Input;
const { Title } = Typography;

export const CrackCipher = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isCyrillic, setIsCyrillic] = useState(true);

    const handleCrack = () => {
    const cleaned = processText(input, isCyrillic);
    if (cleaned.length < 50) {
      message.warning('Для точного взлома нужно не менее 50 символов');
      return;
    }
    
    const guessedKey = crack(cleaned, isCyrillic);
    const decrypted = decrypt(cleaned, guessedKey, isCyrillic);
    
    setResult([
      `Определенный ключ: ${guessedKey}`,
      `Расшифрованный текст: ${groupText(decrypted)}`
    ].join('\n'));
  };
  const groupText = (text: string) => 
    text.match(/.{1,5}/g)?.join(' ') || '';

  return (
    <div style={{ padding: 20 }}>
      <Title level={3}>Взлом шифра</Title>
      <Radio.Group
        value={isCyrillic}
        onChange={e => setIsCyrillic(e.target.value)}
      >
        <Radio value={true}>Кириллица</Radio>
        <Radio value={false}>Латиница</Radio>
      </Radio.Group>
      
      <TextArea
        value={input}
        onChange={e => setInput(e.target.value)}
        rows={4}
        placeholder="Введите зашифрованный текст..."
      />

      <Button 
        onClick={handleCrack} 
        type="primary" 
        style={{ margin: '10px 0' }}
      >
        Взломать
      </Button>

      {result && <Alert message={result} type="success" />}
    </div>
  );
};