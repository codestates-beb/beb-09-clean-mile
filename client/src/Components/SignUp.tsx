import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { FcGoogle } from 'react-icons/fc';
import { IoEyeSharp, IoEyeOffSharp } from 'react-icons/io5';
import { Three } from '../Components/Reference';

const SignUp = () => {
  const router = useRouter();
  const [isPwdVisible, setPwVisible] = useState(false);
  const [isPwConfirmVisible, setPwConfirmVisible] = useState(false);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [pwConfirmMessage, setPwConfirmMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [pwConfirmError, setPwConfirmError] = useState('');

  console.log(nickname);

  const passwordVisibility = () => {
    setPwVisible(!isPwdVisible);
  };

  const pwConfirmVisibility = () => {
    setPwConfirmVisible(!isPwConfirmVisible);
  };

  /**
   * 닉네임을 유효성 검사하는 함수
   * 입력한 닉네임이 유효한지 확인하고, 유효하지 않은 경우 에러 메시지를 설정 
   */
const validateNickname = () => {
  if (nickname.length < 2) {
      setErrorMessage('닉네임은 최소 2자 이상이어야 합니다.');
  } else if (nickname.length > 8) {
      setErrorMessage('닉네임은 최대 8자 입니다.');
  } else {
      setErrorMessage('');
  }
};

  useEffect(() => {
    validateNickname();
  }, [nickname]);

    /**
   * 비밀번호 유효성 검사를 수행하는 함수
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

  /**
   * 비밀번호 확인 유효성 검사를 수행하는 함수
   * - 비밀번호 확인 입력값이 비어있지 않아야 하며,
   * - 비밀번호 입력값과 비밀번호 확인 입력값이 동일해야 함
   */
  const passwordConfirm = () => {
    if (password.length <= 0 && pwConfirm.length <= 0 ) {
      setPwConfirmError('');
      setPwConfirmMessage('');
    } else if (password === pwConfirm) {
      setPwConfirmMessage('비밀번호가 일치합니다.');
      // setSignUpDisabled(false);
      setPwConfirmError('');
    } else if (password !== pwConfirm) {
      setPwConfirmError('비밀번호가 일치하지 않습니다.');
      setPwConfirmMessage('');
    }
  }

  useEffect(() => {
      validatePassword();
  }, [password]);

  useEffect(() => {
      passwordConfirm();
  }, [pwConfirm]);

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
        <h1 className='text-6xl lg:text-4xl md:text-4xl sm:text-3xl xs:text-3xl font-bold'>SignUp</h1>
        <div className="w-[80%] lg:w-full flex flex-col items-center justify-center gap-12">
          <div className='w-full lg:w-[90%] md:w-full sm:w-full xs:w-full flex flex-col gap-12'>
            <div className='w-full h-full grid grid-cols-2 md:flex md:flex-col sm:flex sm:flex-col xs:flex xs:flex-col gap-12 md:gap-6 sm:gap-2 xs:gap-2 items-center justify-center'>
              <div className='w-full flex flex-col gap-12 sm:gap-6 items-center justify-center'>
                <div className='w-full flex flex-col sm:gap-4 xs:gap-2 justify-center items-center -mb-[1rem]'>
                  <label className='w-full sm:w-full xs:w-full font-semibold text-md lg:text-md md:text-md sm:text-base xs:text-sm' htmlFor='email'>E-Mail</label>
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
                <div className='w-full flex flex-col sm:gap-4 xs:gap-2 justify-center items-center -mb-[1rem]'>
                  <label className='w-full sm:w-full xs:w-full font-semibold text-md lg:text-md md:text-md sm:text-base xs:text-sm' htmlFor='nickname'>Nickname</label>
                  <div className='w-full flex flex-col'>
                    <input className="w-full border border-gray-500 rounded-lg px-2 py-3 pr-10 lg:py-2 md:py-2 sm:py-2 xs:py-1" 
                      type='text' 
                      id='nickname' 
                      placeholder='nickname'
                      value={nickname}
                      onChange={(e:React.ChangeEvent<HTMLInputElement>) => setNickname(e.target.value)} />
                    <p className='font-normal text-xs text-red-500' style={{ minHeight: '1rem' }}>{nickname.length > 0 && errorMessage}</p>
                  </div>
                </div>
                <div className='w-full flex flex-col sm:gap-4 xs:gap-2 justify-center items-center'>
                  <label className='w-full sm:w-full xs:w-full font-semibold text-md lg:text-md md:text-md sm:text-base xs:text-sm' htmlFor='name'>Name</label>
                  <input className="w-full border border-gray-500 rounded-lg px-2 py-3 pr-10 lg:py-2 md:py-2 sm:py-2 xs:py-1" type='text' id='name' placeholder='name' />
                </div>
              </div>
              <div className='w-full flex flex-col gap-12 sm:gap-6 items-center justify-center'>
                <div className='w-full flex flex-col gap-2 sm:gap-4 xs:gap-2 justify-center items-center'>
                  <label className='w-full sm:w-full xs:w-full font-semibold text-md lg:text-md md:text-md sm:text-base xs:text-sm' htmlFor='phoneNumber'>Phone Number</label>
                  <input className="w-full border border-gray-500 rounded-lg px-2 py-3 lg:py-2 md:py-2 sm:py-2 xs:py-1" type='number' id='phoneNumber' />
                </div>
                <div className='w-full flex flex-col sm:gap-4 xs:gap-2 justify-center items-center relative -mb-[1rem]'>
                  <label className='w-full sm:w-full xs:w-full font-semibold text-md lg:text-md md:text-md sm:text-base xs:text-sm' htmlFor='password'>Password</label>
                  <div className='w-full flex flex-col'>
                    <input className="w-full border border-gray-500 rounded-lg px-2 py-3 pr-10 lg:py-2 md:py-2 sm:py-2 xs:py-1" 
                      type={isPwdVisible ? 'text' : 'password'}   
                      id='password' 
                      value={password}
                      onChange={(e:React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} 
                      placeholder='password' />
                  <p className='font-normal text-xs text-red-500' style={{ minHeight: '1rem' }}>{password.length > 0 && passwordError}</p>
                  </div>
                  <button type="button" onClick={passwordVisibility} className="absolute right-3 top-1/2 md:top-[55%] sm:top-[60%] xs:top-[50%] transform -translate-y-1/2">
                    {isPwdVisible ? <IoEyeOffSharp size={20} /> : <IoEyeSharp size={20} />}
                  </button>
                </div>
                <div className='w-full flex flex-col sm:gap-4 xs:gap-2 justify-center items-center relative -mb-[1rem]'>
                  <label className='w-full sm:w-full xs:w-full font-semibold text-md lg:text-md md:text-md sm:text-base xs:text-sm' htmlFor='passwordConfirm'>Password Confirm</label>
                  <div className='w-full flex flex-col'>
                    <input className="w-full border border-gray-500 rounded-lg px-2 py-3 pr-10 lg:py-2 md:py-2 sm:py-2 xs:py-1" 
                      type={isPwConfirmVisible ? 'text' : 'password'} 
                      id='passwordConfirm' 
                      placeholder='password confirm'
                      value={pwConfirm}
                      onChange={(e:React.ChangeEvent<HTMLInputElement>) => setPwConfirm(e.target.value)}  />
                  <p className={`w-full text-left ${pwConfirmError.length > 0 ? 'text-red-600' : 'text-blue-600'} text-xs`} style={{ minHeight: '1rem'}}>{pwConfirmError.length > 0 ? pwConfirmError : pwConfirmMessage}</p>
                  </div>
                  <button type="button" onClick={pwConfirmVisibility} className="absolute right-3 top-1/2 md:top-[55%] sm:top-[60%] xs:top-[50%] transform -translate-y-1/2">
                    {isPwConfirmVisible ? <IoEyeOffSharp size={20} /> : <IoEyeSharp size={20} />}
                  </button>
                </div>
              </div>
            </div>
            <div className='w-full flex flex-col justify-center items-center gap-5 mt-12'>
              <button className='w-[50%] lg:w-[70%] md:w-full sm:w-full xs-w-full bg-main-green hover:bg-green-600 px-7 py-2 rounded-xl text-white text-lg md:text-base sm:text-base xs:text-base font-semibold transition duration-300'>
              SignUp
              </button>
              <div className='w-[50%] lg:w-[70%] md:w-full sm:w-full xs-w-full flex sm:flex-col xs:flex-col sm:items-center xs:items-center gap-6'>
                <button className='w-[50%] sm:w-full xs:w-full flex items-center justify-center bg-main-yellow hover:bg-yellow-500 px-7 py-2 rounded-xl text-white text-lg font-semibold transition duration-300'>
                  <RiKakaoTalkFill size={25} className='w-[30%]' />
                  <span className='text-center w-[90%] md:text-sm sm:text-sm xs:text-sm'>KaKao</span>
                </button>
                <button className='w-[50%] sm:w-full xs:w-full flex items-center justify-center bg-white hover:bg-gray-300 px-7 py-2 rounded-xl text-gray-700 border text-lg font-semibold transition duration-300'>
                  <FcGoogle size={25} className='w-[30%]' />
                  <span className='text-center w-[90%] md:text-sm sm:text-sm xs:text-sm'>Google</span>
                </button>
              </div>
            </div>
          </div>
          <div>
            <p className='text-lg md:text-base sm:text-base xs:text-base font-semibold hover:underline transition duration-200 cursor-pointer'
              onClick={() => router.push('/login')}>
              Login
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp;