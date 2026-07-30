import { NextRequest } from 'next/server';

const ORIGIN = 'http://localhost:3000';

export type CallOptions = {
  url: string;
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  cookies?: Record<string, string>;
  params?: Record<string, string>;
  /** Omit the Origin header, or send a foreign one, to exercise the CSRF guard. */
  origin?: string | null;
};

export type CallResult<T> = {
  status: number;
  json: T;
  /** Parsed Set-Cookie headers: name → value (empty string means "cleared"). */
  setCookies: Record<string, string>;
  cookieAttributes: Record<string, string>;
};

const parseSetCookies = (response: Response) => {
  const values: Record<string, string> = {};
  const attributes: Record<string, string> = {};

  for (const header of response.headers.getSetCookie()) {
    const [pair, ...rest] = header.split('; ');
    const separator = pair.indexOf('=');
    const name = pair.slice(0, separator);

    values[name] = decodeURIComponent(pair.slice(separator + 1));
    attributes[name] = rest.join('; ');
  }

  return { values, attributes };
};

/**
 * `Promise<never>` for the params makes this assignable from a handler expecting
 * any concrete param shape (parameters are checked contravariantly), so callers
 * do not have to restate the route's param type on every call.
 */
type Handler = (
  request: NextRequest,
  context: { params: Promise<never> },
) => Promise<Response>;

/**
 * Invokes a route handler the way Next does, without starting a server.
 *
 * Two details that are easy to get wrong: `params` is a promise in Next 15+,
 * and handlers read cookies off the request rather than `next/headers` — which
 * is why none of this needs module mocking.
 */
export const callRoute = async <T = unknown>(
  handler: Handler,
  options: CallOptions,
): Promise<CallResult<T>> => {
  const { url, method = 'GET', body, cookies = {}, params = {} } = options;

  const headers = new Headers({ 'content-type': 'application/json' });

  const origin = options.origin === undefined ? ORIGIN : options.origin;
  if (origin) headers.set('origin', origin);

  const cookieHeader = Object.entries(cookies)
    .map(([name, value]) => `${name}=${encodeURIComponent(value)}`)
    .join('; ');

  if (cookieHeader) headers.set('cookie', cookieHeader);

  const request = new NextRequest(new URL(url, ORIGIN), {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const response = await handler(request, {
    // Route params arrive as a plain string map; the handler's own generic says
    // which keys it expects, and a test supplying the wrong ones is a test bug.
    params: Promise.resolve(params) as Promise<never>,
  });

  const { values, attributes } = parseSetCookies(response);

  const text = await response.text();

  return {
    status: response.status,
    json: (text ? JSON.parse(text) : null) as T,
    setCookies: values,
    cookieAttributes: attributes,
  };
};
