import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { StaticImageData } from 'next/image';
import { MdOutlineArrowForwardIos } from 'react-icons/md';
import { SearchInput, hero_img, insta_icon, insta_logo, google_logo, logo } from '../Reference';
import { Post } from '../Interfaces';

const Review = () => {
  const router = useRouter();
  /**
   * Intersection observer 인스턴스.
   * @type {React.MutableRefObject<IntersectionObserver|null>}
   */
  const observer = useRef<IntersectionObserver | null>(null);
  const [filter, setFilter] = useState<'newest' | 'oldest'>('newest');
  const [page, setPage] = useState(1);
  const [dummy, setDummy] = useState<Post[]>([
    { id: 1, image: hero_img, review_writer: 'nisi', review_title: 'provident', review_content: 'aliquam inventore vel', date: '2023-07-26' },
    { id: 2, image: insta_icon, review_writer: 'ratione', review_title: 'voluptatem', review_content: 'ad qui dicta', date: '2023-07-25' },
    { id: 3, image: insta_logo, review_writer: 'corporis', review_title: 'qui', review_content: 'voluptatem', date: '2023-07-24' },
    { id: 4, image: google_logo, review_writer: 'ullam', review_title: 'qui', review_content: 'fugit et aperiam', date: '2023-07-23' },
    { id: 5, image: logo, review_writer: 'dolorem', review_title: 'quasi', review_content: 'culpa nisi voluptatum', date: '2023-07-22' },
    { id: 6, image: google_logo, review_writer: 'autem', review_title: 'quia', review_content: 'natus quaerat maiores', date: '2023-07-21' },
    { id: 7, image: google_logo, review_writer: 'ipsum', review_title: 'quod', review_content: 'ab quia impedit', date: '2023-07-20' },
  ]);
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

  // page 값이 바뀔 때마다 새로운 데이터를 불러옴.
  useEffect(() => {
    fetchMoreData(page);
  }, [page]);

  /**
   * 페이지에 대해 더 많은 데이터를 가져오는 함수.
   *
   * @param {number} page - 현재 페이지 번호.
   */
  const fetchMoreData = async (page: number) => {
    setIsLoading(true);
    // fetch new data here with API
    const newData: Post[] = [
      { id: 8, image: logo, review_writer: 'dolorem', review_title: 'aliquam', review_content: 'eaque nobis aut', date: '2023-07-19' },
      { id: 9, image: google_logo, review_writer: 'autem', review_title: 'et', review_content: 'voluptas est possimus', date: '2023-07-18' },
      { id: 10, image: google_logo, review_writer: 'ipsum', review_title: 'nihil', review_content: 'non et nam', date: '2023-07-17' },
      { id: 11, image: google_logo, review_writer: 'autem', review_title: 'consequatur', review_content: 'amet sed necessitatibus', date: '2023-07-16' },
      { id: 12, image: google_logo, review_writer: 'ipsum', review_title: 'iste', review_content: 'voluptatibus et perspiciatis', date: '2023-07-15' },
      { id: 13, image: google_logo, review_writer: 'autem', review_title: 'saepe', review_content: 'omnis perspiciatis consequuntur', date: '2023-07-14' },
      { id: 14, image: google_logo, review_writer: 'ipsum', review_title: 'illo', review_content: 'eos pariatur perferendis', date: '2023-07-13' },
      { id: 15, image: google_logo, review_writer: 'ipsum', review_title: 'blanditiis', review_content: 'qui in earum', date: '2023-07-12' },
      { id: 16, image: google_logo, review_writer: 'autem', review_title: 'labore', review_content: 'assumenda aut et', date: '2023-07-11' },
      { id: 17, image: google_logo, review_writer: 'ipsum', review_title: 'labore', review_content: 'possimus voluptatem nostrum', date: '2023-07-10' },
      { id: 18, image: google_logo, review_writer: 'autem', review_title: 'magnam', review_content: 'ut ipsam incidunt', date: '2023-07-09' },
      { id: 19, image: google_logo, review_writer: 'ipsum', review_title: 'consequatur', review_content: 'eum quia illum', date: '2023-07-08' },
      { id: 16, image: google_logo, review_writer: 'autem', review_title: 'explicabo', review_content: 'modi blanditiis voluptate', date: '2023-07-07' },
      { id: 17, image: google_logo, review_writer: 'ipsum', review_title: 'totam', review_content: 'illo nisi repellat', date: '2023-07-06' },
      { id: 18, image: google_logo, review_writer: 'autem', review_title: 'voluptatem', review_content: 'atque eveniet ullam', date: '2023-07-05' },
      { id: 19, image: google_logo, review_writer: 'ipsum', review_title: 'facere', review_content: 'in voluptas quas', date: '2023-07-04' },
    ];
    const nonDuplicateData: Post[] = newData.filter(
      (data) => !dummy.map((item) => item.id).includes(data.id)
    );
    setDummy([...dummy, ...nonDuplicateData]);
    setIsLoading(false);
  };

  /**
  * Intersection Observer를 설정하고, 
  * lastPostElementRef가 변화할 때마다 observer를 재설정하는 effect.
  */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // 이 부분에서 새로운 데이터를 불러옴
          fetchMoreData();
        }
      },
      { threshold: 1 }  // 1.0은 대상 요소가 보이는 비율을 의미
    );

    if (lastPostElementRef.current) {
      observer.observe(lastPostElementRef.current);
    }

    return () => {
      if (lastPostElementRef.current) {
        observer.unobserve(lastPostElementRef.current);
      }
    };
  }, []);  // 의존성 배열은 빈 배열입니다.

  /**
   * 필터 변경을 처리하는 함수.
   *
   * @param {React.ChangeEvent<HTMLSelectElement>} event - 발생한 이벤트.
   */
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as 'newest' | 'oldest';
    setFilter(value);
  };

  // 필터에 따라 게시물 정렬
  let sortedPosts = [...dummy];
  if (filter === 'newest') {
    sortedPosts.sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1));
  } else {
    sortedPosts.sort((a, b) => (new Date(a.date) > new Date(b.date) ? 1 : -1));
  }

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
          {sortedPosts.map((item, i) => {
            if (dummy.length === i + 1) {
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
                  onClick={() => router.push(`/posts/review/${item.id}`)}>
                  <div className='border-b-2 relative pb-[65%] sm:pb-[90%] xs:pb-[90%]'>
                    <Image
                      className='rounded-t-3xl'
                      src={item.image}
                      layout='fill'
                      objectFit='cover'
                      alt='event poster'
                    />
                  </div>
                  <div className='flex flex-col px-6 py-4 gap-6'>
                    <div>
                      <h2 className="text-xl font-bold hover:underline sm:text-lg xs:text-sm" onClick={() => router.push(`/user/profile`)}>
                        {item.review_writer}
                      </h2>
                    </div>
                    <p className="text-gray-700 font-semibold lg:text-sm sm:text-xs xs:text-xs overflow-ellipsis overflow-hidden h-[20px] whitespace-nowrap">{item.review_content}</p>
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
                      md:text-sm 
                      font-semibold 
                      transition 
                      duration-300'
                      onClick={() => router.push(`/posts/review/${item.id}`)}>
                      Read more
                      <MdOutlineArrowForwardIos size={20} className='rounded-xl w-[10%]' />
                    </button>
                  </div>
                </div>
              )
            } else {
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
                  hover:-translate-y-2">
                  <div className='border-b-2 relative pb-[65%] sm:pb-[90%] xs:pb-[90%] cursor-pointer' onClick={() => router.push(`/posts/review/${item.id}`)}>
                    <Image
                      className='rounded-t-3xl'
                      src={item.image}
                      layout='fill'
                      objectFit='cover'
                      alt='event poster'
                    />
                  </div>
                  <div className='flex flex-col px-6 sm:px-2 xs:px-2 py-4 gap-4'>
                    <div>
                      <h2 className="
                        text-xl 
                        font-bold 
                        hover:underline 
                        sm:text-lg 
                        xs:text-sm 
                        cursor-pointer" 
                        onClick={() => router.push(`/user/profile`)}>
                        {item.review_writer}
                      </h2>
                    </div>
                    <h2 className="
                      text-xl 
                      font-bold 
                      sm:text-lg 
                      xs:text-sm 
                      cursor-pointer 
                      hover:underline" 
                      onClick={() => router.push(`/posts/review/${item.id}`)}>
                        {item.review_title}
                      </h2>
                    <p className="
                      text-gray-700 
                      font-semibold 
                      lg:text-sm 
                      sm:text-xs 
                      xs:text-xs 
                      hover:underline 
                      overflow-ellipsis 
                      overflow-hidden 
                      h-[20px] 
                      whitespace-nowrap cursor-pointer" 
                      onClick={() => router.push(`/posts/review/${item.id}`)}>
                      {item.review_content}
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
                      onClick={() => router.push(`/posts/review/${item.id}`)}>
                      Read more
                      <MdOutlineArrowForwardIos size={20} className='rounded-xl w-[10%]' />
                    </button>
                  </div>
                </div>
              )
            }
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