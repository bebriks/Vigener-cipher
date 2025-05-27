import './App.css'

import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import Vigener from './pages/Vigener';
import Ceaser from './pages/Ceaser';

function App() {
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
      <Tabs items={items} style={{ width: '100%' }} />
    </>
  )
}

export default App
