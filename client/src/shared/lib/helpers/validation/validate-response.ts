import type { z } from 'zod';

/** Wraps an API response with optional zod validation. */
export function validateResponse<T>(data: T, schema?: z.ZodType<T>): T {
  if (!schema) return data;

  const result = schema.safeParse(data);

  if (!result.success) {
    console.error(
      '[validateResponse] API response validation failed:',
      result.error.issues,
    );
    // In dev, throw to surface the mismatch early.
    // In prod, return the raw data — better a type error than a blank page.
    if (process.env.NODE_ENV === 'development') {
      throw new Error(
        `API response validation failed: ${result.error.issues
          .map(i => `${i.path.join('.')}: ${i.message}`)
          .join(', ')}`,
      );
    }
  }

  return (result.success ? result.data : data) as T;
}
