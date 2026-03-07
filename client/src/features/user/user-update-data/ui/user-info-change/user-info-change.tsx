'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useUserReturnData } from '../../../user-return-data';
import { UserInfoForm } from '../components/user-info-form/ui/user-info-form';
import { UserInfoView } from '../components/user-info-view/user-info-view';
import { getClasses } from './styles/get-classes';

export const UserInfoChange = () => {
  const [change, setChange] = useState(false);
  const { data: user } = useUserReturnData();

  const { cnRoot } = getClasses({});

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
            <UserInfoForm user={user} onCancel={() => setChange(false)} />
          </motion.div>
        ) : (
          <motion.div
            key="view"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <UserInfoView user={user} onEdit={() => setChange(true)} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
