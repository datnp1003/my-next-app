import { defaultLang, defaultNS, languages } from './constant';

export function getOptions(
  lng: string = defaultLang,
  ns: string | string[] = defaultNS
) {
  const nsArray = Array.isArray(ns) ? ns : [ns];
  return {
    // i18next core options
    fallbackLng: defaultLang,
    supportedLngs: languages,
    lng,
    ns: nsArray,
    defaultNS,
    interpolation: {
      escapeValue: false, // React tự lo XSS
    },
  };
}
