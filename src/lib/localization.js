import { init, addMessages } from "svelte-i18n";

import sv from "./locales/sv.json";
import fi from "./locales/fi.json";

addMessages("fi", fi);
addMessages("sv", sv);

export function setupI18n() {
  init({
    fallbackLocale: "fi",
    initialLocale: "fi",
  });
}

// import { addMessages, init } from 'svelte-i18n';

// const locale = import.meta.env.VITE_LOCALE || 'fi';

// export async function setupI18n() {
//   let messages;

//   if (locale === 'sv') {
//     messages = await import('./locales/sv.json');
//   } else if (locale === 'fi') {
//     messages = await import('./locales/fi.json');
//   } else {
//     throw new Error('Unsupported locale: ' + locale);
//   }

//   addMessages(locale, messages.default);
//   init({
//     fallbackLocale: locale,
//     initialLocale: locale,
//   });
// }