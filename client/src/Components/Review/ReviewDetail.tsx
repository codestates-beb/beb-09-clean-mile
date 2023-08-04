import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { AxiosError } from 'axios';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { PostDetail, Comment, UserInfo } from '../Interfaces';
import { ApiCaller } from '../Utils/ApiCaller';
import { Comments } from '../Reference';

const ReviewDetail = ({ reviewDetail, comments }: { reviewDetail: PostDetail, comments: Comment[] }) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const settings = useMemo(() => ({
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: reviewDetail?.media.img.length > 2 ? 3 : reviewDetail?.media.img.length,
    slidesToScroll: reviewDetail?.media.img.length > 2 ? 3 : reviewDetail?.media.img.length,
  }), [reviewDetail?.media.img.length]);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem('user')) {
      const userCache = JSON.parse(sessionStorage.getItem('user') || '');
      setIsLoggedIn(userCache !== null);
      setUserInfo(userCache.queries[0]?.state.data)
    }
  }, []);

  const postDelete = async () => {
    Swal.fire({
      title: '삭제 하시겠습니까?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#6BCB77',
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#FF6B6B'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/delete/${reviewDetail._id}`;
          const dataBody = null;
          const isJSON = false;
          const headers = {};
          const isCookie = true;

          const res = await ApiCaller.delete(URL, dataBody, isJSON, headers, isCookie);
          if (res.status === 200) {
            Swal.fire({
              title: 'Success!',
              text: res.data.message,
              icon: 'success',
              confirmButtonText: 'OK',
              confirmButtonColor: '#6BCB77'
            }).then(() => {
              Swal.close();
              router.reload();
            });

          } else {
            Swal.fire({
              title: 'Error',
              text: res.data.message,
              icon: 'error',
              confirmButtonText: 'OK',
              confirmButtonColor: '#6BCB77'
            }).then(() => {
              Swal.close();
            });
          }
        } catch (error) {
          const err = error as AxiosError;

          const data = err.response?.data as { message: string };

          Swal.fire({
            title: 'Error',
            text: data?.message,
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#6BCB77'
          }).then(() => {
            Swal.close();
          });
        }
      } else if (result.isDismissed) {
        Swal.fire({
          title: 'Success!',
          text: '게시글 삭제를 취소하셨습니다.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#6BCB77',
        })
      }
    })
  }
  return (
    <>
      <div className='w-[90%] min-h-screen mx-auto mt-20 flex flex-col gap-12'>
        <div className='flex justify-center w-full'>
          <h1 className='font-bold text-5xl mb-5 xs:text-4xl'>Review</h1>
        </div>
        <div className='w-full flex justify-between items-center border-b'>
          <p className='mb-3 font-bold text-2xl xs:text-xl'>{reviewDetail.title}</p>
          <div className='flex items-center gap-6 xs:gap-6 font-semibold text-xl xs:text-sm mb-3 xs:mb-1'>
            <p className='cursor-pointer hover:underline' onClick={() => router.push(`/user/profile`)}>
              {reviewDetail.user_id.nickname}
            </p>
            <p>{reviewDetail.updated_at.split('T')[0]} {reviewDetail.updated_at.substring(11, 19)}</p>
            <p>{reviewDetail.view?.count}</p>
          </div>
        </div>
        <div className='w-full max-h-full flex flex-col whitespace-pre-wrap'>
          <div className='w-[60%] h-[60%] mx-auto mb-10'>
            {reviewDetail.media.img.length === 0 ? (
              null
            ) : reviewDetail.media.img.length <= 2 ? (
              reviewDetail.media.img.map((media, index) => (
                <div key={index} className="w-full h-full flex justify-center">
                  <Image src={media} width={400} height={100} key={index} alt='post media' />
                </div>
              ))
            ) : (
              <Slider {...settings} className='relative w-full h-full flex justify-center items-center'>
                {reviewDetail.media.img.map((media, index) => (
                  <div key={index} className="w-full h-full">
                    <img src={media} className='w-full h-full object-contain' key={index} alt='post media'/>
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
          {isLoggedIn && userInfo?._id === reviewDetail.user_id._id ? (
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
                Delete
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
                  Edit
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
                  List
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
                List
              </button>
            </Link>
          )}
        </div>
      </div>
    </>
  )
}

export default ReviewDetail;