import React, { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import Swal from 'sweetalert2';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useMutation, useQueryClient, dehydrate } from 'react-query';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { FcGoogle } from 'react-icons/fc';
import { IoEyeSharp, IoEyeOffSharp } from 'react-icons/io5';
import { Three, logo } from '../Reference';
import { ApiCaller } from '../Utils/ApiCaller';
import { LoginAPIInput, LoginAPIOutput } from '../Interfaces';


const Login = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');

  const [isPwdVisible, setPwVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  /**
   * 비밀번호 가시성 상태를 전환하는 함수
   */
  const passwordVisibility = () => {
    setPwVisible(!isPwdVisible);
  };

  /**
   * 사용자의 비밀번호를 검증하는 함수
   * 비밀번호는 최소 8자 이상이어야 하며, 최소한 하나의 대문자, 소문자, 숫자, 특수문자가 포함되어야 함
   * 만약 비밀번호가 이 요구사항을 만족하지 않을 경우, `passwordError` 상태를 관련 오류 메시지로 업데이트
   */
  const validatePassword = () => {
    const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (password.length < 8) {
      setPasswordError(t('common:Password must be at least 8 characters long'));
    } else if (!passwordRegex.test(password)) {
      setPasswordError(t('common:Password must contain all English uppercase letters, lowercase letters, numbers, and special symbols'));
    } else {
      setPasswordError('');
    }
  };

  useEffect(() => {
      validatePassword();
  }, [password]);

  /**
   * 이메일을 검증하는 함수
   * 이메일은 특정 형식에 맞아야 함
   * 만약 이메일이 이 형식에 맞지 않을 경우, `emailError` 상태를 오류 메시지로 업데이트
   */
  const validateEmail = () => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!re.test(email)) {
      setEmailError(t('common:Invalid email format'));
    } else {
      setEmailError('');
    }
  } 
  
  useEffect(() => {
    validateEmail();
  }, [email]);

  /**
   * loginAPI 함수는 사용자의 이메일과 비밀번호를 이용해 로그인을 수행
   *
   * @param {LoginAPIInput} { email, password } 로그인을 수행할 때 필요한 사용자의 이메일과 비밀번호
   * @returns {Promise<LoginAPIOutput>} 로그인 수행 후 서버로부터 받는 응답
   * @throws {AxiosError} 네트워크 에러 또는 서버에서 보내는 에러 응답
   */
  const loginAPI  = async ({ email, password }: LoginAPIInput): Promise<LoginAPIOutput> => {
    const formData = new FormData();

    formData.append('email', email);
    formData.append('password', password);
    try {
      const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/login`;
      const dataBody = formData;
      const headers = {
        'Content-Type': 'application/form-data',
        'Accept': 'application/json',
      }
      const isJSON = false;
      const isCookie = true;

      const res = await ApiCaller.post(URL, dataBody, isJSON, headers, isCookie);
      if (res.status === 200) {
        Swal.fire({
          title: t('common:Success'),
          text: res.data.message,
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#6BCB77'
        }).then(() => {
          Swal.close();
          router.push('/');
        });

      } else {
        Swal.fire({
          title: t('common:Error'),
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
        title: t('common:Error'),
        text: data?.message,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#6BCB77'
      }).then(() => {
        Swal.close();
      });

      throw err;
    }
  }
  
  /**
   * loginMutation 함수는 useMutation hook을 사용하여 loginAPI를 호출하고, 요청의 결과에 따라 적절한 동작을 수행
   * 
   * @returns {UseMutationResult} 리액트 쿼리의 useMutation hook으로부터 반환되는 결과 객체
   */
  const loginMutation = useMutation<LoginAPIOutput, unknown, LoginAPIInput>(loginAPI , {
    onSuccess: (data: LoginAPIOutput) => {
      queryClient.invalidateQueries('user');
      queryClient.setQueryData('user', data);

      const dehydratedState = dehydrate(queryClient);
      sessionStorage.setItem('user', JSON.stringify(dehydratedState));
    },
    onError: (error) => {
      console.log('Mutation Error: ', error);
    }
  });

  /**
 * login 함수는 loginMutation을 호출하여 사용자 로그인을 수행
 */
  const login = () => {
    loginMutation.mutate({ email, password });
  }

  return (
    <div className='w-full min-h-screen grid grid-cols-2'>
      <Three />
      <div className='flex flex-col items-center justify-center gap-40 lg:gap-24 sm:gap-20 xs:gap-12 lg:py-6'>
        <div className='flex flex-col items-center justify-center gap-6'>
          <Image src={logo} className='cursor-pointer md:w-1/2 sm:w-1/3 xs:w-1/2' width={150} height={100} alt='clean mile logo' onClick={() => router.push('/')} />
          <h1 className='text-6xl lg:text-4xl md:text-4xl sm:text-3xl xs:text-3xl font-bold'>{t('common:Login')}</h1>
        </div>
        <div className="w-[80%] flex flex-col items-center justify-center gap-12">
          <div className='w-[50%] lg:w-[90%] md:w-full sm:w-full xs:w-full flex flex-col gap-12'>
            <div className='w-full flex flex-col sm:gap-4 xs:gap-2 justify-center items-center'>
              <label className='w-full sm:w-full xs:w-full font-semibold text-md lg:text-lg md:text-lg sm:text-base xs:text-sm' htmlFor='email'>{t('common:E-Mail')}</label>
              <div className="w-full flex flex-col">
                <input className="w-full border border-gray-500 rounded-lg px-2 py-3 pr-10 lg:py-2 md:py-2 sm:py-2 xs:py-1" 
                  type='email' 
                  id='email' 
                  placeholder={t('common:E-Mail')}
                  value={email}
                  onChange={(e:React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
                <p className='font-normal text-xs text-red-500' style={{ minHeight: '1rem' }}>{email.length > 0 && emailError}</p>
              </div>
            </div>
            <div className='w-full flex flex-col sm:gap-4 xs:gap-2 justify-center items-center relative mb-5'>
              <label className='w-full sm:w-full xs:w-full font-semibold text-md lg:text-lg md:text-lg sm:text-base xs:text-sm' htmlFor='password'>{t('common:Password')}</label>
              <div className='w-full flex flex-col'>
                <input className="w-full border border-gray-500 rounded-lg px-2 py-3 pr-10 lg:py-2 md:py-2 sm:py-2 xs:py-1" 
                  type={isPwdVisible ? 'text' : 'password'}   
                  id='password' 
                  value={password}
                  onChange={(e:React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} 
                  placeholder={t('common:Password')} />
                <p className='w-full text-left text-red-600 text-xs' style={{ minHeight: '1rem'}}>{password.length > 0 && passwordError}</p>
              </div>
              <button type="button" onClick={passwordVisibility} className="absolute right-3 top-1/2 md:top-[55%] sm:top-[60%] xs:top-[50%] transform -translate-y-1/2">
                {isPwdVisible ? <IoEyeOffSharp size={20} /> : <IoEyeSharp size={20} />}
              </button>
            </div>
            <div className='w-full flex flex-col justify-center items-center gap-5'>
              <button className='
                w-[90%] 
                bg-main-green 
                hover:bg-green-600 
                px-7 
                py-2 
                rounded-xl 
                text-white 
                text-lg 
                md:text-base 
                sm:text-base 
                xs:text-base 
                font-semibold 
                transition 
                duration-300'
                onClick={login}>
                {t('common:Login')}
              </button>
              <div className='w-[90%] flex sm:flex-col xs:flex-col sm:items-center xs:items-center gap-6'>
                <button className='w-[50%] sm:w-full xs:w-full flex items-center justify-center bg-main-yellow hover:bg-yellow-500 px-7 py-2 rounded-xl text-white text-lg font-semibold transition duration-300'>
                  <RiKakaoTalkFill size={25} className='w-[30%]' />
                  <span className='text-center w-[90%] md:text-sm sm:text-sm xs:text-sm'>{t('common:KaKao')}</span>
                </button>
                <button className='w-[50%] sm:w-full xs:w-full flex items-center justify-center bg-white hover:bg-gray-300 px-7 py-2 sm:py-3 rounded-xl text-gray-700 border text-lg font-semibold transition duration-300'>
                  <FcGoogle size={25} className='w-[30%]' />
                  <span className='text-center w-[90%] md:text-sm sm:text-sm xs:text-sm'>{t('common:Google')}</span>
                </button>
              </div>
            </div>
          </div>
          <div>
            <p className='text-lg md:text-base sm:text-base xs:text-base font-semibold hover:underline transition duration-200 cursor-pointer'
              onClick={() => router.push('/signup')}>
              {t('common:SignUp')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;