'use client';

import { useState } from 'react';

import { useIsAuthorized } from '@/src/entities/session';
import { Icons } from '@/src/shared/assets/svg/components';
import { Buttons } from '@/src/shared/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { UserPasswordForm } from '../components/user-password-form/ui';
import { getClasses } from './styles/get-classes';

export const UserPasswordChange = () => {
  const [change, setChange] = useState(false);
  const { cnHeader, cnLabel, cnRoot } = getClasses({});

  const isAuth = useIsAuthorized();

  if (!isAuth) return null;

  return (
    <section className={cnRoot}>
      <AnimatePresence mode="wait">
        {change ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <UserPasswordForm onCancel={() => setChange(false)} />
          </motion.div>
        ) : (
          <motion.div
            key="view"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className={cnHeader}>
              <h1 className={cnLabel}>Пароль</h1>

              <Buttons.TextButton
                onClick={() => setChange(true)}
                icon={<Icons.Pencil />}
                iconPosition="left"
              >
                Изменить
              </Buttons.TextButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
