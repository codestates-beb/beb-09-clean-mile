import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoCloseSharp } from 'react-icons/io5';
import { Nav } from '../Reference';

const Header = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full h-20 flex items-center justify-between px-10 sm:px-3 border-b bg-white md:gap-6 sm:gap-4 xs:gap-4 relative">
      <div className="w-[15%] md:w-[30%] sm:w-[80%] xs-[50%] h-full flex items-center justify-center overflow-hidden">
        <img src='/assets/images/clean_mile_logo_2.png' className='w-[60%] md:w-[90%] sm:w-[100%] xs:w-[100%]' alt="logo" />
      </div>
      <div className="w-3/4 md:w-full h-full flex justify-end items-center gap-20">
        <nav className='md:hidden sm:hidden xs:hidden'>
          <ul className=" flex gap-14">
            <li className='font-semibold cursor-pointer hover:text-green-600 transition duration-200'>Info</li>
            <li className='font-semibold cursor-pointer hover:text-green-600 transition duration-200'>Notice</li>
            <li className='font-semibold cursor-pointer hover:text-green-600 transition duration-200'>Events</li>
            <li className='font-semibold cursor-pointer hover:text-green-600 transition duration-200'>Community</li>
          </ul>
        </nav>
        <div className="flex gap-4">
          <button className="
            text-main-yellow 
            hover:text-black 
            hover:bg-main-yellow 
            px-4 
            py-2 
            rounded-lg 
            transition 
            duration-300
            sm:text-sm"
            onClick={() => router.push('/login')}>
            Login
          </button>
          <button className="
            bg-main-green 
            text-gray-500 
            hover:bg-green-600 
            hover:text-white 
            px-4 
            sm:px-2
            py-2 
            sm:py-1
            rounded-lg 
            transition 
            duration-300
            sm:text-sm
            ">
              Register
          </button>
        </div>
      </div>
      <div className="hidden xl:hidden lg:hidden md:block sm:block xs:block flex items-center">
        <button type="button" className="text-gray-500 hover:text-white focus:outline-none focus:text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <IoCloseSharp size={30} className="text-black" /> : <GiHamburgerMenu size={30} className="text-black" />}
        </button>
        {isOpen ? <Nav isOpen={isOpen} /> : null}
      </div>
    </div>
  );
};

export default Header;
