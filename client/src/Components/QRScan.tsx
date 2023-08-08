import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import useTranslation from 'next-translate/useTranslation';
import { useDispatch } from 'react-redux';
import { AxiosError } from "axios";
import { useRouter } from 'next/router';
import { IoIosArrowBack } from 'react-icons/io';
import { showSuccessAlert, showErrorAlert } from '@/Redux/actions';
import { userVerifyEvent } from '@/services/api';

const QrReader = dynamic(() => import("react-web-qr-reader"), {
  ssr: false
});

const QRScan = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation('common');

  const verifyEvent = async (tokenData: string) => {
    try {
      const res = await userVerifyEvent(tokenData);
      if (res.status === 200) {
        dispatch(showSuccessAlert(res.data.message));
        router.replace(`/users/mypage`);

      } else {
        dispatch(showErrorAlert(res.data.message));
      }
    } catch (error) {
      const err = error as AxiosError;

      const data = err.response?.data as { message: string };

      dispatch(showErrorAlert(data?.message));
    }
  }

  const handleScan = (scanData: any) => {
    if (scanData) {
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
