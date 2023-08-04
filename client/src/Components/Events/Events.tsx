import React, { useCallback, useRef } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useRouter } from 'next/router';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import { MdOutlineArrowForwardIos } from 'react-icons/md';
import { SearchInput } from '../Reference';
import { EventList } from '../Interfaces';
import { ApiCaller } from '../Utils/ApiCaller';

const Events = ({ eventList, lastId }: { eventList: EventList[], lastId: string }) => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const getClassNameForStatus = (status: string) => {
    switch (status) {
      case 'created': return 'bg-main-insta';
      case 'recruiting': return 'bg-main-blue';
      case 'progressing': return 'bg-main-green';
      case 'finished': return 'bg-main-red';
      case 'canceled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  }

  const fetchEvents = async ({ pageParam = lastId }) => {
    let URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/events/list?last_id=${pageParam}`;

    const res = await ApiCaller.get(URL, null, false, {}, true);
    console.log(res.data)
    if (res.status === 200 && res.data.data.data) {
      return res.data.data.data;
    }
    throw new Error('Error fetching data');
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteQuery('events', fetchEvents, {
    getNextPageParam: (lastPage, allPages) => {
      const lastItem = lastPage[lastPage.length - 1];
      return lastItem ? lastItem._id : null;
    }
  });
  
  const observer = useRef();
  const lastElementRef = useCallback(
    (node) => {
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

  // 필터 변경 핸들러
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`/events/list?status=${e.target.value}`);
  };

  return (
    <div className='w-full flex flex-col justify-center gap-12 px-24 sm:px-2 xs:px-2 py-14 lg:py-12 md:py-6 sm:py-6 xs:py-3'>
      <h1 className='font-bold text-5xl lg:text-4xl md:text-3xl sm:text-2xl xs:text-xl text-center'>
        {t('common:Events')}
      </h1>
      <div className='flex flex-col items-center gap-24 w-full min-h-screen'>
        <div className='w-full'>
          <div className='flex justify-end mb-3'>
            <SearchInput />
            <select className="border border-black py-2 px-4 pr-7 rounded-md text-sm" onChange={handleFilterChange}>
              <option className="text-sm xs:text-xs" value="created">{t('common:Before proceeding')}</option>
              <option className="text-sm xs:text-xs" value="recruiting">{t('common:Recruiting')}</option>
              <option className="text-sm xs:text-xs" value="progressing">{t('common:In progress')}</option>
              <option className="text-sm xs:text-xs" value="finished">{t('common:End of progress')}</option>
              <option className="text-sm xs:text-xs" value="canceled">{t('common:Cancel Progress')}</option>
            </select>
          </div>
        </div>
        <div className='w-full grid grid-cols-5 gap-12 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-3 xs:grid-cols-3 lg:gap-18 md:gap-14 sm:gap-6 xs:gap-2'>
          {eventList.map((item, i) => {
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
                  ref={lastElementRef}
                  onClick={() => router.push(`/posts/events/${item._id}`)}>
                  <div className='border-b-2 relative pb-[65%] sm:pb-[90%] xs:pb-[90%]'>
                    <Image
                      className='rounded-t-3xl object-cover'
                      src={item.poster_url[0]}
                      layout='fill'
                      alt='event poster'
                    />
                  </div>
                  <div className='flex flex-col px-6 sm:px-2 xs:px-2 py-4 gap-6'>
                    <div className='flex lg:flex-col md:flex-col sm:flex-col xs:flex-col justify-between sm:justify-center xs:justify-center items-center sm:items-center xs:items-center sm:gap-2 xs:gap-4 h-[80px] md:h-[100px] xs:h-[30px]'>
                      <h2 className="text-lg font-bold hover:underline sm:text-lg xs:text-sm">{item.title}</h2>
                      <p className={`text-md font-bold sm:text-xs xs:text-xs text-white rounded-lg sm:rounded-md xs:rounded-md px-1 ${getClassNameForStatus(item.status)}`}>
                        {(() => {
                          switch (item.status) {
                            case 'created': return t('common:Before proceeding');
                            case 'recruiting': return t('common:Recruiting');
                            case 'progressing': return t('common:In progress');
                            case 'finished': return t('common:End of progress');
                            case 'canceled': return t('common:Cancel Progress');
                            default: return t('common:Unknown');
                          }
                        })()}
                      </p>
                    </div>
                    <p className="text-gray-700 font-semibold lg:text-sm sm:text-xs xs:text-xs overflow-ellipsis overflow-hidden h-[20px] whitespace-nowrap">{item.content}</p>
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
                    xs:px-1 
                    py-2 
                    lg:py-1 
                    md:py-1 
                    sm:py-1 
                    xs:py-1 
                    text-white 
                    lg:text-sm 
                    md:text-sm 
                    sm:text-xs 
                    xs:text-xs 
                    font-semibold 
                    transition 
                    duration-300'
                    onClick={() => router.push(`/posts/events/${item._id}`)}>
                      {t('common:Read more')}
                      <MdOutlineArrowForwardIos size={20} className='rounded-xl w-[10%]' />
                    </button>
                  </div>
                </div>
            )
          })}
          {data?.pages.map((group, i) => (
            group.map((item, i) => {
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
                  ref={lastElementRef}
                  onClick={() => router.push(`/posts/events/${item._id}`)}>
                  <div className='border-b-2 relative pb-[65%] sm:pb-[90%] xs:pb-[90%]'>
                    <Image
                      className='rounded-t-3xl object-cover'
                      src={item.poster_url[0]}
                      layout='fill'
                      alt='event poster'
                    />
                  </div>
                  <div className='flex flex-col px-6 sm:px-2 xs:px-2 py-4 gap-6'>
                    <div className='flex lg:flex-col md:flex-col sm:flex-col xs:flex-col justify-between sm:justify-center xs:justify-center items-center sm:items-center xs:items-center sm:gap-2 xs:gap-4 h-[80px] md:h-[100px] xs:h-[30px]'>
                      <h2 className="text-lg font-bold hover:underline sm:text-lg xs:text-sm">{item.title}</h2>
                      <p className={`text-md font-bold sm:text-xs xs:text-xs text-white rounded-lg sm:rounded-md xs:rounded-md px-1 ${getClassNameForStatus(item.status)}`}>
                        {(() => {
                          switch (item.status) {
                            case 'created': return t('common:Before proceeding');
                            case 'recruiting': return t('common:Recruiting');
                            case 'progressing': return t('common:In progress');
                            case 'finished': return t('common:End of progress');
                            case 'canceled': return t('common:Cancel Progress');
                            default: return t('common:Unknown');
                          }
                        })()}
                      </p>
                    </div>
                    <p className="text-gray-700 font-semibold lg:text-sm sm:text-xs xs:text-xs overflow-ellipsis overflow-hidden h-[20px] whitespace-nowrap">{item.content}</p>
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
                    xs:px-1 
                    py-2 
                    lg:py-1 
                    md:py-1 
                    sm:py-1 
                    xs:py-1 
                    text-white 
                    lg:text-sm 
                    md:text-sm 
                    sm:text-xs 
                    xs:text-xs 
                    font-semibold 
                    transition 
                    duration-300'
                    onClick={() => router.push(`/posts/events/${item._id}`)}>
                      {t('common:Read more')}
                      <MdOutlineArrowForwardIos size={20} className='rounded-xl w-[10%]' />
                    </button>
                  </div>
                </div>
              )
            })
          ))}
        </div>
      </div>
    </div>
  )
}

export default Events;