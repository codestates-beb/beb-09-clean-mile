import React, { useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { LanguageSwitch } from '../Reference';

type NavProps = {
  isOpen: boolean;
}

const Nav: React.FC<NavProps> = ({ isOpen }) => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const [isMenu, setIsMenu] = useState(false);

  const navigateTo = (route: string) => {
    router.push(route);
  }

  return (
    <div className='min-h-screen fixed top-20 right-0 bottom-0 w-[30%] sm:w-[40%] xs:w-[50%] overflow-y-auto'>
      <nav className={`transition-all duration-500 ease-in-out bg-white w-full  h-full transform ${isOpen ? '-translate-x-0' : 'translate-x-full'}`}>
        <ul className="flex flex-col justify-center items-center py-8">
          <li className="hover:bg-green-600 hover:text-white font-bold text-lg w-full flex items-center justify-center h-16 transition-all duration-200 cursor-pointer"
            onClick={() => navigateTo('/')}>{t('common:Info')}</li>
          <li className="hover:bg-green-600 hover:text-white font-bold text-lg w-full flex items-center justify-center h-16 transition-all duration-200 cursor-pointer"
            onClick={() => navigateTo('/notice')}>{t('common:Notice')}</li>
          <li className="hover:bg-green-600 hover:text-white font-bold text-lg w-full flex items-center justify-center h-16 transition-all duration-200 cursor-pointer"
            onClick={() => navigateTo('/posts/events')}>{t('common:Events')}</li>
          <li className="hover:bg-green-600 hover:text-white font-bold text-lg w-full flex items-center justify-center h-16 transition-all duration-200 cursor-pointer"
            onClick={() => setIsMenu(!isMenu)}>
            {t('common:Community')}
          </li>
          {isMenu && (
            <ul className="w-full bg-white flex flex-col justify-center items-center">
              <li className='w-full text-center list-none cursor-pointer px-5 py-3 font-semibold hover:bg-green-600 hover:text-white'
                onClick={() => router.push('/posts/general')}>
                {t('common:General')}
              </li>
              <li className='w-full text-center list-none cursor-pointer px-5 py-3 font-semibold hover:bg-green-600 hover:text-white'
                onClick={() => router.push('/posts/review')}>
                {t('common:Review')}
              </li>
            </ul>
          )}
        </ul>
        <LanguageSwitch />
      </nav>
    </div>
  );
};

export default Nav;
