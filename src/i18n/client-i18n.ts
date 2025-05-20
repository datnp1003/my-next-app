import { useTranslation } from 'next-i18next';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import type { TOptions } from 'i18next';

// Khởi tạo i18next
i18next
  .use(initReactI18next)
  .init({
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        common: require('./locales/en/common.json')
      },
      vi: {
        common: require('./locales/vi/common.json')
      }
    }
  });

// Custom hook để sử dụng i18n ở client side
export function useTranslations(namespace: string = 'common') {
  const { t, i18n } = useTranslation(namespace);
  
  return {
    translate: t,  // Hàm dịch text
    changeLanguage: i18n.changeLanguage,  // Đổi ngôn ngữ
    currentLocale: i18n.language  // Ngôn ngữ hiện tại
  };
}