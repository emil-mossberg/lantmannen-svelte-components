import { ZodType, type ZodTypeDef } from 'zod';

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}


export function validateWithSchema<T>(
  schema: ZodType<T, ZodTypeDef, unknown>,
  value: unknown,
  fallback?: T
): T {
  const result = schema.safeParse(value);
  if (result.success) {
    return result.data;
  }
  if (fallback !== undefined) {
    return fallback;
  }
  throw new Error('Validation failed');
}