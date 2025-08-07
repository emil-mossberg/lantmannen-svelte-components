export type Validator = (value: any) => string | null

// Validator rules

export const required =
  (message = 'This field is required'): Validator =>
  (value) =>
    value == null || value === '' ? message : null

export const qtyIncrements =
  (step: number, message?: string): Validator =>
  (value) =>
    value % step !== 0 ? (message ?? `Must be a multiple of ${step}`) : null

export const isInteger =
  (message = 'Must be an integer'): Validator =>
  (value) =>
    Number.isInteger(Number(value)) ? null : message

export const min =
  (minVal: number, message?: string): Validator =>
  (value) =>
    value < minVal ? (message ?? `Must be at least ${minVal}`) : null

export const combine =
  (...validators: Validator[]): Validator =>
  (value) => {
    for (const v of validators) {
      const result = v(value)
      if (result) return result
    }
    return null
  }
