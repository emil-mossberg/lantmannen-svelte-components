import { init, register, waitLocale } from 'svelte-i18n'
import svelteBridgeSvelte from '@lib/stores/MagentoSvelteBridge.svelte'

register('sv_SE', () => import('./locales/sv.json'))
register('fi_FI', () => import('./locales/fi.json'))

export async function setupI18n(locale: string) {

  init({
    fallbackLocale: svelteBridgeSvelte.locale ?? 'fi_FI',
    initialLocale: svelteBridgeSvelte.locale, // This is not working so only using above
  })

  await waitLocale()
}
