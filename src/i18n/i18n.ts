import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

/**
 * Hàm lấy bản dịch phía server cho một ngôn ngữ và các namespace cụ thể
 * @param locale Ngôn ngữ (ví dụ: 'vi', 'en')
 * @param namespaces Các namespace cần tải (mặc định: ['common'])
 * @returns Props chứa bản dịch
 */
export async function getServerTranslations(locale: string, namespaces: string[] = ['common']) {
  return serverSideTranslations(locale, namespaces);
}