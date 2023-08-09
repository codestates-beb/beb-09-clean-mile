import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import Swal from 'sweetalert2';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import { PostDetail, Comment, User } from '../Interfaces';
import { Comments } from '../Reference';
import { showSuccessAlert, showErrorAlert } from '@/Redux/actions';
import { useUserSession } from '@/hooks/useUserSession';
import { userPostDelete } from '@/services/api';

type Media = {
  type: 'image' | 'video';
  url: string;
};

const ReviewDetail = ({ reviewDetail, comments }: { reviewDetail: PostDetail, comments: Comment[] }) => {
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
   * 게시물의 모든 미디어를 합치기 위한 배열
   * 이미지와 비디오를 포함하며 각각의 미디어 타입에 따라 구분
   * @type {Media[]}
   */
  const allMedia: Media[] = [
    ...reviewDetail.media.img.map(i => ({ type: 'image' as const, url: i })),
    ...reviewDetail.media.video.map(v => ({ type: 'video' as const, url: v }))
  ];
  
  /**
   * 슬라이드 설정을 위한 useMemo 훅
   * 전체 미디어의 수에 따라 슬라이드를 보여주는 설정을 결정
   */
  const settings = useMemo(() => ({
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: allMedia.length > 2 ? 3 : allMedia.length,
    slidesToScroll: allMedia.length > 2 ? 3 : allMedia.length,
  }), [allMedia.length]);

  /**
   * 게시물 삭제를 확인하는 함수
   * SweetAlert2를 사용하여 사용자에게 삭제를 확인하는 팝업을 표시
   * @returns {Promise<SweetAlertResult<any>>} 삭제를 진행할지 또는 취소할지에 대한 사용자의 결정.
   */
  const confirmDelete = () => {
    return Swal.fire({
      title: t('common:Are you sure you want to delete it'),
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#6BCB77',
      cancelButtonText: t('common:Cancel'),
      cancelButtonColor: '#FF6B6B'
    });
  }

  /**
   * 실제로 게시물을 삭제하는 함수
   * @returns {Promise<any>} 삭제 응답 데이터.
   */
  const performDelete = async () => {
    const res = await userPostDelete(reviewDetail._id);

    if (res.status === 200) {
      dispatch(showSuccessAlert(res.data.message));
      router.replace('/posts/review');
    } else {
      dispatch(showErrorAlert(res.data.message));
    }

    return res.data.data;
  }

  /**
   * 게시물 삭제를 처리하는 함수
   * 삭제를 확인한 후 실제 삭제를 수행하고, 그 결과에 따라 알림을 표시 
   */
  const postDelete = async () => {
    const result = await confirmDelete();

    if (result.isConfirmed) {
      try {
        await performDelete();
      } catch (error) {
        const err = error as AxiosError;

        const data = err.response?.data as { message: string };

        dispatch(showErrorAlert(data?.message));
      }
    } else if (result.isDismissed) {
      dispatch(showSuccessAlert(t('common:You have cancelled deleting the post')));
    }
  }

  /**
   * 사용자 프로필 페이지로 이동하는 함수
   * 게시물 작성자의 프로필을 확인하거나, 자신의 프로필 페이지로 리디렉션
   */
  const handleProfile = () => {
    if (reviewDetail.user_id === null) {
      dispatch(showErrorAlert(t('common:User does not exist')));
    } else {
      if (reviewDetail.user_id._id === userData?.user._id) {
        router.push(`/users/mypage`)
      } else {
        router.push(`/users/profile?id=${reviewDetail.user_id._id}`)
      }
    }
  }

  return (
    <>
      <div className='w-[90%] min-h-screen mx-auto mt-20 flex flex-col gap-12'>
        <div className='flex justify-center w-full'>
          <h1 className='font-bold text-5xl mb-5 xs:text-4xl'>{t('common:Review')}</h1>
        </div>
        <div className='w-full flex justify-between items-center border-b'>
          <p className='mb-3 font-bold text-2xl xs:text-xl'>{reviewDetail.title}</p>
          <div className='flex items-center gap-6 xs:gap-6 font-semibold text-xl xs:text-sm mb-3 xs:mb-1'>
            <p className='cursor-pointer hover:underline' onClick={handleProfile}>
              {reviewDetail.user_id === null ? 'Unknown' : reviewDetail.user_id.nickname}
            </p>
            <p>{reviewDetail.updated_at.split('T')[0]} {reviewDetail.updated_at.substring(11, 19)}</p>
            <p>{reviewDetail.view?.count}</p>
          </div>
        </div>
        <div className='w-full max-h-full flex flex-col whitespace-pre-wrap'>
          <div className='w-[60%] h-[60%] mx-auto mb-10'>
            {allMedia.length === 0 ? (
              null
            ) : allMedia.length <= 2 ? (
              allMedia.map((media, index) => (
                <div key={index} className="w-full h-full flex justify-center">
                  {media.type === 'video' ? (
                    <video width="400" height="100" controls>
                      <source src={media.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <Image src={media.url} width={400} height={100} key={index} alt='media' />
                  )}
                </div>
              ))
            ) : (
              <Slider {...settings} className='w-full h-full flex justify-center items-center'>
                {allMedia.map((media, index) => (
                  <div key={index} className="w-full h-full">
                    {media.type === 'video' ? (
                      <video className='w-full h-full object-contain' controls>
                        <source src={media.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img src={media.url} className='w-full h-full object-contain' key={index} alt='media' />
                    )}
                  </div>
                ))}
              </Slider>
            )}
          </div>
          <div>
            <p>{reviewDetail.content}</p>
          </div>
        </div>
        <Comments postDetailId={reviewDetail._id} comments={comments} />
        <div className='w-full flex gap-3 xs:gap-2 justify-end my-16'>
          {isLoggedIn && userData?.user._id === reviewDetail.user_id._id ? (
            <>
              <button className='
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
                bg-main-red 
                text-white 
                xs:text-sm
                hover:bg-red-500 
                transition 
                duration-300
                text-center'
                onClick={postDelete}>
                {t('common:Delete')}
              </button>
              <Link
                href={`/posts/review/edit/${reviewDetail._id}`}
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
                  bg-main-blue 
                  text-white 
                  xs:text-sm
                  hover:bg-blue-600 
                  transition 
                  duration-300
                  text-center'>
                <button>
                  {t('common:Edit')}
                </button>
              </Link>
              <Link href='/posts/review'
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
            </>
          ) : (
            <Link href='/posts/general?page=1'
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
          )}
        </div>
      </div>
    </>
  )
}

export default ReviewDetail;