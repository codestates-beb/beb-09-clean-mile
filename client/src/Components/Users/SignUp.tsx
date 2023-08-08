import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Web3 from 'web3';
import Swal from 'sweetalert2';
import useTranslation from 'next-translate/useTranslation';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { FcGoogle } from 'react-icons/fc';
import { IoEyeSharp, IoEyeOffSharp } from 'react-icons/io5';
import { showSuccessAlert, showErrorAlert } from '@/Redux/actions';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import { Three, logo, meta_mask_logo } from '../Reference';
import { ApiCaller } from '../Utils/ApiCaller';
import { userCheckEmail, userVerifyEmailCode, userCheckNickname, userSignUp } from '@/services/api';

declare global {
  interface Window {
    ethereum: any;
  }
}

const SignUp = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const userAddressQuery = useQuery('userAddress');
  const dispatch = useDispatch();
  const { t } = useTranslation('common');
  let web3: Web3;

  if (typeof window !== 'undefined' && window.ethereum) {
    web3 = new Web3(window.ethereum);
  }

  const [isPwdVisible, setPwVisible] = useState(false);
  const [isPwConfirmVisible, setPwConfirmVisible] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    phoneNumber: '',
    nickname: '',
    email: '',
    password: '',
    pwConfirm: '',
    errorMessage: '',
    emailError: '',
    pwConfirmMessage: '',
    passwordError: '',
    pwConfirmError: '',
    emailCheck: false,
    nicknameCheck: false
  });

  /**
   * 비밀번호 가시성 상태를 전환하는 함수
   */
    const passwordVisibility = () => {
      setPwVisible(!isPwdVisible);
    };
  
    /**
     * 비밀번호 확인 가시성 상태를 전환하는 함수      
     */
    const pwConfirmVisibility = () => {
      setPwConfirmVisible(!isPwConfirmVisible);
    };

  const updateFormState = (key: keyof typeof formState, value: any) => {
    setFormState(prev => ({ ...prev, [key]: value }));
  };
  const validateField = (type: "email" | "nickname" | "password" | "passwordConfirm") => {
    switch (type) {
      case "email":
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!re.test(formState.email)) {
          updateFormState('emailError', '이메일 형식에 맞지 않습니다.');
          updateFormState('emailCheck', false);
        } else {
          updateFormState('emailError', '');
          updateFormState('emailCheck', true);
        }
        break;

      case "nickname":
        if (formState.nickname.length < 2) {
          updateFormState('errorMessage', t('common:Nickname must be at least 2 characters long'));
          updateFormState('nicknameCheck', false);
        } else if (formState.nickname.length > 8) {
          updateFormState('errorMessage', t('common:Nickname can be up to 8 characters'));
          updateFormState('nicknameCheck', false);
        } else {
          updateFormState('errorMessage', '');
          updateFormState('nicknameCheck', true);
        }
        break;

      case "password":
        const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (formState.password.length < 8) {
          updateFormState('passwordError', t('common:Password must be at least 8 characters long'));
        } else if (!passwordRegex.test(formState.password)) {
          updateFormState('passwordError', t('common:Password must contain all English uppercase letters, lowercase letters, numbers, and special symbols'));
        } else {
          updateFormState('passwordError', '');
        }
        break;

      case "passwordConfirm":
        if (formState.password.length <= 0 && formState.pwConfirm.length <= 0) {
          updateFormState('pwConfirmError', '');
          updateFormState('pwConfirmMessage', '');
        } else if (formState.password === formState.pwConfirm) {
          updateFormState('pwConfirmMessage', t('common:Password matches'));
          updateFormState('pwConfirmError', '');
        } else if (formState.password !== formState.pwConfirm) {
          updateFormState('pwConfirmError', t("common:Password doesn't match"));
          updateFormState('pwConfirmMessage', '');
        }
        break;
    }
  };

  useEffect(() => {
    validateField("email");
  }, [formState.email]);

  useEffect(() => {
    validateField("nickname");
  }, [formState.nickname]);

  useEffect(() => {
    validateField("password");
  }, [formState.password]);

  useEffect(() => {
    validateField("passwordConfirm");
  }, [formState.pwConfirm]);

  /**
   * 사용자가 입력한 이메일을 검증하고 인증 코드를 발송하는 역할
   *
   * @async
   * @function checkEmail
   * @returns {Promise<void>} 아무것도 반환하지 않음
   */
  const checkEmail = async () => {
    const { email } = formState;

    try {
      const res = await userCheckEmail(email);
      if (res.status === 200) {

        Swal.fire({
          title: t('common:Success'),
          text: t('common:Your email verification code has been sent'),
          icon: 'success' as const,
          confirmButtonText: t('common:OK'),
          confirmButtonColor: '#6BCB77'
        }).then(() => {
          Swal.fire({
            title: t('common:Enter your verification code'),
            input: 'text',
            inputPlaceholder: t('common:Enter your code here'),
            confirmButtonText: t('common:Verify'),
            showCancelButton: true
          }).then((result) => {
            if (result.isConfirmed) {
              verifyEmailCode(result.value).then(() => {
                Swal.fire({
                  title: t('common:Success'),
                  text: t('common:Your email has been successfully authenticated'),
                  icon: 'success',
                  confirmButtonText: t('common:OK'),
                  confirmButtonColor: '#6BCB77'
                });
              }).catch((error) => {
                Swal.fire({
                  title: t('common:Error'),
                  text: error?.response?.data.message,
                  icon: 'error',
                  confirmButtonText: t('common:OK'),
                  confirmButtonColor: '#6BCB77'
                });
                Swal.close();
              });
            }
          });
        })
      } else if (res.status === 400) {

        dispatch(showErrorAlert(res.data.message));
      }
    } catch (error) {
      const err = error as AxiosError;
      const data = err.response?.data as { message: string };

      dispatch(showErrorAlert(data?.message));
    }
  }

  /**
   * 사용자가 입력한 이메일 인증 코드를 검증하는 함수
   * 
   * @async
   * @function verifyEmailCode
   * @param {string} verifyCode 사용자가 입력한 이메일 인증 코드
   * @returns {Promise<void>} 아무것도 반환하지 않음
   */

  const verifyEmailCode = async (verifyCode: string) => {
    const { email } = formState;

    try {
      const res = await userVerifyEmailCode(email, verifyCode);

      if (res.status === 200) {

        dispatch(showSuccessAlert(t('common:Your email has been successfully authenticated')));
      } else {
        dispatch(showErrorAlert(res.data.message));
      }

    } catch (error) {
      const err = error as AxiosError;
      const data = err.response?.data as { message: string };

      dispatch(showErrorAlert(data?.message));
    }
  }

  /**
   * 유저가 입력하 닉네임을 중복 체크하는 함수
   * 
   * @async
   * @function checkNickname
   * @returns {Promise<void>} 아무것도 반환하지 않음
   */
  const checkNickname = async () => {
    const { nickname } = formState;

    try {
      const res = await userCheckNickname(nickname);

      if (res.status === 200) {
        dispatch(showSuccessAlert(res.data.message));
        setFormState(prevState => ({ ...prevState, nicknameCheck: false }));
      } else {
        dispatch(showErrorAlert(res.data.message));
      }
    } catch (error) {
      const err = error as AxiosError;
      const data = err.response?.data as { message: string };

      dispatch(showErrorAlert(data?.message));
    }
  }

  /**
   * 유저의 Ethereum 계정 주소를 가져오는 함수
   * 
   * @returns {Promise<string>} 첫 번째 Ethereum 계정 주소를 반환
   */
  const getUserAccount = async () => {
    let accounts = await web3.eth.getAccounts();;
    return accounts[0];
  }

  /**
   * 유저의 계정 정보를 가져오는 뮤테이션을 실행하는 함수
   * 'getUserAccount' 뮤테이션을 실행하고, 성공 시 'userAddress' 쿼리 데이터를 업데이트
   * 
   * @function fetchAccountInfo
   * @callback useMutation
   * @returns {void} 아무것도 반환하지 않음
   */
  const fetchAccountInfo = useMutation(getUserAccount, {
    onSuccess: (data) => {
      queryClient.setQueryData('userAddress', data);
    },
    onError: (error) => {
      console.log('Error: ', error);
    }
  })

  /**
   * 유저의 메타마스크 지갑을 로그인하는 함수
   * 
   * @async
   * @function loginWallet
   * @returns {Promise<void>} 아무것도 반환하지 않음
   */
  const loginWallet = async () => {

    // 유저 브라우저 확인
    let agent = navigator.userAgent.toLowerCase();

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      if (!window.ethereum) {
        // 메타마스크 설치가 안되어 있을 경우 설치 페이지로 이동
        if (agent.indexOf('chrome') != -1 || agent.indexOf('msie') != -1) {         // 크롬일 경우
          window.open(`${process.env.NEXT_PUBLIC_INSTALL_META_CHROME}`, '_blank');
        } else if (agent.indexOf('firefox') != -1) {                                // firefox일 경우
          window.open(`${process.env.NEXT_PUBLIC_INSTALL_META_FIREFOX}`, '_blank');
        }
      }
    }

    fetchAccountInfo.mutate();
  };

  /**
   * 유저의 회원가입 정보를 서버에 전송하는 함수
   * 
   * 요청이 성공적으로 처리되면, alert를 통해 성공 메시지를 보여주고 로그인 페이지로 이동
   * 요청이 실패하면, alert를 통해 오류 메시지를 보여줌
   * 
   * @async
   * @function signUp
   * @returns {Promise<void>} 아무것도 반환하지 않음
   */
  const signUp = async () => {
    Swal.fire({
      title: t('common:Loading'),
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const { email, name, phoneNumber, password, nickname } = formState;

    let walletAddress;
    if (userAddressQuery.data) {
      walletAddress = String(userAddressQuery.data);
    }

    try {
      const res = await userSignUp(email, name, phoneNumber, password, nickname, walletAddress, 'none');

      Swal.close();

      if (res.status === 200) {
        dispatch(showSuccessAlert(res.data.message));
        router.push('/login');
      }

    } catch (error) {
      Swal.close();

      const err = error as AxiosError;
      const data = err.response?.data as { message: string };

      dispatch(showErrorAlert(data?.message));
    }
  }

  return (
    <div className='w-full min-h-screen grid grid-cols-2 sm:flex sm:items-center sm:justify-center'>
      <div className="block sm:hidden xs:hidden">
        <Three />
      </div>
      <div className='flex flex-col items-center justify-center gap-48 lg:gap-24 sm:gap-20 xs:gap-12 py-6 lg:py-6 sm:w-full xs:w-full'>
        <div className='flex flex-col items-center justify-center gap-6'>
          <Image src={logo} className='cursor-pointer md:w-1/2 sm:w-1/3 xs:w-1/2' width={150} height={100} alt='clean mile logo' onClick={() => router.push('/')} />
          <h1 className='text-6xl lg:text-4xl md:text-4xl sm:text-3xl xs:text-3xl font-bold'>{t('common:SignUp')}</h1>
        </div>
        <div className="w-[80%] lg:w-full flex flex-col items-center justify-center gap-12">
          <div className='w-full lg:w-[90%] md:w-full sm:w-full xs:w-full flex flex-col gap-12'>
            <div className='w-full h-full grid grid-cols-2 md:flex md:flex-col sm:flex sm:flex-col xs:flex xs:flex-col gap-12 md:gap-6 sm:gap-2 xs:gap-2 items-center justify-center'>
              <div className='w-full flex flex-col gap-12 sm:gap-6 xs:gap-2 items-center justify-center'>
                <div className='w-full flex flex-col sm:gap-4 xs:gap-2 justify-center items-center -mb-[1rem]'>
                  <label className='w-full sm:w-full xs:w-full font-semibold text-md lg:text-md md:text-md sm:text-base xs:text-sm' htmlFor='email'>{t('common:E-Mail')}</label>
                  <div className="w-full flex items-cneter gap-4 sm:gap-2 xs:gap-2">
                    <div className='w-full flex flex-col'>
                      <input className="w-full border border-gray-500 rounded-lg px-2 py-3 lg:py-2 md:py-2 sm:py-2 xs:py-1"
                        type='email'
                        id='email'
                        placeholder={t('common:E-Mail')}
                        value={formState.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          setFormState(prevState => ({ ...prevState, email: e.target.value }))
                        } />
                    </div>
                    <button className={`
                      ${!formState.emailCheck ? 'bg-blue-300' : 'bg-main-blue hover:bg-blue-600'}
                      border 
                      rounded-xl 
                      p-2
                      pb-2 
                      sm:p-2 
                      xs:p-2 
                      sm:text-sm 
                      xs:text-sm 
                      text-white 
                      transition 
                      duration-300
                      `}
                      onClick={checkEmail}
                      disabled={!formState.emailCheck}>
                      {t('common:Confirm')}
                    </button>
                  </div>
                  <p className='w-full text-left font-normal text-xs text-red-500' style={{ minHeight: '1rem' }}>{formState.email.length > 0 && formState.emailError}</p>
                </div>
                <div className='w-full flex flex-col sm:gap-4 xs:gap-2 justify-center items-center -mb-[1rem]'>
                  <label className='w-full sm:w-full xs:w-full font-semibold text-md lg:text-md md:text-md sm:text-base xs:text-sm' htmlFor='nickname'>{t('common:Nickname')}</label>
                  <div className='w-full flex items-center gap-4 sm:gap-2 xs:gap-2'>
                    <div className='w-full flex flex-col'>
                      <input className="w-full border border-gray-500 rounded-lg px-2 py-3 lg:py-2 md:py-2 sm:py-2 xs:py-1"
                        type='text'
                        id='nickname'
                        placeholder={t('common:Nickname')}
                        value={formState.nickname}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          setFormState(prevState => ({ ...prevState, nickname: e.target.value }))
                        } />
                    </div>
                    <button className={`
                      ${!formState.nicknameCheck ? 'bg-blue-300' : 'bg-main-blue hover:bg-blue-600'}
                      border 
                      rounded-xl 
                      p-2
                      pb-2 
                      sm:p-2 
                      xs:p-2 
                      sm:text-sm 
                      xs:text-sm 
                      text-white 
                      transition 
                      duration-300
                      `}
                      onClick={checkNickname}
                      disabled={!formState.nicknameCheck}>
                      {t('common:Confirm')}
                    </button>
                  </div>
                  <p className='w-full text-left font-normal text-xs text-red-500' style={{ minHeight: '1rem' }}>{formState.nickname.length > 0 && formState.errorMessage}</p>
                </div>
                <div className='w-full flex flex-col sm:gap-4 xs:gap-2 justify-center items-center'>
                  <label className='w-full sm:w-full xs:w-full font-semibold text-md lg:text-md md:text-md sm:text-base xs:text-sm' htmlFor='name'>{t('common:Name')}</label>
                  <input className="
                    w-full 
                    border 
                    border-gray-500 
                    rounded-lg 
                    px-2 
                    py-3 
                    pr-10 
                    lg:py-2 
                    md:py-2 
                    sm:py-2 
                    xs:py-1"
                    type='text'
                    id='name'
                    value={formState.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setFormState(prevState => ({ ...prevState, name: e.target.value }))
                    } />
                </div>
              </div>
              <div className='w-full flex flex-col gap-12 sm:gap-6 xs:gap-2 items-center justify-center'>
                <div className='w-full flex flex-col gap-2 sm:gap-4 xs:gap-2 justify-center items-center -mb-[1rem]'>
                  <label className='w-full sm:w-full xs:w-full font-semibold text-md lg:text-md md:text-md sm:text-base xs:text-sm' htmlFor='phoneNumber'>{t('common:Phone Number')}</label>
                  <div className="w-full flex gap-4 sm:gap-2 xs:gap-2">
                    <input className="
                      w-full border 
                      border-gray-500 
                      rounded-lg 
                      px-2 
                      py-3 
                      lg:py-2 
                      md:py-2 
                      sm:py-2 
                      xs:py-1"
                      type='text'
                      id='phoneNumber'
                      value={formState.phoneNumber}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setFormState(prevState => ({ ...prevState, phoneNumber: e.target.value }))
                      }
                      maxLength={13} />
                  </div>
                  <p className='w-full text-left font-normal text-xs' style={{ minHeight: '1rem' }}>{t("common:Please enter the number without '-'")}</p>
                </div>
                <div className='w-full flex flex-col sm:gap-4 xs:gap-2 justify-center items-center relative -mb-[1rem]'>
                  <label className='w-full sm:w-full xs:w-full font-semibold text-md lg:text-md md:text-md sm:text-base xs:text-sm' htmlFor='password'>{t('common:Password')}</label>
                  <div className='w-full flex flex-col'>
                    <input className="w-full border border-gray-500 rounded-lg px-2 py-3 pr-10 lg:py-2 md:py-2 sm:py-2 xs:py-1"
                      type={isPwdVisible ? 'text' : 'password'}
                      id='password'
                      value={formState.password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setFormState(prevState => ({ ...prevState, password: e.target.value }))
                      }
                      placeholder={t('common:Password')} />
                    <p className='font-normal text-xs text-red-500' style={{ minHeight: '1rem' }}>{formState.password.length > 0 && formState.passwordError}</p>
                  </div>
                  <button type="button" onClick={passwordVisibility} className="absolute right-3 top-1/2 md:top-[55%] sm:top-[60%] xs:top-[50%] transform -translate-y-1/2">
                    {isPwdVisible ? <IoEyeOffSharp size={20} /> : <IoEyeSharp size={20} />}
                  </button>
                </div>
                <div className='w-full flex flex-col sm:gap-4 xs:gap-2 justify-center items-center relative -mb-[1rem]'>
                  <label className='w-full sm:w-full xs:w-full font-semibold text-md lg:text-md md:text-md sm:text-base xs:text-sm' htmlFor='passwordConfirm'>{t('common:Password Confirm')}</label>
                  <div className='w-full flex flex-col'>
                    <input className="w-full border border-gray-500 rounded-lg px-2 py-3 pr-10 lg:py-2 md:py-2 sm:py-2 xs:py-1"
                      type={isPwConfirmVisible ? 'text' : 'password'}
                      id='passwordConfirm'
                      placeholder={t('common:Password Confirm')}
                      value={formState.pwConfirm}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setFormState(prevState => ({ ...prevState, pwConfirm: e.target.value }))
                      } />
                    <p className={`w-full text-left ${formState.pwConfirm.length > 0 ? 'text-red-600' : 'text-blue-600'} text-xs`} style={{ minHeight: '1rem' }}>{formState.pwConfirmError.length > 0 ? formState.pwConfirmError : formState.pwConfirmMessage}</p>
                  </div>
                  <button type="button" onClick={pwConfirmVisibility} className="absolute right-3 top-1/2 md:top-[55%] sm:top-[60%] xs:top-[50%] transform -translate-y-1/2">
                    {isPwConfirmVisible ? <IoEyeOffSharp size={20} /> : <IoEyeSharp size={20} />}
                  </button>
                </div>
              </div>
            </div>
            <div className='w-full flex flex-col justify-center items-center'>
              {userAddressQuery.data ? (
                <p className='w-full flex justify-center items-center lg:items-start md:items-start sm:items-start xs:items-start flex-wrap lg:flex-col md:flex-col sm:flex-col xs:flex-col md:text-sm sm:text-sm xs:text-xs font-semibold'>
                  {t('common:MetaMask Address')}:
                  <span className='lg:w-full md:w-full sm:w-full xs:w-full text-center lg:text-left md:text-left sm:text-left xs:text-left font-normal ml-1 break-words'>
                    {userAddressQuery.data ? JSON.stringify(userAddressQuery.data) : 'Loading...'}
                  </span>
                </p>
              ) : (
                <button className='
                  w-[50%] 
                  lg:w-[60%] 
                  md:w-[70%] 
                  sm:w-full 
                  xs:w-full 
                  flex 
                  items-center 
                  justify-center 
                  font-semibold 
                  text-white 
                  text-lg 
                  text-md 
                  lg:text-md 
                  md:text-md 
                  sm:text-base 
                  xs:text-sm 
                  bg-[#F3AA60] 
                  hover:bg-[#FF8551] 
                  rounded-xl 
                  px-12 
                  lg:px-6 
                  md:px-4 
                  sm:px-2 
                  xs:px-2 
                  py-3 
                  lg:py-2 
                  md:py-3 
                  sm:py-3 
                  xs:py-2 
                  transition 
                  duration-300'
                  onClick={loginWallet}>
                  <Image src={meta_mask_logo} width={100} height={100} alt='meta mask logo' className='w-[10%] lg:w-[15%] sm:w-[15%] xs:w-[15%]' />
                  <span className='text-center w-[90%] lg:w-[80%] md:text-sm sm:text-xs xs:text-xs'>{t('common:MetaMask Connect')}</span>
                </button>
              )}
            </div>
            <div className='w-full flex flex-col justify-center items-center gap-5 mt-12'>
              <button className={`
                ${!(formState.email.length > 0 && formState.name.length > 0 && formState.phoneNumber.length > 0 && formState.password.length > 0 && formState.nickname.length > 0 && userAddressQuery.data) ? 'bg-green-300 ' : 'bg-main-green hover:bg-green-600'}
                w-[80%] 
                lg:w-[70%] 
                md:w-full 
                sm:w-full 
                xs:w-full 
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
                duration-300`}
                disabled={!(formState.email.length > 0 && formState.name.length > 0 && formState.phoneNumber.length > 0 && formState.password.length > 0 && formState.nickname.length > 0 && userAddressQuery.data)} onClick={signUp}>
                {t('common:SignUp')}
              </button>
              <div className='w-[80%] lg:w-[70%] md:w-full sm:w-full xs:w-full flex sm:flex-col xs:flex-col sm:items-center xs:items-center gap-6'>
                <button className='
                  w-[80%] 
                  sm:w-full 
                  xs:w-full 
                  flex 
                  items-center 
                  justify-center 
                  bg-main-yellow 
                  hover:bg-yellow-500 
                  px-7 
                  py-2 
                  rounded-xl 
                  text-white 
                  text-lg 
                  font-semibold 
                  transition 
                  duration-300'>
                  <RiKakaoTalkFill size={25} className='w-[30%]' />
                  <span className='text-center w-[90%] md:text-sm sm:text-sm xs:text-sm'>{t('common:KaKao')}</span>
                </button>
                <button className='w-[80%] sm:w-full xs:w-full flex items-center justify-center bg-white hover:bg-gray-300 px-7 py-2 rounded-xl text-gray-700 border text-lg font-semibold transition duration-300'>
                  <FcGoogle size={25} className='w-[30%]' />
                  <span className='text-center w-[90%] md:text-sm sm:text-sm xs:text-sm'>{t('common:Google')}</span>
                </button>
              </div>
            </div>
          </div>
          <div>
            <p className='text-lg md:text-base sm:text-base xs:text-base font-semibold hover:underline transition duration-200 cursor-pointer'
              onClick={() => router.push('/login')}>
              {t('common:Login')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp;