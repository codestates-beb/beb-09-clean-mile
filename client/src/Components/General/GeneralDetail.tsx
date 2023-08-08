import React, { useState, useEffect, useMemo } from 'react';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import Image from 'next/image';
import Swal from 'sweetalert2';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch } from 'react-redux';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { PostDetail, Comment, User } from '../Interfaces';
import { Comments } from '../Reference';
import { showSuccessAlert, showErrorAlert } from '@/Redux/actions';
import { useUserSession } from '@/hooks/useUserSession';
import { userPostDelete } from '@/services/api'

type Media = {
  type: 'image' | 'video';
  url: string;
};

const GeneralDetail = ({ postDetail, comments }: { postDetail: PostDetail, comments: Comment[] }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { userData } = useUserSession();
  const { t } = useTranslation('common');

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(sessionStorage.getItem('user')));
  }, []);

  const allMedia: Media[] = [
    ...postDetail.media.img.map(i => ({ type: 'image' as const, url: i })),
    ...postDetail.media.video.map(v => ({ type: 'video' as const, url: v }))
  ];


  const settings = useMemo(() => ({
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: allMedia.length > 2 ? 3 : allMedia.length,
    slidesToScroll: allMedia.length > 2 ? 3 : allMedia.length,
  }), [allMedia.length]);

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

  const performDelete = async () => {
    const res = await userPostDelete(postDetail._id);

    if (res.status === 200) {
      dispatch(showSuccessAlert(res.data.message));
      router.replace('/posts/general');
    } else {
      dispatch(showErrorAlert(res.data.message));
    }

    return res.data.data;
  }

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

  const handleProfile = () => {
    if (postDetail.user_id === null) {
      Swal.fire({
        title: t('common:Error'),
        text: t('common:User does not exist'),
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#6BCB77'
      }).then(() => {
        Swal.close();
      });
    } else {
      if (postDetail.user_id._id === userData?.user._id) {
        router.push(`/users/mypage`)
      } else {
        router.push(`/users/profile?id=${postDetail.user_id._id}`)
      }
    }
  }

  return (
    <>
      <div className='w-[90%] min-h-screen mx-auto mt-20 flex flex-col gap-12'>
        <div className='flex justify-center w-full'>
          <h1 className='font-bold text-5xl mb-5 xs:text-4xl'>{t('common:General')}</h1>
        </div>
        <div className='w-full flex justify-between items-center border-b'>
          <p className='mb-3 font-bold text-2xl xs:text-xl'>{postDetail.title}</p>
          <div className='flex items-center gap-6 xs:gap-6 font-semibold text-xl xs:text-sm mb-3 xs:mb-1'>
            <p className='cursor-pointer hover:underline' onClick={handleProfile}>
              {postDetail.user_id === null ? t('common:Unknown') : postDetail.user_id.nickname}
            </p>
            <p>{postDetail.updated_at.split('T')[0]} {postDetail.updated_at.substring(11, 19)}</p>
            <p>{postDetail.view?.count}</p>
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
            <p>{postDetail.content}</p>
          </div>
        </div>
        <Comments postDetailId={postDetail._id} comments={comments} />
        <div className='w-full flex gap-3 xs:gap-2 justify-end my-16'>
          {isLoggedIn && userData?.user._id === postDetail.user_id?._id ? (
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
                href={`/posts/general/edit/${postDetail._id}`}
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

export default GeneralDetail;