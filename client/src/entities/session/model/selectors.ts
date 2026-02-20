import { RootState } from '@/src/shared/store/redux-store';

export const selectSession = (s: RootState) => s.session;

export const selectUser = (s: RootState) =>
  s.session.type === 'authorized' ? s.session.session.user : undefined;

export const selectToken = (s: RootState) =>
  s.session.type === 'authorized' ? s.session.session.token : undefined;

export const selectIsAuthorized = (s: RootState) =>
  s.session.type === 'authorized';

export const selectAuthStatus = (s: RootState) => s.session.type;

export const selectAuthError = (s: RootState) =>
  s.session.type === 'failed' ? s.session.error : undefined;
