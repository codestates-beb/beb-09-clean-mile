import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoCloseSharp } from 'react-icons/io5';

type NavProps = {
  isOpen: boolean;
}

const Nav: React.FC<NavProps> = ({ isOpen }) => {
  const router = useRouter();

  const navigateTo = (route: string) => {
    router.push(route);
  }

  return (
    <>
      <nav className={`absolute top-20 right-0 bottom-0 z-10 transition-all duration-500 ease-in-out bg-white w-[30%] sm:w-[40%] min-h-screen transform ${isOpen ? '-translate-x-0' : 'translate-x-full'}`}>
        <ul className="flex flex-col justify-center items-center py-8">
          <li className="hover:bg-green-600 hover:text-white font-bold text-lg w-full flex items-center justify-center h-16 transition-all duration-200 cursor-pointer"
            onClick={() => navigateTo('/info')}>Info</li>
          <li className="hover:bg-green-600 hover:text-white font-bold text-lg w-full flex items-center justify-center h-16 transition-all duration-200 cursor-pointer"
            onClick={() => navigateTo('/notice')}>Notice</li>
          <li className="hover:bg-green-600 hover:text-white font-bold text-lg w-full flex items-center justify-center h-16 transition-all duration-200 cursor-pointer"
            onClick={() => navigateTo('/events')}>Events</li>
          <li className="hover:bg-green-600 hover:text-white font-bold text-lg w-full flex items-center justify-center h-16 transition-all duration-200 cursor-pointer"
            onClick={() => navigateTo('/community')}>Community</li>
        </ul>
      </nav>
    </>
  );
};

export default Nav;
