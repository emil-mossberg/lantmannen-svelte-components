import { z } from 'zod'

export const localeCodeSchema = z.enum(['fi_FI', 'sv_SE'])

export type LocaleCode = z.infer<typeof localeCodeSchema>