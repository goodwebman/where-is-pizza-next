
import { RootState } from '@/src/shared/store/redux-store'
import type { AuthState } from './types'

const selectAuth = (state: RootState): AuthState => state.auth

export const selectUser = (state: RootState) => {
  const auth = selectAuth(state)
  return auth.type === 'succeeded' ? auth.user : undefined
}

export const selectAuthStatus = (state: RootState) => {
  return selectAuth(state).type
}

export const selectAuthError = (state: RootState) => {
  const auth = selectAuth(state)
  return auth.type === 'failed' ? auth.error : undefined
}
