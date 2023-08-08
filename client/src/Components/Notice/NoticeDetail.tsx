import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import Image from 'next/image';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { PostDetail, Comment } from '../../Components/Interfaces';
import { Comments } from '../../Components/Reference';

type Media = {
  type: 'image' | 'video';
  url: string;
};

const NoticeDetail = ({ noticeDetail, comments }: { noticeDetail: PostDetail, comments: Comment[] }) => {
  const { t } = useTranslation('common');

  const allMedia: Media[] = [
    ...noticeDetail.media.img.map(i => ({ type: 'image' as const, url: i })),
    ...noticeDetail.media.video.map(v => ({ type: 'video' as const, url: v }))
  ];
  

  const settings = useMemo(() => ({
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: allMedia.length > 2 ? 3 : allMedia.length,
    slidesToScroll: allMedia.length > 2 ? 3 : allMedia.length,
  }), [allMedia.length]);

  return (
    <>
      <div className='w-[90%] min-h-screen mx-auto mt-20 flex flex-col gap-12'>
        <div className='flex justify-center w-full'>
          <h1 className='font-bold text-5xl mb-5 xs:text-4xl'>{t('common:Notice')}</h1>
        </div>
        <div className='w-full flex justify-between items-center border-b'>
          <p className='mb-3 font-bold text-2xl xs:text-xl'>{noticeDetail.title}</p>
          <div className='flex items-center gap-8 xs:gap-6 font-semibold text-xl xs:text-sm mb-3 xs:mb-1'>
            <p className='cursor-pointer hover:underline'>
              {noticeDetail.user_id.nickname}
            </p>
            <p>
              {noticeDetail.updated_at.split('T')[0]} {noticeDetail.updated_at.substring(11, 19)}
            </p>
          </div>
        </div>
        <div className='w-full max-h-full flex flex-col whitespace-pre-wrap relative'>
          <div className='w-[90%] h-[90%] mx-auto mb-10'>
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
            {noticeDetail.content}
          </div>
        </div>
        <Comments postDetailId={noticeDetail._id} comments={comments} />
        <div className='w-full flex gap-3 xs:gap-2 justify-end my-16'>
          <Link href='/notice'
            className='
            w-[15%]
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
      </div>
    </>
  )
}

export default NoticeDetail;