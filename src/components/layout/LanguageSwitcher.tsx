import { useTranslations } from '@/i18n/client-i18n';

export default function LanguageSwitcher() {
  const { translate, changeLanguage, currentLocale } = useTranslations('common');

  return (
    <div className="mb-4">
      <select
        value={currentLocale}
        onChange={(e) => changeLanguage(e.target.value)}
        className="p-2 border rounded-md bg-white text-gray-800"
      >
        <option value="vi">{translate('language_switcher.vi')}</option>
        <option value="en">{translate('language_switcher.en')}</option>
      </select>
    </div>
  );
}