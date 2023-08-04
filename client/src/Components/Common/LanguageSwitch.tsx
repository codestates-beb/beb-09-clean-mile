import React from 'react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';

const LanguageSwitch = () => {
  const { locale, push } = useRouter();
  const { t } = useTranslation('common');

  const switchToEnglish = () => push('/', '/', { locale: 'en' });
  const switchToKorean = () => push('/', '/', { locale: 'ko' });

  return (
    <div className='flex gap-2 items-center justify-center'>
      <button className={`${locale === 'en' ? 'font-bold' : 'font-normal'}`} onClick={switchToEnglish}>
        {t('EN')}
      </button>
      |
      <button className={`${locale === 'ko' ? 'font-bold' : 'font-normal'}`} onClick={switchToKorean}>
        {t('KO')}
      </button>
    </div>
  )
}

export default LanguageSwitch;