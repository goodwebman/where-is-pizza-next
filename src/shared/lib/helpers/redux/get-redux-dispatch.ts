import type { AppDispatch } from '@/src/shared/store/redux-store'
import { getStore } from './store-registry'

export const getReduxDispatch = (): AppDispatch | null => {
  if (typeof window === 'undefined') return null
  return (getStore()?.dispatch as AppDispatch) ?? null
}