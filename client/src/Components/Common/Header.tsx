import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import { AxiosError } from 'axios';
import { GiHamburgerMenu, GiToken } from 'react-icons/gi';
import { IoCloseSharp } from 'react-icons/io5';
import { BiSolidDownArrow, BiSolidUser } from 'react-icons/bi';
import { IoMdCreate } from 'react-icons/io';
import { FiLogOut } from 'react-icons/fi';
import { useMutation, useQueryClient, dehydrate } from 'react-query';
import { Nav, NewNotice, insta_icon } from '../Reference';
import { UserInfo } from '../Interfaces';
import { ApiCaller } from '../Utils/ApiCaller';

const Header = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isMenu, setIsMenu] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [arrowRotation, setArrowRotation] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfoDetail, setUserInfoDetail] = useState<UserInfo | null>(null);

  /**
   * 특정 URI로 이동하는 함수
   * @param route 이동할 URI
   */
  const navigateTo = (route: string) => {
    router.push(route);
  }

  /**
   * 메뉴 열기/닫기 상태를 토글하고, 화살표의 회전 값을 조절하는 함수
   * 메뉴의 열림 상태(`isMenuOpen`)를 반전시키고, 화살표의 회전 값(`arrowRotation`)을 180도 증가시킴
   */
  const menuToggle = () => {
    setUserMenuOpen(!isUserMenuOpen);
    setArrowRotation(arrowRotation + 180);
  }

  const logout = async () => {

    Swal.fire({
      title: '로그아웃 하시겠습니까?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#6BCB77',
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#FF6B6B'
    }).then(async (result) => {
      if (result.isConfirmed) {

        try {
          const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/logout`;
          const dataBody = null;
          const headers = {
            'Content-Type': 'application/form-data',
            'Accept': 'application/json',
          }
          const isJSON = false;
          const isCookie = true;

          const res = await ApiCaller.post(URL, dataBody, isJSON, headers, isCookie);
          if (res.status === 200) {
            Swal.fire({
              title: 'Success!',
              text: res.data.message,
              icon: 'success',
              confirmButtonText: 'OK',
              confirmButtonColor: '#6BCB77',
            }).then(() => {
              Swal.close();
              router.reload();

              if (typeof window !== "undefined") {
                localStorage.removeItem('user');
              }
              queryClient.removeQueries('user');
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: res.data.message,
              icon: 'error',
              confirmButtonText: 'OK',
              confirmButtonColor: '#6BCB77'
            }).then(() => {
              Swal.close();
            });
          }
          return res.data.data
        } catch (error) {
          const err = error as AxiosError;

          const data = err.response?.data as { message: string };

          Swal.fire({
            title: 'Error',
            text: data?.message,
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#6BCB77'
          }).then(() => {
            Swal.close();
          });

          throw err;
        }
      } else if (result.isDismissed) {
        Swal.fire({
          title: 'Success!',
          text: '로그아웃을 취소하셨습니다.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#6BCB77',
        })
      }
    });
  }

  const userInfo = async () => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/userInfo`;
      const dataBody = null;
      const isJSON = false;
      const headers = {};
      const isCookie = true;

      const res = await ApiCaller.get(URL, dataBody, isJSON, headers, isCookie);
      return res.data.data
    } catch (error) {
      const err = error as AxiosError;

      const data = err.response?.data as { message: string };

      console.log('User Info Error: ', data?.mesage);
      throw err;
    }
  }

  /**
   * loginMutation 함수는 useMutation hook을 사용하여 loginAPI를 호출하고, 요청의 결과에 따라 적절한 동작을 수행
   * 
   * @returns {UseMutationResult} 리액트 쿼리의 useMutation hook으로부터 반환되는 결과 객체
   */
  const loginMutation = useMutation(userInfo, {
    onSuccess: (data: UserInfo) => {
      queryClient.invalidateQueries('user');
      queryClient.setQueryData('user', data);

      const dehydratedState = dehydrate(queryClient);
      localStorage.setItem('user', JSON.stringify(dehydratedState));

      // Move userInfoDetail setting logic here
      setIsLoggedIn(true);
      setUserInfoDetail(data);
    },
    onError: (error) => {
      console.log('Mutation Error: ', error);
    }
  });

  useEffect(() => {
    loginMutation.mutate();
  }, []);

  console.log(userInfoDetail);
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
                ${router.pathname === '/posts/general' || router.pathname === '/posts/review' ? 'text-green-600' : null}`}
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
            {isLoggedIn ? (
              <div className='flex items-center gap-3'>
                <Image src={insta_icon} width={50} height={100} alt='user profile image' />
                <p>{userInfoDetail?.user.nickname}</p>
                <div className='relative cursor-pointer' style={{ transform: `rotate(${arrowRotation}deg)`, transition: 'transform 0.4s' }}>
                  <BiSolidDownArrow onClick={menuToggle} />
                </div>
                {isUserMenuOpen &&
                  <div className="
                    absolute 
                    top-16 
                    right-14 
                    overflow-hidden 
                    bg-white 
                    text-black 
                    rounded 
                    shadow-md"
                  >
                    <ul className="text-center">
                      <li className="
                        flex 
                        justify-center 
                        items-center 
                        gap-2
                        border-b 
                        p-4 
                        hover:bg-gray-300 
                        transition 
                        duration-300 
                        cursor-pointer">
                        <GiToken size={20} />
                        50 CM
                      </li>
                      <Link href={{ pathname: '/users/mypage', query: { nickname: userInfoDetail.user.nickname } }}>
                        <li className="
                          flex 
                          justify-center 
                          items-center 
                          gap-2
                          border-b 
                          p-4 
                          hover:bg-gray-300 
                          transition 
                          duration-300 
                          cursor-pointer">
                          <BiSolidUser size={20} />
                          Profile
                        </li>
                      </Link>
                      <Link href='/posts/create'>
                        <li className="
                          flex 
                          justify-center 
                          items-center 
                          gap-2
                          border-b 
                          p-4 
                          hover:bg-gray-300 
                          transition 
                          duration-300 
                          cursor-pointer">
                          <IoMdCreate size={20} />
                          Write
                        </li>
                      </Link>
                      <li className="
                        flex 
                        justify-center 
                        items-center 
                        gap-2
                        p-4 
                        hover:bg-gray-300 
                        transition 
                        duration-300 
                        cursor-pointer"
                        onClick={logout}>
                        <FiLogOut size={20} />
                        Logout
                      </li>
                    </ul>
                  </div>
                }
              </div>
            ) : (
              <>
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
              </>
            )}
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
