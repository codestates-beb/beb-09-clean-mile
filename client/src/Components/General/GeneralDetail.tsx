import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { AxiosError } from 'axios';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AiOutlineDelete, AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { PostDetail, Comment, UserInfo } from '../Interfaces';
import { ApiCaller } from '../Utils/ApiCaller';

const GeneralDetail = ({ postDetail, comments }: { postDetail: PostDetail, comments: Comment }) => {
  const router = useRouter();
  const [createComment, setCreateComment] = useState('');
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  console.log(comments)


  // function to toggle heart fill
  const toggleHeartFill = () => {
    setIsHeartFilled(!isHeartFilled);
  }

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: postDetail?.media.img.length > 2 ? 3 : postDetail?.media.img.length,
    slidesToScroll: postDetail?.media.img.length > 2 ? 3 : postDetail?.media.img.length,
  };

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem('user')) {
      const userCache = JSON.parse(localStorage.getItem('user') || '');
      setIsLoggedIn(userCache !== null);
      setUserInfo(userCache.queries[0].state.data)
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
          const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/delete/${postDetail._id}`;
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
              router.replace(`/users/mypage?id=${postDetail.user_id._id}`);
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
          <h1 className='font-bold text-5xl mb-5 xs:text-4xl'>General</h1>
        </div>
        <div className='w-full flex justify-between items-center border-b'>
          <p className='mb-3 font-bold text-2xl xs:text-xl'>{postDetail.title}</p>
          <div className='flex items-center gap-6 xs:gap-6 font-semibold text-xl xs:text-sm mb-3 xs:mb-1'>
            <p className='cursor-pointer hover:underline' onClick={() => router.push(`/user/profile`)}>
              {postDetail.user_id.nickname}
            </p>
            <p>{postDetail.updated_at.split('T')[0]} {postDetail.updated_at.substring(11, 19)}</p>
            <p>{postDetail.view?.count}</p>
          </div>
        </div>
        <div className='w-full max-h-full flex flex-col whitespace-pre-wrap'>
          <div className='w-[60%] h-[60%] mx-auto mb-10'>
            {postDetail.media.img.length !== 0 || postDetail.media.video.length !== 0 ? (
              <Slider {...settings} className='relative w-full h-full flex justify-center items-center'>
                {postDetail.media.img.map((media, index) => (
                  <div key={index} className="w-full h-full">
                    <Image src={media.url} layout="fill" objectFit="contain" key={index} alt='post media' />
                  </div>
                ))}
              </Slider>
            ) : (
              null
            )}
            {/* <div className="w-full h-full">
              <Image src={dummyNotice.media[0]} width={100} height={100} alt='image' />
            </div> */}
          </div>
          <div>
            {postDetail.content}
          </div>
        </div>
        <div className='w-full flex flex-col gap-4'>
          <h2 className='text-xl font-bold xs:text-base'>Comment</h2>
          {comments.length !== 0 ? (
            comments.map((comment, i) => {
              return (
                <div className='w-full grid grid-cols-2 items-center border rounded-xl p-3 sm:p-2' key={i}>
                  <div>
                    <p className='text-lg sm:text-base xs:text-xs font-semibold'>{comment.content}</p>
                  </div>
                  <div className='text-right flex justify-end gap-6 sm:gap-2 xs:gap-2'>
                    <div>
                      <p className='font-bold text-lg sm:text-sm xs:text-xs cursor-pointer hover:underline' onClick={() => router.push(`/user/profile`)}>{comment.user_id.nickname}</p>
                      <div>
                        <p className='text-sm sm:text-xs xs:text-xs'>
                          {comment.updated_at.split('T')[0]} {comment.updated_at.substring(11, 19)}
                        </p>
                      </div>
                    </div>
                    <div className='flex justify-end items-center gap-4 sm:gap-2 xs:gap-2'>
                      {
                        isHeartFilled ?
                          <AiFillHeart className='text-main-red cursor-pointer sm:w-[30%] xs:w-[30%]' size={26} onClick={toggleHeartFill} /> :
                          <AiOutlineHeart className='text-main-red cursor-pointer sm:w-[30%] xs:w-[30%]' size={26} onClick={toggleHeartFill} />
                      }
                      <AiOutlineDelete className="text-red-500 cursor-pointer sm:w-[30%] xs:w-[30%]" size={26} />
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            null
          )}
          <textarea
            className='border border-gray-300 rounded-lg p-2 w-full outline-none'
            rows={4}
            placeholder='댓글을 입력하세요.'
            value={createComment}
            onChange={(e) => setCreateComment(e.target.value)}
          />
          <div className='flex justify-end'>
            <button className='
              py-2 
              px-4
              sm:px-6 
              xs:px-6
              bg-main-blue
              text-white 
              text-lg
              sm:text-sm
              xs:text-sm
              rounded-md 
              hover:bg-blue-600 
              transition 
              duration-300
              '
            >
              Create
            </button>
          </div>
        </div>
        <div className='w-full flex gap-3 xs:gap-2 justify-end my-16'>
          {isLoggedIn && userInfo?.user._id === postDetail.user_id._id ? (
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
                href={`/posts/general/edit/1`}
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
              <Link href='/'
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
            <Link href='/'
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

export default GeneralDetail;