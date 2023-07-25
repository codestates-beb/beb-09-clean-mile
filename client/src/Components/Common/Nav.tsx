import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoCloseSharp } from 'react-icons/io5';

type NavProps = {
  isOpen: boolean;
}

const Nav: React.FC<NavProps> = ({ isOpen }) => {
  const router = useRouter();
  const [isMenu, setIsMenu] = useState(false);

  const navigateTo = (route: string) => {
    router.push(route);
  }

  return (
    <div className='min-h-screen fixed top-20 right-0 bottom-0 z-10 w-[30%] sm:w-[40%] xs:w-[50%] overflow-y-auto'>
      <nav className={`transition-all duration-500 ease-in-out bg-white w-full  h-full transform ${isOpen ? '-translate-x-0' : 'translate-x-full'}`}>
        <ul className="flex flex-col justify-center items-center py-8">
          <li className="hover:bg-green-600 hover:text-white font-bold text-lg w-full flex items-center justify-center h-16 transition-all duration-200 cursor-pointer"
            onClick={() => navigateTo('/')}>Info</li>
          <li className="hover:bg-green-600 hover:text-white font-bold text-lg w-full flex items-center justify-center h-16 transition-all duration-200 cursor-pointer"
            onClick={() => navigateTo('/notice')}>Notice</li>
          <li className="hover:bg-green-600 hover:text-white font-bold text-lg w-full flex items-center justify-center h-16 transition-all duration-200 cursor-pointer"
            onClick={() => navigateTo('/events')}>Events</li>
          <li className="hover:bg-green-600 hover:text-white font-bold text-lg w-full flex items-center justify-center h-16 transition-all duration-200 cursor-pointer"
            onClick={() => setIsMenu(!isMenu)}>
            Community
          </li>
          {isMenu && (
            <ul className="w-full bg-white flex flex-col justify-center items-center">
              <li className='w-full text-center list-none cursor-pointer px-5 py-3 font-semibold hover:bg-green-600 hover:text-white'
                onClick={() => router.push('/general')}>
                General
              </li>
              <li className='w-full text-center list-none cursor-pointer px-5 py-3 font-semibold hover:bg-green-600 hover:text-white'
                onClick={() => router.push('/review')}>
                Review
              </li>
            </ul>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Nav;
