import './App.css'

import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import VigenereCipher from './pages/Vigener/decoder/Decoders';
import VigenereCracker from './pages/Vigener/hacking/Hacking';
import { EncryptDecrypt } from './components/EncryptDecrypt';
import { CrackCipher } from './components/CrackCipher';
import Vigener from './pages/Vigener';
import Ceaser from './pages/Ceaser';

function App() {
  const onChange = (key: string) => {
  };
  
  /* const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Шифорование',
      children: <VigenereCipher />,
    },
    {
      key: '2',
      label: 'Взлом',
      children: <VigenereCracker />,
    },
    {
      key: '3',
      label: 'Цезарь',
      children: <EncryptDecrypt />,
    },
    {
      key: '4',
      label: 'Взлом Цезарь',
      children: <CrackCipher />,
    },
  ]; */
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Шифр Виженера',
      children: <Vigener />,
    },
    {
      key: '2',
      label: 'Шифр Цезаря',
      children: <Ceaser />,
    },
  ];

  return (
    <>
      <Tabs items={items} onChange={onChange} style={{ width: '100%' }} />
    </>
  )
}

export default App
