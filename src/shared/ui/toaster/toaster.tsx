import { Toaster as HotToaster } from 'react-hot-toast';
import { getClasses } from './styles/get-classes';

export const Toaster = () => {
  const { cnRoot, cnSuccess, cnError, cnDefault } = getClasses();

  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        success: {
          className: `${cnRoot} ${cnSuccess}`,
        },
        error: {
          className: `${cnRoot} ${cnError}`,
        },
        blank: {
          className: `${cnRoot} ${cnDefault}`,
        },
      }}
    />
  );
};