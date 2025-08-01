import { ZodType, type ZodTypeDef } from 'zod'

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export function validateWithSchema<T>(
    schema: ZodType<T, ZodTypeDef, unknown>,
    value: unknown,
    fallback?: T
): T {
    const result = schema.safeParse(value)
    if (result.success) {
        return result.data
    }
    if (fallback !== undefined) {
        return fallback
    }
    throw new Error('Validation failed')
}

export const toUtcDateString = (timestamp: number) => {
    const date = new Date(timestamp)
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(date.getUTCDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export const toUtcMidnightTimestamp = (dateStr: string) => {
    const [yearStr, monthStr, dayStr] = dateStr.split('-')
    return Date.UTC(parseInt(yearStr), parseInt(monthStr) - 1, parseInt(dayStr))
}



const kebabToCamel = (str: string) =>
    str.replace(/-([a-z])/g, (_, char) => char.toUpperCase())

export const extractDataAttributes = (el: Element, keys: string[]) =>
  Object.fromEntries(
    keys.map((key) => {
      const attrValue = el.getAttribute(`data-${key}`)
      
      const camelKey = kebabToCamel(key)

      return [camelKey, attrValue === null || attrValue === '' ? null : attrValue]
    })
  )