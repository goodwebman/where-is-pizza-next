import { ReactNode } from 'react';

export type WithClassNames<T = object> = T & {
  className?: string;
};

export type WithChildren<T = object> = T & {
  children: ReactNode;
};
