import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { MdOutlineArrowForwardIos } from 'react-icons/md';
import { SearchInput } from '../Reference';
import { EventList } from '../Interfaces';
import { ApiCaller } from '../Utils/ApiCaller';

const Events = ({ eventList: initialEventList, lastId }: { eventList: EventList[], lastId: string }) => {
  const router = useRouter();
  const [filter, setFilter] = useState<'newest' | 'oldest'>('newest');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [eventList, setEventList] = useState<EventList[]>(initialEventList);
  const [newLastId, setNewLastId] = useState<string>(lastId);
  const [newEvents, setNewEvents] = useState<EventList[]>([]);

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

  const observer = useRef(null);
  const lastEventElementRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !isLoading) {
        // 페이지 상태를 직접 변경하는 대신,
        // Observer가 트리거될 때마다 'loadMore'라는 신호를 보냅니다.
        setIsLoading(true);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading]);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      let URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/events/list?last_id=${newLastId}`;
  
      try {
        const res = await ApiCaller.get(URL, null, false, {}, true);

        console.log(res.data.data)
        
        if (res.status === 200  && res.data.data.data) {
          const fetchedEvents = res.data.data.data;
        
          // Filter out any events that are already in our list
          const uniqueEvents = fetchedEvents.filter(
            (fetchedEvent) => !eventList.some((event) => event._id === fetchedEvent._id)
          );
        
          // Update newEvents with the uniqueEvents
          setNewEvents(uniqueEvents);
        
          // Update newLastId with the ID of the last fetched event
          if (uniqueEvents.length > 0) {
            setNewLastId(uniqueEvents[uniqueEvents.length - 1]._id);
          }
        } 
      } catch (error) {
        console.error('이벤트 리스트를 가져오는데 실패했습니다:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchEvents();
  }, [newLastId]);
  
  
  useEffect(() => {
    setEventList((prevList) => [...prevList, ...newEvents]);
  }, [newEvents]);

  return (
    <div className='w-full flex flex-col justify-center gap-12 px-24 sm:px-2 xs:px-2 py-14 lg:py-12 md:py-6 sm:py-6 xs:py-3'>
      <h1 className='font-bold text-5xl lg:text-4xl md:text-3xl sm:text-2xl xs:text-xl text-center'>
        Events
      </h1>
      <div className='flex flex-col items-center gap-24 w-full min-h-screen'>
        <div className='w-full'>
          <div className='flex justify-end mb-3'>
            <SearchInput />
            <select className="border border-black py-2 px-4 pr-7 rounded-md text-sm">
              <option className="text-sm xs:text-xs" value="desc">Latest order</option>
              <option className="text-sm xs:text-xs" value="asc">Old order</option>
              <option className="text-sm xs:text-xs" value="view">View order</option>
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
              ref={i === eventList.length - 1 ? lastEventElementRef : null}
              onClick={() => router.push(`/posts/events/${item._id}`)}>
              <div className='border-b-2 relative pb-[65%] sm:pb-[90%] xs:pb-[90%]'>
                <Image
                  className='rounded-t-3xl object-cover'
                  src={item.poster_url}
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
                  onClick={() => router.push(`/posts/events/${item._id}`)}>
                  Read more
                  <MdOutlineArrowForwardIos size={20} className='rounded-xl w-[10%]' />
                </button>
              </div>
            </div>
            )
          })}

        </div>
      </div>
    </div>
  )
}

export default Events;