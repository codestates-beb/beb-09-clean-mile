import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Swal from 'sweetalert2';
import useTranslation from 'next-translate/useTranslation';
import { useInfiniteQuery, QueryFunctionContext } from 'react-query';
import { useRouter } from 'next/router';
import { MdOutlineArrowForwardIos } from 'react-icons/md';
import { SearchInput } from '../Reference';
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
  /**
   * 라우터 인스턴스를 가져옴
   * @type {NextRouter}
   */
  const router = useRouter();

  /**
   * 공통 번역 훅을 사용하여 번역 함수를 가져옴
   * @type {TFunction}
   */
  const { t } = useTranslation('common');

  /**
   * 필터 상태를 관리
   * 'all'로 선택된 경우 undefined로 설정
   * @type {string | undefined}
   */
  const [filter, setFilter] = useState<string | undefined>(undefined);
  
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
   * 라우터 쿼리를 기반으로 검색 유형과 검색어를 파악
   */
  const searchType = router.query.title ? 'title' : router.query.content ? 'content' : null;
  const searchTerm = searchType ? router.query[searchType] as string : '';

  /**
   * 무한 쿼리를 사용하여 이벤트 데이터를 가져옴
   */
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

  /**
   * 필터나 검색어가 변경될 때마다 데이터를 다시 가져옴
   */
  useEffect(() => {
    refetch();
  }, [searchTerm, searchType, filter, refetch]);

  /**
   * 무한 스크롤 로직을 위한 IntersectionObserver를 설정
   */
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

  /**
   * 어떤 페이지라도 데이터가 있는지 여부를 확인
   * @type {boolean}
   */
  const hasData = data?.pages.some(page => page.data?.length > 0);


  /**
   * 드롭다운에서 필터 값을 변경할 때의 핸들러 함수
   * @param {React.ChangeEvent<HTMLSelectElement>} e - 선택 이벤트 객체
   */
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setFilter(selectedValue);
  };

  const handleButtonClick = () => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: 'warning',
        title: t('common:Warning'),
        text: t('common:You need to log in'),
        confirmButtonText: t('common:OK')
      }).then(() => {
        router.push('/login')
      });
    } else {
      router.push('/posts/create')
    }
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
          <button className='
            border 
            rounded-xl 
            py-2 
            px-10
            bg-main-blue
            text-white 
            font-semibold 
            hover:bg-blue-600
            transition-all 
            duration-300 
            text-md
            text-center'
            type='button'
            onClick={handleButtonClick}>
            {t('common:Write')}
          </button>
        </div>
        <div className={`w-full ${!hasData ? 'flex justify-center items-center' : 'grid grid-cols-5'} gap-12 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-3 xs:grid-cols-3 lg:gap-18 md:gap-14 sm:gap-6 xs:gap-2`}>
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
                      <h2 className="text-lg font-semibold hover:underline sm:text-lg xs:text-sm" onClick={() => router.push(`/users/profile?id=${item.user_id._id}`)}>
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