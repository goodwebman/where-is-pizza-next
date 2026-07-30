import 'server-only';

import bcrypt from 'bcryptjs';

/**
 * bcryptjs rather than the native `bcrypt`: the native addon has to match the
 * Node ABI of the serverless runtime, and a pure-JS implementation removes an
 * entire class of deployment failure. Hash format is identical.
 *
 * Cost 10 is ~150-300ms in a Vercel function — comfortably inside the 10s Hobby
 * limit, and raising it further would start to matter on login latency.
 */
const COST = 10;

export const hashPassword = (plain: string): Promise<string> =>
  bcrypt.hash(plain, COST);

export const verifyPassword = (
  plain: string,
  hash: string,
): Promise<boolean> => bcrypt.compare(plain, hash);
