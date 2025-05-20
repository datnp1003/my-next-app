import { useTranslation } from 'next-i18next';
import type { TOptions } from 'i18next';

/**
 * Hook cung cấp các hàm dịch và chuyển đổi ngôn ngữ phía client
 * @param namespace Namespace của bản dịch (mặc định: 'common')
 * @returns Các hàm và thông tin liên quan đến bản dịch
 */
export function useTranslations(namespace: string = 'common') {
  const { t, i18n } = useTranslation(namespace);

  // Hàm dịch chuỗi
  const translate = (key: string, options?: TOptions) => {
    return t(key, options);
  };

  // Hàm chuyển đổi ngôn ngữ
  const changeLanguage = (locale: string) => i18n.changeLanguage(locale);

  // Ngôn ngữ hiện tại
  const currentLocale: string = i18n.language;

  return { translate, changeLanguage, currentLocale };
}