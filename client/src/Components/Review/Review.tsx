import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useInfiniteQuery, QueryFunctionContext } from 'react-query';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { MdOutlineArrowForwardIos } from 'react-icons/md';
import { SearchInput } from '../Reference';
import { Post, User } from '../Interfaces';
import { useUserSession } from '@/hooks/useUserSession';
import { fetchReviews } from '@/services/api';

interface Item {
  _id: string;
  media: {
    img: string[];
    video: string[];
  };
  title: string;
  user_id: {
    _id: string;
    nickname: string;
  };
  content: string;
}

interface FetchReviewParams extends QueryFunctionContext<'reviews'> {
  pageParam: string;
  title?: string | undefined;
  content?: string | undefined;
  filter?: string | undefined;
}


const Review = () => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const [filter, setFilter] = useState<string | undefined>(undefined);

  const searchType = router.query.title ? 'title' : router.query.content ? 'content' : null;
  const searchTerm = searchType ? router.query[searchType] as string : '';

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    refetch
  } = useInfiniteQuery('reviews',
    ({ pageParam = 'null' }) => fetchReviews({
      pageParam: pageParam,
      title: searchType === 'title' ? searchTerm : undefined,
      content: searchType === 'content' ? searchTerm : undefined,
      filter: filter
    } as FetchReviewParams),
    {
      getNextPageParam: (lastPage) => lastPage.last_id,
      enabled: true
    }
  );

  useEffect(() => {
    refetch();
  }, [searchTerm, searchType, filter, refetch]);

  const observer = useRef<IntersectionObserver | null>();
  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading || isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]  // 의존성 업데이트
  );

  const hasData = data?.pages.some(page => page.data?.length > 0);


  // 필터 변경 핸들러
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setFilter(selectedValue);
  };
  

  return (
    <div className='w-full flex flex-col justify-center gap-12 px-24 md:px-12 sm:px-2 xs:px-2 py-14 lg:py-12 md:py-6 sm:py-6 xs:py-3'>
      <h1 className='font-bold text-5xl lg:text-4xl md:text-3xl sm:text-2xl xs:text-xl text-center'>
        {t('common:Review')}
      </h1>
      <div className='flex flex-col items-center gap-12 w-full min-h-screen'>
        <SearchInput />
        <div className='w-full flex justify-end gap-4'>
          <select className="border border-black py-2 px-4 pr-7 rounded-md text-sm" onChange={handleFilterChange}>
            <option className="text-sm xs:text-xs" value="desc">{t('common:Latest order')}</option>
            <option className="text-sm xs:text-xs" value="asc">{t('common:Old order')}</option>
            <option className="text-sm xs:text-xs" value="view">{t('common:View order')}</option>
          </select>
          <Link className='
            w-[10%] sm:w-[20%] xs:w-[20%] flex items-center justify-center border rounded-lg py-2 xs:py-3 px-6 sm:px-2 xs:px-1 sm:text-sm xs:text-xs bg-main-blue text-white hover:bg-blue-600 transition duration-300'
            href='/posts/create'>
            <button className='w-full flex justify-center items-center text-center' type="button">
              {t('common:Write')}
            </button>
          </Link>
        </div>
        <div className={`w-full ${!hasData === null ? 'flex justify-center items-center' : 'grid grid-cols-5'} gap-12 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-3 xs:grid-cols-3 lg:gap-18 md:gap-14 sm:gap-6 xs:gap-2`}>
          {hasData ? (
            data?.pages.map((pageData, index) => (
              pageData.data?.map((item: Item) => (
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
                  onClick={() => router.push(`/posts/review/${item._id}`)}>
                  <div className='border-b-2 relative pb-[65%] sm:pb-[90%] xs:pb-[90%]'>
                    <Image
                      className='rounded-t-3xl object-cover'
                      src={item.media.img[0]}
                      layout='fill'
                      alt='event poster'
                    />
                  </div>
                  <div className='flex flex-col px-6 sm:px-2 xs:px-2 py-4 sm:py-8 xs:py-6 gap-6 sm:gap-8'>
                    <div className='flex lg:flex-col md:flex-col sm:flex-col xs:flex-col justify-between sm:justify-center xs:justify-center items-center sm:items-center xs:items-center sm:gap-2 xs:gap-4 h-[80px] md:h-[100px] xs:h-[30px]'>
                      <p className='text-lg font-bold hover:underline sm:text-lg xs:text-sm'>
                        {item.title}
                      </p>
                      <h2 className="text-lg font-semibold hover:underline sm:text-lg xs:text-sm" onClick={() => router.push(`/user/profile`)}>
                        {item.user_id === null ? t('common:Unknown') : item.user_id.nickname}
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
                      {t('common:Read more')}
                      <MdOutlineArrowForwardIos size={20} className='rounded-xl w-[10%]' />
                    </button>
                  </div>
                </div>
              ))
            ))
          ) : (
            <div className="flex justify-center items-center w-full h-full mx-auto">
              <p>{t('common:There are no registered posts')}</p>
            </div>
          )}
          <div ref={lastElementRef}>
            {isFetchingNextPage && <p>Loading...</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Review;