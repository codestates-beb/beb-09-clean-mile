import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { FcGoogle } from 'react-icons/fc';
import { IoEyeSharp, IoEyeOffSharp } from 'react-icons/io5';
import { Three } from '../Components/Reference';

const Login = () => {
  const router = useRouter();
  const [isPwdVisible, setPwVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const passwordVisibility = () => {
    setPwVisible(!isPwdVisible);
  };
  /**
   * - 비밀번호 유효성 검사를 수행하는 함수
   * - 비밀번호는 최소 8자 이상이어야 하며,
   * - 대문자, 소문자, 숫자, 특수기호가 모두 포함되어야 함
   */
  const validatePassword = () => {
    const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (password.length < 8) {
      setPasswordError('비밀번호는 최소 8자 이상이어야 합니다.');
    } else if (!passwordRegex.test(password)) {
      setPasswordError('비밀번호는 영문 대문자, 영문 소문자, 숫자, 특수기호를 모두 포함해야 합니다.');
    } else {
      setPasswordError('');
    }
  };


  useEffect(() => {
      validatePassword();
  }, [password]);

  const validateEmail = () => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!re.test(email)) {
      setEmailError('이메일 형식에 맞지 않습니다.');
    } else {
      setEmailError('');
    }
  } 
  
  useEffect(() => {
    validateEmail();
  }, [email]);



  return (
    <div className='w-full min-h-screen grid grid-cols-2'>
      <Three />
      <div className='flex flex-col items-center justify-center gap-48 lg:gap-24 sm:gap-20 xs:gap-12 lg:py-6'>
        <h1 className='text-6xl lg:text-5xl md:text-4xl sm:text-3xl xs:text-3xl font-bold'>Login</h1>
        <div className="w-[80%] flex flex-col items-center justify-center gap-12">
          <div className='w-[50%] lg:w-[90%] md:w-full sm:w-full xs:w-full flex flex-col gap-12'>
            <div className='w-full flex flex-col sm:gap-4 xs:gap-2 justify-center items-center'>
              <label className='w-full sm:w-full xs:w-full font-semibold text-md lg:text-lg md:text-lg sm:text-base xs:text-sm' htmlFor='email'>E-Mail</label>
              <div className="w-full flex flex-col">
                <input className="w-full border border-gray-500 rounded-lg px-2 py-3 pr-10 lg:py-2 md:py-2 sm:py-2 xs:py-1" 
                  type='email' 
                  id='email' 
                  placeholder='e-mail'
                  value={email}
                  onChange={(e:React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
                <p className='font-normal text-xs text-red-500' style={{ minHeight: '1rem' }}>{email.length > 0 && emailError}</p>
              </div>
            </div>
            <div className='w-full flex flex-col sm:gap-4 xs:gap-2 justify-center items-center relative mb-5'>
              <label className='w-full sm:w-full xs:w-full font-semibold text-md lg:text-lg md:text-lg sm:text-base xs:text-sm' htmlFor='password'>Password</label>
              <div className='w-full flex flex-col'>
                <input className="w-full border border-gray-500 rounded-lg px-2 py-3 pr-10 lg:py-2 md:py-2 sm:py-2 xs:py-1" 
                  type={isPwdVisible ? 'text' : 'password'}   
                  id='password' 
                  value={password}
                  onChange={(e:React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} 
                  placeholder='password' />
                <p className='w-full text-left text-red-600 text-xs' style={{ minHeight: '1rem'}}>{password.length > 0 && passwordError}</p>
              </div>
              <button type="button" onClick={passwordVisibility} className="absolute right-3 top-1/2 md:top-[55%] sm:top-[60%] xs:top-[50%] transform -translate-y-1/2">
                {isPwdVisible ? <IoEyeOffSharp size={20} /> : <IoEyeSharp size={20} />}
              </button>
            </div>
            <div className='w-full flex flex-col justify-center items-center gap-5'>
              <button className='w-[90%] bg-main-green hover:bg-green-600 px-7 py-2 rounded-xl text-white text-lg md:text-base sm:text-base xs:text-base font-semibold transition duration-300'>
                Login
              </button>
              <div className='w-[90%] flex sm:flex-col xs:flex-col sm:items-center xs:items-center gap-6'>
                <button className='w-[50%] sm:w-full xs:w-full flex items-center justify-center bg-main-yellow hover:bg-yellow-500 px-7 py-2 rounded-xl text-white text-lg font-semibold transition duration-300'>
                  <RiKakaoTalkFill size={25} className='w-[30%]' />
                  <span className='text-center w-[90%] md:text-sm sm:text-sm xs:text-sm'>KaKao</span>
                </button>
                <button className='w-[50%] sm:w-full xs:w-full flex items-center justify-center bg-white hover:bg-gray-300 px-7 py-2 sm:py-3 rounded-xl text-gray-700 border text-lg font-semibold transition duration-300'>
                  <FcGoogle size={25} className='w-[30%]' />
                  <span className='text-center w-[90%] md:text-sm sm:text-sm xs:text-sm'>Google</span>
                </button>
              </div>
            </div>
          </div>
          <div>
            <p className='text-lg md:text-base sm:text-base xs:text-base font-semibold hover:underline transition duration-200 cursor-pointer'
              onClick={() => router.push('/signup')}>
              SignUp
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;