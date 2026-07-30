import 'server-only';

import { NextResponse, type NextRequest } from 'next/server';
import { ZodError } from 'zod';

import { AppError } from './errors';
import { assertSameOrigin } from './origin-guard';

type RouteContext<TParams> = { params: Promise<TParams> };

type Handler<TParams> = (
  request: NextRequest,
  context: RouteContext<TParams>,
) => Promise<Response>;

/**
 * Error body shape is `{ error: string }` and deliberately stays a string:
 * `getErrorMessage` on the client reads `data.message ?? data.error` straight
 * into toasts, so an object here would surface as "[object Object]".
 * `code` is additive and only consumed by tests.
 */
const errorResponse = (status: number, error: string, code?: string) =>
  NextResponse.json(code ? { error, code } : { error }, { status });

const firstZodMessage = (error: ZodError): string => {
  const issue = error.issues[0];
  if (!issue) return 'Invalid request';

  const path = issue.path.join('.');
  return path ? `${path}: ${issue.message}` : issue.message;
};

/**
 * Wraps a route handler with origin checking and error translation, so handlers
 * can throw domain errors and let zod schemas throw on bad input instead of
 * threading status codes through every branch.
 */
export const withRoute =
  <TParams = Record<string, never>>(handler: Handler<TParams>) =>
  async (
    request: NextRequest,
    context: RouteContext<TParams>,
  ): Promise<Response> => {
    try {
      assertSameOrigin(request);
      return await handler(request, context);
    } catch (error) {
      if (error instanceof ZodError) {
        return errorResponse(400, firstZodMessage(error), 'VALIDATION_FAILED');
      }

      if (error instanceof AppError) {
        return errorResponse(error.status, error.message, error.code);
      }

      // Unexpected: log the real cause, tell the client nothing.
      console.error(`[${request.method} ${request.nextUrl.pathname}]`, error);
      return errorResponse(500, 'Server error', 'INTERNAL_ERROR');
    }
  };

/** Parses a JSON body, turning a malformed one into a 400 rather than a 500. */
export const readJson = async (request: NextRequest): Promise<unknown> => {
  try {
    return await request.json();
  } catch {
    throw new AppError(400, 'Invalid JSON body', 'INVALID_JSON');
  }
};
