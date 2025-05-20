import { useTranslations } from '@/i18n/client-i18n';
import Image from 'next/image';

export default function LanguageSwitcher() {
  const { changeLanguage, currentLocale } = useTranslations('common');

  const toggleLanguage = () => {
    const newLocale = currentLocale === 'vi' ? 'en' : 'vi';
    changeLanguage(newLocale);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden hover:opacity-80 transition-opacity"
    >
      <Image
        src={`/img/flags/${currentLocale}.png`}
        alt={currentLocale === 'vi' ? 'Tiếng Việt' : 'English'}
        width={25}
        height={25}
      />
    </button>
  );
}