import React, { useState, useRef } from "react";
import dynamic from 'next/dynamic';
import useTranslation from 'next-translate/useTranslation';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { AxiosError } from "axios";
import { useRouter } from 'next/router';
import { IoIosArrowBack } from 'react-icons/io';
import { showErrorAlert } from '@/Redux/actions';
import { userVerifyEvent } from '@/services/api';

// 동적 임포트를 사용하여 서버 사이드 렌더링(SSR) 없이 "react-web-qr-reader"를 가져옴
const QrReader = dynamic(() => import("react-web-qr-reader"), {
  ssr: false
});

const BADGE_TYPE = {
  1: 'bronze',
  2: 'silver',
  3: 'gold'
}

interface BadgeResponse {
  _id: string;
  badge_id: string;
  name: string;
  description: string;
  type: 1 | 2 | 3;
  image_url: string;
  token_uri: string;
  event_id: string;
  initial_quantity: number;
  remain_quantity: number;
  owners: [
    {
      _id: string;
    }
  ];
  created_at: string;
  updated_at: string;
}

const QRScan = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation('common');

  const [isScanned, setIsScanned] = useState(false);
  const [scanDelay, setScanDelay] = useState<number | false>(1000);

  /**
   * 이벤트 토큰 데이터를 기반으로 사용자 이벤트를 확인하는 함수
   * @param {string} tokenData - 이벤트 토큰 데이터
   */
  const verifyEvent = async (tokenData: string) => {
    Swal.fire({
      title: t('common:Loading'),
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const res = await userVerifyEvent(tokenData);
      
      Swal.close();
      setScanDelay(false);

      const userBadge: BadgeResponse = res.data.badge;

      if (res.status === 200) {
        setIsScanned(true);
        await Swal.fire({
          title: userBadge.name,
          html: `<p>${BADGE_TYPE[userBadge.type]}</p><br><p>${userBadge.description}</p>`,
          imageUrl: res.data.badge.image_url,
          imageWidth: 400,
          imageHeight: 200,
          imageAlt: 'Badge Image'
        });
        router.replace(`/users/mypage`);
      } else {
        dispatch(showErrorAlert(res.data.message));
        router.back();
      }
    } catch (error) {
      console.log(error)
      Swal.close();
      const err = error as AxiosError;

      const data = err.response?.data as { message: string };

      setIsScanned(true);
      setScanDelay(false); // 스캔 중지
      dispatch(showErrorAlert(data?.message));
    }
  }

  /**
   * QR 코드 스캔 결과를 처리하는 함수
   * @param {any} scanData - 스캔된 QR 데이터
   */
  const handleScan = (scanData: any) => {
    if (scanData && !isScanned) {
      setIsScanned(true); // 첫 번째 스캔 감지 시 isScanned 상태를 true로 설정
      setScanDelay(false); // 스캔을 일시 중지
      verifyEvent(scanData.data);
    }
  };

  /**
   * QR 코드 스캔 중 발생한 오류를 처리하는 함수
   * @param {any} err - 발생한 오류
   */
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
      { 
        !isScanned && 
        <QrReader
          facingMode='environment'
          delay={!scanDelay ? false : scanDelay}
          onError={handleError}
          onScan={handleScan}
          className="w-full" />
      }
    </div>
  );
};

export default QRScan;
