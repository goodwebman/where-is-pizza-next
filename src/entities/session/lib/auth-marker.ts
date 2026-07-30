export const AUTH_MARKER_COOKIE = 'wp_auth';

/**
 * A non-httpOnly hint that a session probably exists, so anonymous visitors do
 * not fire a session request on every page load.
 *
 * Never an authorisation decision — anyone can set this cookie. The server
 * checks the signed access token and nothing else.
 */
export const hasAuthMarker = (): boolean => {
  if (typeof document === 'undefined') return false;

  return document.cookie
    .split('; ')
    .some(entry => entry.startsWith(`${AUTH_MARKER_COOKIE}=1`));
};
