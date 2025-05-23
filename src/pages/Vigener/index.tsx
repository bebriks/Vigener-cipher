import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import VigenereCipher from './decoder/Decoders';
import VigenereCracker from './hacking/Hacking';


function Vigener() {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Шифорование/Расшифрование',
      children: <VigenereCipher />,
    },
    {
      key: '2',
      label: 'Взлом',
      children: <VigenereCracker />,
    },
  ];

  return (
    <>
      <Tabs items={items} style={{ width: '100%' }} />
    </>
  )
}

export default Vigener