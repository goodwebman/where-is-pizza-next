import { useContext } from 'react'
import { LocationContext } from './location-context'

export const useLocation = () => {
  const context = useContext(LocationContext);

  if (!context) {
    throw new Error('useLocation must be used inside LocationProvider');
  }

  return context;
};