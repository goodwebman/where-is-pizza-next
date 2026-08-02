'use client';

import { TabsRoot } from '@/src/shared/ui/tabs/tabs';
import { usePathname, useRouter } from 'next/navigation';
import { getClasses } from './styles/get-classes';

type UserProfileSectionsTabsProps = {
  /** Guests get the order history but not the account settings tab. */
  isAuthenticated?: boolean;
};

const ORDERS_TAB = { label: 'История заказов', value: 'orders' as const };
const SETTINGS_TAB = { label: 'Настройки', value: 'settings' as const };

export const UserProfileSectionsTabs = ({
  isAuthenticated = false,
}: UserProfileSectionsTabsProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const activeTab = pathname.split('/').pop() as 'orders' | 'settings';

  const tabs = isAuthenticated ? [ORDERS_TAB, SETTINGS_TAB] : [ORDERS_TAB];

  const handleChange = (value: string) => {
    router.push(`/profile/${value}`);
  };

  const { cnRoot, cnLabel } = getClasses();

  return (
    <aside className={cnRoot}>
      <h1 className={cnLabel}>{isAuthenticated ? 'Мой аккаунт' : 'Заказы'}</h1>
      <TabsRoot tabs={tabs} activeTab={activeTab} onChange={handleChange} />
    </aside>
  );
};
