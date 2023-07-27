import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoCloseSharp } from 'react-icons/io5';
import { Nav, NewNotice } from '../Reference';

const Header = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMenu, setIsMenu] = useState(false);

  /**
   * 특정 URI로 이동하는 함수
   * @param route 이동할 URI
   */
  const navigateTo = (route: string) => {
    router.push(route);
  }

  return (
    <>
      <div className="w-full mx-auto sm:overflow-hidden h-20 flex items-center justify-between px-10 sm:px-3 xs:px-3 border-b bg-white md:gap-6 sm:gap-4 xs:gap-4 sticky top-0 z-50">
        <div className="w-[15%] md:w-[30%] sm:w-full xs:w-[50%] h-full flex items-center sm:justify-start overflow-hidden">
          <img src='/assets/images/clean_mile_logo_2.png' className='w-[50%] lg:w-[90%] md:w-[90%] sm:w-[80%] xs:w-[100%] cursor-pointer' alt="logo" onClick={() => navigateTo('/')} />
        </div>
        <div className="w-3/4 md:w-full sm:w-fullh-full flex justify-end items-center gap-20">
          <nav className='flex justify-center items-center md:hidden sm:hidden xs:hidden relative'>
            <ul className="flex justify-center items-center gap-14">
              <li className={
                `flex 
                justify-center 
                items-center 
                font-semibold 
                cursor-pointer 
                hover:text-green-600 
                transition 
                duration-200 
                ${router.pathname === '/' ? 'text-green-600' : null}`}
                >
                <Link href='/'>
                  Info
                </Link>
              </li>
              <li className={
                `flex 
                justify-center 
                items-center 
                font-semibold 
                cursor-pointer 
                hover:text-green-600 
                transition 
                duration-200 
                ${router.pathname === '/notice' ? 'text-green-600' : null}`}
                >
                <Link href='/notice'>
                  Notice
                </Link>  
              </li>
              <li className={
                `flex 
                justify-center 
                items-center 
                font-semibold 
                cursor-pointer 
                hover:text-green-600 
                transition 
                duration-200 
                ${router.pathname === '/posts/events' ? 'text-green-600' : null}`}
                >
                <Link href='/posts/events'>
                  Events  
                </Link>
              </li>
              <li className={
                `flex 
                justify-center 
                items-center 
                font-semibold 
                cursor-pointer 
                hover:text-green-600 
                transition 
                duration-200 
                ${router.pathname === '/posts/general' || router.pathname === '/posts/review'  ? 'text-green-600' : null}`}
                onClick={() => setIsMenu(!isMenu)}>
                Community
              </li>
              {isMenu && (
                <ul className="w-[30%] bg-white flex flex-col justify-center items-center border rounded-xl absolute z-50"
                style={{ top: '150%', right: -15 }}>
                  <li className='w-full text-center list-none cursor-pointer px-5 py-3 font-semibold hover:bg-green-600 hover:text-white hover:rounded-xl'>
                    <Link href='/posts/general'>
                      General
                    </Link>
                  </li>
                  <li className='w-full text-center list-none cursor-pointer px-5 py-3 font-semibold hover:bg-green-600 hover:text-white hover:rounded-xl'>
                    <Link href='/posts/review'>
                      Review
                    </Link>
                  </li>
                </ul>
              )}
            </ul>
          </nav>
          <div className="flex gap-5">
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
              "
              onClick={() => router.push('/signup')}>
                Register
            </button>
            <div className="hidden xl:hidden lg:hidden md:block sm:block xs:block flex items-center relative">
              <button type="button" className="text-gray-500 hover:text-white focus:outline-none focus:text-white" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <IoCloseSharp size={30} className="text-black" /> : <GiHamburgerMenu size={30} className="text-black" />}
              </button>
              {isOpen ? <Nav isOpen={isOpen} /> : null}
            </div>
          </div>
        </div>
      </div>
      {router.pathname !== '/' && router.pathname !== '/user/mypage' && <NewNotice />}
    </>
  );
};

export default Header;
