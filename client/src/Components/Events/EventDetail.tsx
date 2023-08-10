import React, { useEffect, useState, useMemo } from 'react';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import Image from 'next/image';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch } from 'react-redux';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { Comments } from '../Reference';
import { EventDetailType, Comment } from '../Interfaces';
import { showSuccessAlert, showErrorAlert } from '@/Redux/actions';
import { enterEvent } from '@/services/api';
import { useUserSession } from '@/hooks/useUserSession';

const EventDetail = ({ eventDetail, comments }: { eventDetail: EventDetailType, comments: Comment[] }) => {
  /**
   * 컴포넌트에서 사용하는 라우터 인스턴스를 가져옴
   * @type {NextRouter}
   */
  const router = useRouter();

  /**
   * 리덕스 액션을 디스패치하기 위한 디스패치 함수를 가져옴
   * @type {Dispatch<any>}
   */
  const dispatch = useDispatch();

  /**
   * 사용자 세션 훅을 사용하여 사용자 데이터를 가져옴
   * @type {object}
   */
  const { userData } = useUserSession();

  /**
   * 공통 번역 훅을 사용하여 번역 함수를 가져옴
   * @type {TFunction}
   */
  const { t } = useTranslation('common');

  /**
   * 사용자 로그인 상태를 상태로 관리
   * @type {boolean}
   */
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /**
   * 컴포넌트 마운트 시, 세션 스토리지에서 사용자 로그인 정보를 가져와 상태를 설정
   */
  useEffect(() => {
    setIsLoggedIn(Boolean(sessionStorage.getItem('user')));
  }, []);

  /**
   * 이벤트 디테일 포스터 URL의 길이를 기반으로 슬라이더 설정을 반환
   * @type {object}
   */
  const settings = useMemo(() => ({
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: eventDetail.poster_url.length > 2 ? 3 : eventDetail.poster_url.length,
    slidesToScroll: eventDetail.poster_url.length > 2 ? 3 : eventDetail.poster_url.length,
  }), [eventDetail.poster_url.length]);

  /**
   * 선택한 이벤트에 참여
   * API 요청 후, 응답에 따라 적절한 액션을 수행
   */
  const entryEvent = async () => {
    try {
      const res = await enterEvent(eventDetail._id);

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

  return (
    <>
      <div className='w-[90%] min-h-screen mx-auto mt-20 flex flex-col gap-12'>
        <div className='flex justify-center w-full'>
          <h1 className='font-bold text-5xl mb-5 xs:text-4xl'>{t('common:Event')}</h1>
        </div>
        <div className='w-full flex justify-between items-center border-b'>
          <p className='mb-3 font-bold text-2xl sm:text-lg xs:text-base'>{eventDetail.title}</p>
          <div className='flex items-center text-center gap-6 sm:gap-2 xs:gap-1 font-semibold text-xl sm:text-sm xs:text-xs mb-3 sm:mb-2 xs:mb-1'>
            <p className='cursor-pointer hover:underline'>
              {eventDetail.host_id.name}
            </p>
            <p>{eventDetail.updated_at.split('T')[0]} {eventDetail.updated_at.substring(11, 19)}</p>
            <p>{eventDetail.view.count}</p>
          </div>
        </div>
        <div className='w-[90%] max-h-full flex items-center justify-center gap-2 whitespace-pre-wrap'>
          <div className='w-[60%] h-[60%] mx-auto mb-10'>
            <div className="w-full h-full flex justify-center items-center">
              {Array.isArray(eventDetail.poster_url)
                ? eventDetail.poster_url.length === 0 ? (
                  null
                ) : eventDetail.poster_url.length <= 2 ? (
                  eventDetail.poster_url.map((media, index) => (
                    <div key={index} className="w-full h-full flex justify-center">
                      <Image src={media} width={400} height={100} key={index} alt='post media' />
                    </div>
                  ))
                ) : (
                  <Slider {...settings} className='relative w-full h-full flex justify-center items-center'>
                    {eventDetail.poster_url.map((media, index) => (
                      <div key={index} className="w-full h-full">
                        <img src={media} className='w-full h-full object-contain' key={index} alt='post media' />
                      </div>
                    ))}
                  </Slider>
                )
                : typeof eventDetail.poster_url === 'string' && (
                  <Image src={eventDetail.poster_url} width={400} height={100} alt='post media' />
                )
              }
            </div>
          </div>
          <div className='flex flex-col justify-center gap-6 mx-auto'>
            <p className=''>
              <span className='font-bold text-lg'>활동 내용: </span>
              <br />{eventDetail.content}
            </p>
            <p className=''>
              <span className='font-bold text-lg'>활동 장소: </span>
              {eventDetail.location}
            </p>
            <p className=''>
              <span className='font-bold text-lg'>진행 기간: </span>
              <br />{eventDetail.event_start_at.split('T')[0]} {eventDetail.event_start_at.substring(11, 16)} 
              ~ {eventDetail.event_end_at.split('T')[0]} {eventDetail.event_end_at.substring(11, 16)}
            </p>
            <p className=''>
              <span className='font-bold text-lg'>모집 기간: </span>
              <br />{eventDetail.recruitment_start_at.split('T')[0]} {eventDetail.recruitment_start_at.substring(11, 16)} ~ {eventDetail.recruitment_end_at.split('T')[0]} {eventDetail.recruitment_end_at.substring(11, 16)}
            </p>
            <p className=''>
              <span className='font-bold text-lg'>모집 방법: </span>
              <br />{eventDetail.event_type === 'fcfs' ? '선착순' : '추첨'}
            </p>
            <p className=''>
              <span className='font-bold text-lg'>총 모집 인원: </span>
              {eventDetail.capacity}
            </p>
            <p className=''>
              <span className='font-bold text-lg'>모집 가능 인원: </span>
              {eventDetail.remaining}
            </p>
          </div>
        </div>
        <div className='w-full flex gap-3 xs:gap-2 justify-end my-6'>
          {userData?.events?.some(eventData => eventData._id === eventDetail._id) ? (
            <button className='
                w-[5%]
                lg:w-[15%]
                md:w-[15%]
                sm:w-[25%]
                xs:w-[30%] 
                border 
                rounded-2xl 
                xs:rounded-lg
                p-2
                lg:p-2
                md:p-2
                sm:p-2 
                xs:p-1
                text-white 
                xs:text-sm
                transition 
                duration-300
                text-center
                bg-yellow-500'
              disabled>
              {t('common:Completed application')}
            </button>
          ) : (
            <button className={`
              w-[5%]
              lg:w-[15%]
              md:w-[15%]
              sm:w-[25%]
              xs:w-[30%] 
              border 
              rounded-2xl 
              xs:rounded-lg
              p-2
              lg:p-2
              md:p-2
              sm:p-2 
              xs:p-1
              text-white 
              xs:text-sm
              transition 
              duration-300
              text-center
              ${eventDetail.status !== 'recruiting' ? 'bg-yellow-500' : 'bg-main-yellow hover:bg-yellow-500 '}`}
              disabled={!isLoggedIn || eventDetail.status !== 'recruiting'}
              onClick={isLoggedIn ? entryEvent : undefined}>
              {t('common:Entry')}
            </button>
          )}
          <Link href='/posts/events'
            className='
            w-[5%]
            lg:w-[15%]
            md:w-[15%]
            sm:w-[25%]
            xs:w-[30%] 
            border 
            rounded-2xl 
            xs:rounded-lg
            p-3
            sm:p-2 
            xs:p-1
            bg-main-green 
            text-white 
            xs:text-sm
            hover:bg-green-600 
            transition 
            duration-300
            text-center'>
            <button>
              {t('common:List')}
            </button>
          </Link>
        </div>
        <Comments postDetailId={eventDetail._id} comments={comments} />
      </div>
    </>
  )
}

export default EventDetail;