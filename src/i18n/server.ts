import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { getOptions } from './settings';
import { cookies, headers } from 'next/headers';
import { cookieLangName } from '../cookie';
import { defaultLang} from './constant'
const isServerRuntime = typeof window === 'undefined';
const translationCache = new Map<string, any>();
const initI18next = async (
  lng: string,
  ns: string | string[]
): Promise<any> => {
  const namespaceKey = Array.isArray(ns) ? ns.join(',') : ns;
  const cacheKey = `${lng}-${namespaceKey}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }
  const i18nInstance = createInstance();
  const namespaceForOptions = Array.isArray(ns) ? ns[0] : ns;
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: any, namespace: any) =>
          import(`./locales/${language}/${namespace}.json`)
      )
    )
    .init(getOptions(lng, namespaceForOptions)); 
  translationCache.set(cacheKey, i18nInstance);
  return i18nInstance;
};
export const detectLanguage = async (): Promise<string> => {
  if (!isServerRuntime) {
    const cookieLang = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${cookieLangName}=`))
      ?.split('=')[1];   
    return cookieLang || defaultLang; 
  }
  try {
    const ckies = await cookies();
    const hders = await headers();
    const nextUrlHeader = hders.get('next-url');
    if (nextUrlHeader && nextUrlHeader.includes(`"lng":"`)) {
      const qsObj = JSON.parse(
        nextUrlHeader.substring(
          nextUrlHeader.indexOf('{'),
          nextUrlHeader.indexOf(`}`) + 1
        )
      );
      return qsObj.lng || defaultLang; 
    }
    
    if (ckies.has(cookieLangName)) {
      return ckies.get(cookieLangName)?.value || defaultLang;
    }
  } catch (error) {
    console.error('Error detecting language on the server:', error);
  }
  return defaultLang; 
};
export const GetTranslation = async (
  ns: string | string[],
  options: { keyPrefix?: string } = {}
): Promise<{ t: any; i18n: any }> => {
  const lng = await detectLanguage();
  const i18nextInstance = await initI18next(lng, ns);
  const namespace = Array.isArray(ns) ? ns[0] : ns;
  return {
    t: i18nextInstance.getFixedT(lng, namespace, options.keyPrefix),
    i18n: i18nextInstance,
  };
};
