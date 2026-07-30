'use client';

import { TabsRoot } from '@/src/shared/ui/tabs/tabs';
import { usePathname, useRouter } from 'next/navigation';
import { getClasses } from './styles/get-classes';

const tabs = [
  { label: 'История заказов', value: 'orders' },
  { label: 'Настройки', value: 'settings' },
];

export const UserProfileSectionsTabs = () => {
  const pathname = usePathname();
  const router = useRouter();

  const activeTab = pathname.split('/').pop() as 'orders' | 'settings';

  const handleChange = (value: string) => {
    router.push(`/profile/${value}`);
  };

  const { cnRoot, cnLabel } = getClasses();

  return (
    <aside className={cnRoot}>
      <h1 className={cnLabel}>Мой аккаунт</h1>
      <TabsRoot tabs={tabs} activeTab={activeTab} onChange={handleChange} />
    </aside>
  );
};
