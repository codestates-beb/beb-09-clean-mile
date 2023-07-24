import React from 'react';
import Image from 'next/image';
import { logo } from '../Reference';

const Header = () => {
  return (
    <div className="w-full h-20 flex items-center justify-between px-10 border-b bg-white">
      <div className="w-1/12 flex items-center justify-center">
        <img src='/assets/images/clean_mile_logo_2.png' className='w-30' alt="logo" />
      </div>
      <div className="w-3/4 h-full flex justify-end items-center gap-20">
        <nav>
          <ul className="flex gap-14">
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
            duration-300">
              Login
          </button>
          <button className="
            bg-main-green 
            text-gray-500 
            hover:bg-green-600 
            hover:text-white 
            px-4 
            py-2 
            rounded-lg 
            transition 
            duration-300">
              Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
