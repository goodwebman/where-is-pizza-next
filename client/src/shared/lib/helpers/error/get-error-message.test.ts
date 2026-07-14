import { describe, it, expect } from 'vitest';
import { getErrorMessage } from './get-error-message';

describe('getErrorMessage', () => {
  it('returns the message from a standard Error', () => {
    expect(getErrorMessage(new Error('bug'))).toBe('bug');
  });

  it('returns the message from an Axios-like error with response.data.message', () => {
    const axiosError = {
      response: { data: { message: 'Server error' } },
    };
    expect(getErrorMessage(axiosError)).toBe('Server error');
  });

  it('returns the message from an Axios-like error with response.data.error', () => {
    const axiosError = {
      response: { data: { error: 'Not found' } },
    };
    expect(getErrorMessage(axiosError)).toBe('Not found');
  });

  it('returns the message from an object with message field', () => {
    expect(getErrorMessage({ message: 'something broke' })).toBe('something broke');
  });

  it('returns fallback from a number', () => {
    expect(getErrorMessage(42)).toBe('Что-то пошло не так');
  });

  it('returns a string directly', () => {
    expect(getErrorMessage('ошибка')).toBe('ошибка');
  });

  it('returns fallback from null', () => {
    expect(getErrorMessage(null)).toBe('Что-то пошло не так');
  });
});
