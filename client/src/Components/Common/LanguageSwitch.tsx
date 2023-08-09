import React from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';

const LanguageSwitch = () => {
  const { locale, asPath, push } = useRouter();
  const { t } = useTranslation('common');

  const switchToEnglish = () => push(asPath, asPath, { locale: 'en' });
  const switchToKorean = () => push(asPath, asPath, { locale: 'ko' });

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