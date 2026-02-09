import { Button } from '../shared/ui/buttons/button/button';

export default function Home() {
  return (
    <div
      style={{
        margin: '50px',
        display: 'flex',
        gap: '20px',
        flexDirection: 'column',
        width: '200px',
      }}
    >
      <Button>Применить</Button>
      <Button isLoading>Применить</Button>
      <Button disabled>Применить</Button>

      <Button variant='ghost'>Применить</Button>
      <Button variant='ghost' isLoading>Применить</Button>
      <Button variant='ghost' disabled>Применить</Button>

      <Button variant='danger'>Применить</Button>
      <Button variant='danger' isLoading>Применить</Button>
      <Button variant='danger' disabled>Применить</Button>
    </div> 
  );
}
