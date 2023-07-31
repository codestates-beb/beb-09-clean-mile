import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { AiOutlineDelete, AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { PostDetail, Comment } from '../Interfaces';

const GeneralDetail = ({ postDetail, comment }: { postDetail: PostDetail, comment: Comment }) => {
  const router = useRouter();
  const [createComment, setCreateComment] = useState('');
  const [isHeartFilled, setIsHeartFilled] = useState(false);
    console.log(postDetail, comment);

  // function to toggle heart fill
  const toggleHeartFill = () => {
    setIsHeartFilled(!isHeartFilled);
  }

  // const settings = {
  //   dots: true,
  //   infinite: false,
  //   speed: 500,
  //   slidesToShow: postDetail.post.media.img.length > 2 ? 3 : postDetail.post.media.img.length,
  //   slidesToScroll: postDetail.post.media.img.length > 2 ? 3 : postDetail.post.media.img.length,
  // };

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
            <p>{postDetail.updated_at.split('T')[0]} {postDetail.updated_at.substring(11,19)}</p>
            <p>{postDetail.view?.count}</p>
          </div>
        </div>
        <div className='w-full max-h-full flex flex-col whitespace-pre-wrap'>
          <div className='w-[60%] h-[60%] mx-auto mb-10'>
            {/* <Slider {...settings} className='relative w-full h-full flex justify-center items-center'>
              {dummyNotice.media.map((media, index) => (
                <div key={index} className="w-full h-full">
                  <Image src={media} width={100} height={100} alt='image' />
                </div>
              ))}
            </Slider> */}
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
            {comment ? (
              <>
                <div className='w-full grid grid-cols-2 items-center border rounded-xl p-3 sm:p-2'>
                  <div>
                    <p className='text-lg sm:text-base xs:text-xs font-semibold'>comment content</p>
                  </div>
                  <div className='text-right flex justify-end gap-6 sm:gap-2 xs:gap-2'>
                    <div>
                      <p className='font-bold text-lg sm:text-sm xs:text-xs cursor-pointer hover:underline' onClick={() => router.push(`/user/profile`)}>nickname</p>
                      <div>
                        <p className='text-sm sm:text-xs xs:text-xs'>comment date</p>
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
              </>
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
            >
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
        </div>
      </div>
    </>
  )
}

export default GeneralDetail;