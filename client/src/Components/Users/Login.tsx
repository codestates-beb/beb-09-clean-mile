import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import Swal from 'sweetalert2';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { useMutation, useQueryClient, dehydrate } from 'react-query';
import { IoEyeSharp, IoEyeOffSharp } from 'react-icons/io5';
import { Three, logo } from '../Reference';
import { LoginAPIInput, LoginAPIOutput } from '../Interfaces';
import { showErrorAlert } from '@/Redux/actions';
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
  
  /**
   * 비밀번호의 가시성을 토글하는 함수
   */
  const togglePasswordVisibility = () => setPwVisible(prevState => !prevState);

  /**
   * 주어진 비밀번호가 유효한지 검사하는 함수
   * @param {string} password - 검사할 비밀번호
   * @return {boolean} 비밀번호의 유효성 결과
   */
  const isPasswordValid = (password: string) => {
    const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password) && password.length >= 8;
  };

  /**
   * 주어진 이메일이 유효한지 검사하는 함수
   * @param {string} email - 검사할 이메일
   * @return {boolean} 이메일의 유효성 결과
   */
  const isEmailValid = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  /**
   * 이메일과 비밀번호 유효성을 검사하고, 유효하지 않으면 오류 메시지를 설정하는 함수
   */
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

   /**
   * 로딩 상태의 SweetAlert를 표시하는 함수
   * @param {string} title - SweetAlert의 제목
   */
  const showLoadingSwal = (title: string) => {
    return Swal.fire({
      title,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  /**
   * 로그인 성공 시 호출되는 함수
   * @param {LoginAPIOutput} data - 로그인 API의 응답 데이터
   * @param {LoginAPIInput} variables - 로그인 API의 입력 데이터
   * @param {unknown} context - 알 수 없는 컨텍스트 데이터
   */
  const handleLoginSuccess = (data: LoginAPIOutput, variables: LoginAPIInput, context: unknown): void => {
    queryClient.invalidateQueries('user');
    queryClient.setQueryData('user', data);
    const dehydratedState = dehydrate(queryClient);
    sessionStorage.setItem('user', JSON.stringify(dehydratedState));
  }
  
   /**
   * 로그인 과정에서 오류가 발생하면 호출되는 함수
   * @param {AxiosError} error - 발생한 에러
   * @param {LoginAPIInput} variables - 로그인 API의 입력 데이터
   * @param {unknown} context - 알 수 없는 컨텍스트 데이터
   */
  const handleError = (error: AxiosError, variables: LoginAPIInput, context: unknown): void => {
    console.log('Mutation Error: ', error);
  }

  /**
   * 사용자 로그인을 위한 API 호출 함수
   * @param {LoginAPIInput} loginInput - 로그인 정보
   * @return {Promise<any>} 응답 데이터
   */
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

  /**
   * 로그인 API를 호출하기 위한 useMutation 훅
   */
  const loginMutation = useMutation(loginAPI, {
    onSuccess: handleLoginSuccess,
    onError: handleError
  });

  
  /**
   * 로그인 실행 함수
   */
  const login = () => {
    loginMutation.mutate({ email, password });
  };

  return (
    <div className='w-full min-h-screen grid grid-cols-2 sm:flex xs:flex sm:items-center xs:items-center sm:justify-center xs:justify-center'>
      <div className="block sm:hidden xs:hidden">
        <Three />
      </div>
      <div className='flex flex-col items-center justify-center gap-40 lg:gap-24 sm:gap-20 xs:gap-12 lg:py-6 sm:w-full xs:w-full'>
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