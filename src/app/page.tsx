'use client';
import { useState } from 'react';
import { Icons } from '../shared/assets/svg/components';
import { Buttons } from '../shared/ui/buttons';
import { Checkbox } from '../shared/ui/checkbox';
import { Radio } from '../shared/ui/radio';
import { Tabs } from '../shared/ui/tabs';
import { TagButton } from '../shared/ui/tag-selector/tag-button';
import { TagContainer } from '../shared/ui/tag-selector/tag-container';

export default function Home() {
  const [active, setActive] = useState<string | number>('tab1');
  const [value, setValue] = useState<'fast' | 'time'>('fast');
  const [fast, setFast] = useState(false);
  const [time, setTime] = useState(false);
  const tabsData = [
    { label: 'Традиционное', value: 'tab1' },
    { label: 'Тонкое', value: 'tab2' },
  ];

  const [selected, setSelected] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    if (selected.includes(tag)) {
      setSelected(selected.filter(t => t !== tag));
    } else {
      setSelected([...selected, tag]);
    }
  };
  const options = ['React', 'TypeScript', 'Next.js'];

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

      <div>
        <Radio.Container>
          <Radio.Button
            label="Как можно скорее"
            checked={value === 'fast'}
            onChange={() => setValue('fast')}
          />
          <Radio.Button
            label="По времени"
            checked={value === 'time'}
            onChange={() => setValue('time')}
          />
        </Radio.Container>
      </div>

      <div>
        <Checkbox.Container>
          <Checkbox.Button
            label="Как можно скорее"
            checked={fast}
            onChange={() => setFast(!fast)}
          />
          <Checkbox.Button
            label="По времени"
            checked={time}
            onChange={() => setTime(!time)}
          />
        </Checkbox.Container>
      </div>
      <div>
        <TagContainer>
          {options.map(tag => (
            <TagButton
              key={tag}
              label={tag}
              selected={selected.includes(tag)}
              onClick={() => toggleTag(tag)}
            />
          ))}
        </TagContainer>
      </div>
    </div>
  );
}
