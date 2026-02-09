import { Icons } from '../shared/assets/svg/components';
import { Buttons } from '../shared/ui/buttons';

export default function Home() {
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
    </div>
  );
}
