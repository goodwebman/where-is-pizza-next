'use client';
import { useState } from 'react';
import { Icons } from '../shared/assets/svg/components';
import { Buttons } from '../shared/ui/buttons';
import { Checkbox } from '../shared/ui/checkbox';
import { BaseInput } from '../shared/ui/inputs/base-input/base-input';
import { Radio } from '../shared/ui/radio';
import { Tabs } from '../shared/ui/tabs';
import { TagSelector } from '../shared/ui/tag-selector';

export default function Home() {
  const [value, setValue] = useState<'fast' | 'time'>('fast');
  const [fast, setFast] = useState(false);
  const [time, setTime] = useState(false);
  const tabsData = [
    { label: 'Традиционное', value: 'tab1' },
    { label: 'Тонкое', value: 'tab2' },
  ];
  const [activeTab, setActiveTab] = useState<
    (typeof tabsData)[number]['value']
  >(tabsData[0].value);

  const [selected, setSelected] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    if (selected.includes(tag)) {
      setSelected(selected.filter(t => t !== tag));
    } else {
      setSelected([...selected, tag]);
    }
  };
  const options = ['React', 'TypeScript', 'Next.js'];

  const [value1, setValue1] = useState('');
  const [errorValue, setErrorValue] = useState('');
  const [successValue, setSuccessValue] = useState('');

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
        <Tabs.Container>
          {tabsData.map(tab => (
            <Tabs.Tab
              key={tab.value}
              label={tab.label}
              value={tab.value}
              isActive={activeTab === tab.value}
              onClick={setActiveTab}
            />
          ))}
        </Tabs.Container>
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
        <TagSelector.TagContainer>
          {options.map(tag => (
            <TagSelector.TagButton
              key={tag}
              label={tag}
              selected={selected.includes(tag)}
              onClick={() => toggleTag(tag)}
            />
          ))}
        </TagSelector.TagContainer>
      </div>
      <div style={{ display: 'flex', gap: '40px', flexDirection: 'column' }}>
        <h1>Примеры BaseInput</h1>

        {/* Обычный инпут */}
        <BaseInput
          label="Обычный инпут"
          placeholder="Введите текст"
          value={value1}
          onChange={e => setValue1(e.target.value)}
        />

        {/* Инпут с ошибкой */}
        <BaseInput
          label="Инпут с ошибкой"
          placeholder="Введите текст"
          value={errorValue}
          onChange={e => setErrorValue(e.target.value)}
          errorMessage={errorValue.length < 3 ? 'Минимум 3 символа' : undefined}
          isClearable
        />

        {/* Инпут с успехом */}
        <BaseInput
          label="Инпут с успехом"
          placeholder="Введите текст"
          value={successValue}
          onChange={e => setSuccessValue(e.target.value)}
          successMessage={successValue.length > 3 ? 'Отлично!' : undefined}
          isClearable
        />

        {/* Инпут с кнопкой очистки и кастомным контентом справа */}
        <BaseInput
          label="Инпут с кнопкой очистки"
          placeholder="Введите текст"
          value={value1}
          onChange={e => setValue1(e.target.value)}
          contentRight={
            <span style={{ fontSize: 12, color: '#888' }}>Подсказка</span>
          }
          isClearable
        />

        {/* Загружающийся инпут */}
      </div>
    </div>
  );
}
