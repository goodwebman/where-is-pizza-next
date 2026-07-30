import type { RootState } from '@/src/shared/store/redux-store'
import { getStore } from './store-registry'

// On the server (SSR), return null; the caller handles it.
export const getReduxState = (): RootState | null => {
  if (typeof window === 'undefined') return null
  const store = getStore()
  return store ? (store.getState() as RootState) : null
}
