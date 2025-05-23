import { useState } from 'react';
import { Button, Input, Radio, Typography, Alert } from 'antd';
import { processText, encrypt, decrypt, adjustKey } from '../utils/cipher';

const { TextArea } = Input;
const { Title } = Typography;

export const EncryptDecrypt = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [key, setKey] = useState(0);
  const [isCyrillic, setIsCyrillic] = useState(true);

  const handleProcess = () => {
    setInput('')
  };

  const handleEncrypt = () => {
    const cleaned = processText(input, isCyrillic);
    const adjustedKey = adjustKey(key, isCyrillic);
    setOutput(groupText(encrypt(cleaned, adjustedKey, isCyrillic)));
  };

  const handleDecrypt = () => {
    const cleaned = processText(input, isCyrillic);
    const adjustedKey = adjustKey(key, isCyrillic);
    setOutput(groupText(decrypt(cleaned, adjustedKey, isCyrillic)));
    console.log(output)
  };

  const groupText = (text: string) => 
    text.match(/.{1,5}/g)?.join(' ') || '';

  return (
    <div style={{ padding: 20, width: '100%' }}>
      <Title level={3}>Шифрование/Дешифрование</Title>
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
        placeholder="Введите текст..."
      />

      <Input
        type="number"
        value={key}
        onChange={e => setKey(parseInt(e.target.value) || 0)}
        style={{ margin: '10px 0' }}
      />

      <div style={{ margin: '10px 0' }}>
        <Button onClick={handleProcess}>Очистить текст</Button>
        <Button onClick={handleEncrypt} type="primary">Зашифровать</Button>
        <Button onClick={handleDecrypt} type="dashed">Расшифровать</Button>
      </div>

      {output && (
        <div>
          <Title level={5}>Результат:</Title>
          <Alert message={output} type="success" />
        </div>
      )}
    </div>
  );
};