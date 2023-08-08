import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import Swal from 'sweetalert2';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { useMutation, useQueryClient, dehydrate } from 'react-query';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { FcGoogle } from 'react-icons/fc';
import { IoEyeSharp, IoEyeOffSharp } from 'react-icons/io5';
import { Three, logo } from '../Reference';
import { ApiCaller } from '../Utils/ApiCaller';
import { LoginAPIInput, LoginAPIOutput } from '../Interfaces';
import { showSuccessAlert, showErrorAlert } from '@/Redux/actions';
import { userLogin } from '@/services/api';

const Login = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { t } = useTranslation('common');

  const [isPwdVisible, setPwVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const togglePasswordVisibility = () => setPwVisible(prevState => !prevState);

  const isPasswordValid = (password: string) => {
    const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password) && password.length >= 8;
  };

  const isEmailValid = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  useEffect(() => {
    if (!isPasswordValid(password)) {
      setPasswordError(t('common:Password requirements not met'));
    } else {
      setPasswordError('');
    }

    if (!isEmailValid(email)) {
      setEmailError(t('common:Invalid email format'));
    } else {
      setEmailError('');
    }
  }, [email, password]);

  const showLoadingSwal = (title: string) => {
    return Swal.fire({
      title,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  const handleLoginSuccess = (data: LoginAPIOutput, variables: LoginAPIInput, context: unknown): void => {
    queryClient.invalidateQueries('user');
    queryClient.setQueryData('user', data);
    const dehydratedState = dehydrate(queryClient);
    sessionStorage.setItem('user', JSON.stringify(dehydratedState));
  }
  
  const handleError = (error: AxiosError, variables: LoginAPIInput, context: unknown): void => {
    console.log('Mutation Error: ', error);
  }

  const loginAPI = async (loginInput: LoginAPIInput) => {
    showLoadingSwal(t('common:Loading'));
    
    try {
      const res = await userLogin(loginInput);
      
      if (res.status === 200) {
        await Swal.fire({
          title: 'Success',
          text: res.data.message,
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#6BCB77'
        });
        router.push('/');
      } else {
        dispatch(showErrorAlert(res.data.message));
      }
  
      return res.data.data;
    } catch (error) {
      const err = error as AxiosError;

      const data = err.response?.data as { message: string };

      dispatch(showErrorAlert(data?.message));
      throw error;
    } finally {
      Swal.close();
    }
  };

  const loginMutation = useMutation(loginAPI, {
    onSuccess: handleLoginSuccess,
    onError: handleError
  });

  const login = () => {
    loginMutation.mutate({ email, password });
  };

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
              <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-1/2 md:top-[55%] sm:top-[60%] xs:top-[50%] transform -translate-y-1/2">
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