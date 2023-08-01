import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { StaticImageData } from 'next/image';
import { MdOutlineArrowForwardIos } from 'react-icons/md';
import { SearchInput, hero_img, insta_icon, insta_logo, google_logo, logo } from '../Reference';
import { Post, EventList } from '../Interfaces';

const Events = ({ eventList, lastId }: { eventList: EventList, lastId: string }) => {
  const router = useRouter();
  const [filter, setFilter] = useState<'newest' | 'oldest'>('newest');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getClassNameForStatus = (status) => {
    switch (status) {
      case 'created': return 'bg-main-insta';
      case 'recruiting': return 'bg-main-blue';
      case 'progressing': return 'bg-main-green';
      case 'finished': return 'bg-main-red';
      case 'canceled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  }

  return (
    <div className='w-full flex flex-col justify-center gap-12 px-24 sm:px-2 xs:px-2 py-14 lg:py-12 md:py-6 sm:py-6 xs:py-3'>
      <h1 className='font-bold text-5xl lg:text-4xl md:text-3xl sm:text-2xl xs:text-xl text-center'>
        Events
      </h1>
      <div className='flex flex-col items-center gap-24 w-full min-h-screen'>
        <div className='w-full'>
          <div className='flex justify-end mb-3'>
            <SearchInput />
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
              key={item.id}
              onClick={() => router.push(`/posts/events/${item._id}`)}>
              <div className='border-b-2 relative pb-[65%] sm:pb-[90%] xs:pb-[90%]'>
                <Image
                  className='rounded-t-3xl'
                  src={item.poster_url}
                  layout='fill'
                  objectFit='cover'
                  alt='event poster'
                />
              </div>
              <div className='flex flex-col px-6 sm:px-2 xs:px-2 py-4 gap-6'>
                <div className='flex lg:flex-col md:flex-col sm:flex-col xs:flex-col justify-between sm:justify-center xs:justify-center items-center sm:items-center xs:items-center sm:gap-2 xs:gap-4 h-[80px] md:h-[100px] xs:h-[30px]'>
                  <h2 className="text-lg font-bold hover:underline sm:text-lg xs:text-sm">{item.title}</h2>
                  <p className={`text-md font-bold sm:text-xs xs:text-xs text-white rounded-lg sm:rounded-md xs:rounded-md px-1 ${getClassNameForStatus(item.status)}`}>
                    {(() => {
                      switch (item.status) {
                        case 'created': return 'Before proceeding';
                        case 'recruiting': return 'Recruiting';
                        case 'progressing': return 'In progress';
                        case 'finished': return 'End of progress';
                        case 'canceled': return 'Cancel Progress';
                        default: return 'Unknown';
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
                  onClick={() => router.push(`/posts/events/${item.id}`)}>
                  Read more
                  <MdOutlineArrowForwardIos size={20} className='rounded-xl w-[10%]' />
                </button>
              </div>
            </div>
            )
          })}

        </div>
        {isLoading && (
          <div className="flex justify-center items-center my-5">
            로딩 중...
          </div>
        )}
      </div>
    </div>
  )
}

export default Events;