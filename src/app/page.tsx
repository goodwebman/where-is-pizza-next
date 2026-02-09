'use client'
import { useState } from 'react';
import { Icons } from '../shared/assets/svg/components';
import { Buttons } from '../shared/ui/buttons';
import { Tabs } from '../shared/ui/tabs/tabs'

export default function Home() {
  const [active, setActive] = useState<string | number>('tab1');
  const tabsData = [
  { label: 'Традиционное', value: 'tab1' },
  { label: 'Тонкое', value: 'tab2' },
  
  
];


  return (
    <div
      style={{
        margin: '50px',
        display: 'flex',
        gap: '20px',

        width: '200px',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '20px',
          flexDirection: 'column',
          width: '200px',
        }}
      >
        <Buttons.DefaultButton>Применить</Buttons.DefaultButton>
        <Buttons.DefaultButton isLoading>Применить</Buttons.DefaultButton>
        <Buttons.DefaultButton disabled>Применить</Buttons.DefaultButton>

        <Buttons.DefaultButton variant="ghost">Применить</Buttons.DefaultButton>
        <Buttons.DefaultButton variant="ghost" isLoading>
          Применить
        </Buttons.DefaultButton>
        <Buttons.DefaultButton variant="ghost" disabled>
          Применить
        </Buttons.DefaultButton>

        <Buttons.DefaultButton variant="danger">
          Применить
        </Buttons.DefaultButton>
        <Buttons.DefaultButton variant="danger" isLoading>
          Применить
        </Buttons.DefaultButton>
        <Buttons.DefaultButton variant="danger" disabled>
          Применить
        </Buttons.DefaultButton>
      </div>

      <div>
        <Buttons.IconButton icon={<Icons.LeftArrow width={20} height={20} />} />
      </div>

      <div>
        <Tabs tabs={tabsData} activeTab={active} onChange={setActive} />
      </div>
    </div>
  );
}
