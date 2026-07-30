import { ReactNode } from 'react';

export type WithClassNames<T = {}> = T & {
  className?: string;
};

export type WithChildren<T = {}> = T & {
  children: ReactNode;
};
