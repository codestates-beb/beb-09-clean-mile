import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { StaticImageData } from 'next/image';
import { MdOutlineArrowForwardIos } from 'react-icons/md';
import { SearchInput, hero_img, insta_icon, insta_logo, google_logo, logo } from '../Reference';
import { Post } from '../Interfaces';

const Review = ({ reviewList, lastId }: { reviewList: Post[], lastId: string }) => {
  const router = useRouter();
  /**
   * Intersection observer 인스턴스.
   * @type {React.MutableRefObject<IntersectionObserver|null>}
   */
  const observer = useRef<IntersectionObserver | null>(null);
  const [filter, setFilter] = useState<'newest' | 'oldest'>('newest');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * 마지막 포스트 엘리먼트에 대한 참조와 관련된 콜백 함수.
   * 해당 노드가 Intersection Observer에 의해 관찰되면 페이지 상태를 증가시킴.
   *
   * @param {HTMLDivElement | null} node - 마지막 포스트 엘리먼트.
   */
  const lastPostElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          setPage(prevPage => prevPage + 1);
        }
      })
      if (node) observer.current.observe(node);
    },
    []
  );

  /**
   * 필터 변경을 처리하는 함수.
   *
   * @param {React.ChangeEvent<HTMLSelectElement>} event - 발생한 이벤트.
   */
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as 'newest' | 'oldest';
    setFilter(value);
  };

  return (
    <div className='w-full flex flex-col justify-center gap-12 px-24 md:px-12 sm:px-2 xs:px-2 py-14 lg:py-12 md:py-6 sm:py-6 xs:py-3'>
      <h1 className='font-bold text-5xl lg:text-4xl md:text-3xl sm:text-2xl xs:text-xl text-center'>
        Review
      </h1>
      <div className='flex flex-col items-center gap-12 w-full min-h-screen'>
        <SearchInput />
        <div className='w-full flex justify-end gap-4'>
          <select className="border border-black py-2 px-4 pr-7 rounded-md text-sm" onChange={handleFilterChange}>
            <option className="text-sm xs:text-xs py-2" value="newest">최신 순</option>
            <option className="text-sm xs:text-xs py-2" value="oldest">오래된 순</option>
          </select>
          <Link className='
            w-[10%] sm:w-[20%] xs:w-[20%] flex items-center justify-center border rounded-lg py-2 xs:py-3 px-6 sm:px-2 xs:px-1 sm:text-sm xs:text-xs bg-main-blue text-white hover:bg-blue-600 transition duration-300'
            href='/posts/review/create'>
            <button className='w-full flex justify-center items-center text-center' type="button">
              Write
            </button>
          </Link>
        </div>
        <div className='w-full grid grid-cols-5 gap-12 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-3 xs:grid-cols-3 lg:gap-18 md:gap-14 sm:gap-6 xs:gap-2'>
          {reviewList.map((item, i) => {
            return (
              <div className="
              w-full
              max-h-[100%]
              bg-white 
              shadow-lg 
              border 
              rounded-3xl 
              sm:rounded-xl
              xs:rounded-lg
              transform 
              transition-transform 
              duration-300 
              hover:-translate-y-2 
              cursor-pointer"
              key={i}
              onClick={() => router.push(`/posts/review/${item._id}`)}>
              <div className='border-b-2 relative pb-[65%] sm:pb-[90%] xs:pb-[90%]'>
                <Image
                  className='rounded-t-3xl'
                  src={item.media.img[0]}
                  layout='fill'
                  objectFit='cover'
                  alt='event poster'
                />
              </div>
              <div className='flex flex-col px-6 sm:px-2 xs:px-2 py-4 sm:py-8 xs:py-6 gap-6 sm:gap-8'>
                <div className='flex lg:flex-col md:flex-col sm:flex-col xs:flex-col justify-between sm:justify-center xs:justify-center items-center sm:items-center xs:items-center sm:gap-2 xs:gap-4 h-[80px] md:h-[100px] xs:h-[30px]'>
                  <p className='text-lg font-bold hover:underline sm:text-lg xs:text-sm'>
                    {item.title}
                  </p>
                  <h2 className="text-lg font-semibold hover:underline sm:text-lg xs:text-sm" onClick={() => router.push(`/user/profile`)}>
                    {item.user_id.nickname}
                  </h2>
                </div>
                <p className="text-gray-700 font-semibold lg:text-sm sm:text-xs xs:text-xs overflow-ellipsis overflow-hidden h-[20px] whitespace-nowrap">
                  {item.content}
                </p>
                <button className='
                  w-3/5 
                  lg:w-full 
                  md:w-full 
                  sm:w-full 
                  xs:w-full 
                  flex 
                  items-center 
                  justify-around 
                  gap-6 
                  lg:gap-4 
                  md:gap-4 
                  sm:gap-2 
                  xs:gap-2 
                  bg-main-blue 
                  hover:bg-blue-600 
                  rounded-xl 
                  lg:rounded-lg 
                  px-3 
                  lg:px-2 
                  md:px-2 
                  sm:px-2 
                  xs:px-2 
                  py-2 
                  lg:py-1 
                  md:py-1 
                  sm:py-1 
                  xs:py-1 
                  text-white 
                  lg:text-sm 
                  md:text-sm 
                  sm:text-sm 
                  font-semibold 
                  transition 
                  duration-300'
                  onClick={() => router.push(`/posts/review/${item._id}`)}>
                  Read more
                  <MdOutlineArrowForwardIos size={20} className='rounded-xl w-[10%]' />
                </button>
              </div>
            </div>
            )
          })}
          {isLoading && (
            <div className="flex justify-center items-center my-5">
              로딩 중...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Review;