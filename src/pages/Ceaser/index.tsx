import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { EncryptDecrypt } from './coder/Coder';
import { CrackCipher } from './hacking/Hacking';


function Ceaser() {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Шифорование/Расшифрование',
      children: <EncryptDecrypt />,
    },
    {
      key: '2',
      label: 'Взлом',
      children: <CrackCipher />,
    },
  ];

  return (
    <>
      <Tabs items={items} style={{ width: '100%' }}/>
    </>
  )
}

export default Ceaser