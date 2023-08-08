import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Swal from 'sweetalert2';
import useTranslation from 'next-translate/useTranslation';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import { GiHamburgerMenu, GiToken } from 'react-icons/gi';
import { IoCloseSharp } from 'react-icons/io5';
import { BiSolidDownArrow, BiSolidUser } from 'react-icons/bi';
import { IoMdCreate } from 'react-icons/io';
import { FiLogOut } from 'react-icons/fi';
import { useMutation, useQueryClient, dehydrate } from 'react-query';
import { Nav, NewNotice, hero_img, LanguageSwitch } from '../Reference';
import { User, UserInfo, Post, Dnft } from '../Interfaces';
import { showSuccessAlert, showErrorAlert } from '@/Redux/actions';
import { useUserSession } from '@/hooks/useUserSession';
import { getUserInfo, userLogout, getLatestNotice } from '@/services/api';


const Header = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { t } = useTranslation('common');
  const userData = useUserSession();

  const [isOpen, setIsOpen] = useState(false);
  const [isMenu, setIsMenu] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [userInfoData, setUserInfoData] = useState<User | null>(null);
  const [dnftData, setDnftData] = useState<Dnft | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [latestNotice, setLatestNotice] = useState<Post | null>(null);

  useEffect(() => {
    setIsLoggedIn(Boolean(sessionStorage.getItem('user')));
  }, []);


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
    setUserMenuOpen(prevState => !prevState);
  }

  /**
   * loginMutation 함수는 useMutation hook을 사용하여 loginAPI를 호출하고, 요청의 결과에 따라 적절한 동작을 수행
   * 
   * @returns {UseMutationResult} 리액트 쿼리의 useMutation hook으로부터 반환되는 결과 객체
   */
  const loginMutation = useMutation(getUserInfo, {
    onSuccess: (data: UserInfo) => {
      queryClient.invalidateQueries('user_info');
      queryClient.setQueryData('user_info', data);

      const dehydratedState = dehydrate(queryClient);

      // Copying the dehydrated state
      let userInfoCache = { ...dehydratedState };

      // Keeping only 'user_info' cache
      userInfoCache.queries = dehydratedState.queries.filter((query) => query.queryKey === 'user_info');

      sessionStorage.setItem('user_info', JSON.stringify(userInfoCache));
    },
    onError: (error) => {
      console.log('Mutation Error: ', error);
    }
  });

  useEffect(() => {
    if (isLoggedIn) {
      loginMutation.mutate();
    }
  }, [isLoggedIn]);


  const confirmLogout = () => {
    return Swal.fire({
      title: t('common:Do you want to log out'),
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: t('common:OK'),
      confirmButtonColor: '#6BCB77',
      cancelButtonText: t('common:Cancel'),
      cancelButtonColor: '#FF6B6B'
    });
  }

  const performLogout = async () => {
    const res = await userLogout();

    if (res.status === 200) {
      dispatch(showSuccessAlert(res.data.message));
      router.replace('/');
      clearSession();
    } else {
      dispatch(showErrorAlert(res.data.message));
    }

    return res.data.data;
  }

  const clearSession = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('user_info');
    }
    queryClient.removeQueries('user');
    queryClient.removeQueries('user_info');
  }

  const logout = async () => {
    const result = await confirmLogout();

    if (result.isConfirmed) {
      try {
        await performLogout();
      } catch (error) {
        const err = error as AxiosError;
        const data = err.response?.data as { message: string };
        dispatch(showErrorAlert(data?.message));
      }
    } else if (result.isDismissed) {
      dispatch(showSuccessAlert(t('common:You have cancelled your logout')));
    }
  }

  useEffect(() => {
    const fetchLatestNotice = async () => {
      try {
        const notice = await getLatestNotice();
        setLatestNotice(notice.data.data);
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.data) {
          console.log('New Notice Error: ', axiosError.response.data?.message);
        } 
      }
    }
    fetchLatestNotice();
  }, []);
  return (
    <>
      <div className="w-full mx-auto h-20 flex items-center justify-between px-10 sm:px-3 xs:px-3 border-b bg-white md:gap-6 sm:gap-4 xs:gap-4 sticky top-0 z-50">
        <div className="w-[15%] md:w-[30%] sm:w-full xs:w-[50%] h-full flex items-center sm:justify-start overflow-hidden">
          <img src='/assets/images/clean_mile_logo_2.png' className='w-[50%] lg:w-[90%] md:w-[90%] sm:w-[80%] xs:w-[100%] cursor-pointer' alt="logo" onClick={() => navigateTo('/')} />
        </div>
        <div className="w-3/4 md:w-full sm:w-full h-full flex justify-end items-center gap-10">
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
                  {t('common:Info')}
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
                  {t('common:Notice')}
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
                  {t('common:Events')}
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
                {t('common:Community')}
              </li>
              {isMenu && (
                <ul className="w-[30%] bg-white flex flex-col justify-center items-center border rounded-xl absolute z-50"
                  style={{ top: '150%', right: 80 }}>
                  <li className='w-full text-center list-none cursor-pointer px-5 py-3 font-semibold hover:bg-green-600 hover:text-white hover:rounded-xl'>
                    <Link href='/posts/general'>
                      {t('common:General')}
                    </Link>
                  </li>
                  <li className='w-full text-center list-none cursor-pointer px-5 py-3 font-semibold hover:bg-green-600 hover:text-white hover:rounded-xl'>
                    <Link href='/posts/review'>
                      {t('common:Review')}
                    </Link>
                  </li>
                </ul>
              )}
              <LanguageSwitch />
            </ul>
          </nav>
          <div className="flex gap-5">
            {isLoggedIn ? (
              <div className='flex items-center gap-3'>
                <div className='w-[3rem] 
                  lg:w-[2rem] 
                  md:w-[2rem] 
                  sm:w-[2rem] 
                  xs:w-[2rem] 
                  h-[3rem] 
                  lg:h-[2rem] 
                  md:h-[2rem] 
                  sm:h-[2rem] 
                  xs:h-[2rem] 
                  border-2 
                  border-gray-200 
                  rounded-full 
                  relative 
                  overflow-hidden'>
                  {userData.dnftData && userData.dnftData.image_url ? (
                    <Image src={userData.dnftData.image_url} layout='fill' className='object-cover' alt='user profile image' />
                  ) : (
                    <Image src={hero_img} layout='fill' className='object-cover' alt='default profile image' />
                  )}
                </div>
                <p onClick={menuToggle}>{userData?.user.nickname}</p>
                <div className='relative cursor-pointer'>
                  <BiSolidDownArrow className={`transform ${isUserMenuOpen ? 'rotate-180' : ''} transition-transform duration-400`} onClick={menuToggle} />
                </div>
                {isUserMenuOpen &&
                  <div className="
                    absolute 
                    top-16 
                    right-14 
                    bg-white 
                    text-black 
                    rounded 
                    shadow-md
                    z-50">
                    <ul className="text-center">
                      <li className="
                        flex 
                        justify-center 
                        items-center 
                        gap-2
                        border-b 
                        p-4 
                        md:p-2
                        sm:p-2
                        xs:p-2
                        hover:bg-gray-300 
                        transition 
                        duration-300">
                        <GiToken size={20} />
                        {userInfoData?.wallet.token_amount} CM
                      </li>
                      <Link href='/users/mypage'>
                        <li className="
                          flex 
                          justify-center 
                          items-center 
                          gap-2
                          border-b 
                          p-4 
                          md:p-2
                          sm:p-2
                          xs:p-2
                          hover:bg-gray-300 
                          transition 
                          duration-300 
                          cursor-pointer">
                          <BiSolidUser size={20} />
                          {t('common:Profile')}
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
                          md:p-2
                          sm:p-2
                          xs:p-2
                          hover:bg-gray-300 
                          transition 
                          duration-300 
                          cursor-pointer">
                          <IoMdCreate size={20} />
                          {t('common:Write')}
                        </li>
                      </Link>
                      <li className="
                        flex 
                        justify-center 
                        items-center 
                        gap-2
                        p-4
                        md:p-2
                        sm:p-2
                        xs:p-2 
                        hover:bg-gray-300 
                        transition 
                        duration-300 
                        cursor-pointer"
                        onClick={logout}>
                        <FiLogOut size={20} />
                        {t('common:Logout')}
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
                  {t('common:Login')}
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
                  {t('common:Register')}
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
      {router.pathname !== '/' && router.pathname !== '/user/mypage' && latestNotice && <NewNotice latestNotice={latestNotice} />}
    </>
  );
};

export default Header;
