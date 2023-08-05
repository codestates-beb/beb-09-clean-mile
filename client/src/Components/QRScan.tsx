import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import useTranslation from 'next-translate/useTranslation';
import Swal from "sweetalert2";
import { AxiosError } from "axios";
import { useRouter } from 'next/router';
import { IoIosArrowBack } from 'react-icons/io';
import { User } from './Interfaces';
import { ApiCaller } from './Utils/ApiCaller';

const QrReader = dynamic(() => import("react-web-qr-reader"), {
  ssr: false
});

const QRScan = () => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const [tokenData, setTokenData] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem('user_info')) {
      const userCache = JSON.parse(sessionStorage.getItem('user_info') || '');
      setIsLoggedIn(userCache !== null);
      setUserInfo(userCache.queries[0]?.state.data.user);
    }
  }, []);

  const verifyEvent = async (tokenData: string) => {
    const formData = new FormData();
    
    formData.append('token', tokenData);
    try {
  
      const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/events/verify`;
      const dataBody = formData;
      const isJSON = false;
      const headers = {};
      const isCookie = true;
  
      const res = await ApiCaller.post(URL, dataBody, isJSON, headers, isCookie);
      if (res.status === 200) {
        Swal.fire({
          title: t('common:Success'),
          text: res.data.message,
          icon: 'success',
          confirmButtonText: t('common:OK'),
          confirmButtonColor: '#6BCB77'
        }).then(() => {
          Swal.close();
          router.replace(`/users/mypage`);
        });

      } else {
        Swal.fire({
          title: t('common:Error'),
          text: res.data.message,
          icon: 'error',
          confirmButtonText: t('common:OK'),
          confirmButtonColor: '#6BCB77'
        }).then(() => {
          Swal.close();
        });
      }
    } catch (error) {
      const err = error as AxiosError;

      const data = err.response?.data as { message: string };

      Swal.fire({
        title: t('common:Error'),
        text: data?.message,
        icon: 'error',
        confirmButtonText: t('common:OK'),
        confirmButtonColor: '#6BCB77'
      }).then(() => {
        Swal.close();
      });
    }
  }

  const handleScan = (scanData: any) => {
    console.log(`loaded data`, scanData);
    if (scanData) {
      console.log(`loaded >>>`, scanData.data);

      verifyEvent(scanData.data);
    }
  };

  const handleError = (err: any) => {
    console.error(err);
  };

  return (
    <div className="w-2/5 md:w-[70%] sm:w-[90%] xs:w-[90%] min-h-screen flex flex-col justify-center items-center gap-4 mx-auto">
      <div className='w-full flex justify-between items-center'>
        <div className='w-[10%] lg:w-[20%] sm:w-[20%] xs:w-[20%] flex items-center font-bold cursor-pointer hover:underline' onClick={() => router.push('/users/mypage')}>
          <IoIosArrowBack size={20} />
          {t('common:Back')}
        </div>
        <p className='w-[60%] lg:w-[75%] md:w-[70%] sm:w-[80%] xs:w-[80%] font-bold text-xl'>{t('common:Please scan the QR code')}</p>
      </div>
      <QrReader
        facingMode='environment'
        delay={1000}
        onError={handleError}
        onScan={handleScan}
        className="w-full" />
    </div>
  );
};

export default QRScan;
