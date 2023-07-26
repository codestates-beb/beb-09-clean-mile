import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Notice = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('newest');

  const dummyNotice = [
    { id: 1, title: 'test1', content: 'test111', writer: 'admin', date: '2023-07-26', views: 0 },
    { id: 2, title: 'test2', content: 'test222', writer: 'admin', date: '2023-07-25', views: 0 },
    { id: 3, title: 'test3', content: 'test333', writer: 'admin', date: '2023-07-24', views: 0 },
    { id: 4, title: 'test4', content: 'test444', writer: 'admin', date: '2023-07-23', views: 0 },
    { id: 5, title: 'test5', content: 'test555', writer: 'admin', date: '2023-07-22', views: 0 },
    { id: 6, title: 'test6', content: 'test666', writer: 'admin', date: '2023-07-21', views: 0 },
    { id: 7, title: 'test7', content: 'test777', writer: 'admin', date: '2023-07-20', views: 0 },
    { id: 8, title: 'test8', content: 'test888', writer: 'admin', date: '2023-07-19', views: 0 },
    { id: 9, title: 'test9', content: 'test999', writer: 'admin', date: '2023-07-18', views: 0 },
    { id: 10, title: 'test10', content: 'test1010', writer: 'admin', date: '2023-07-17', views: 0 },
    { id: 11, title: 'test1', content: 'test111', writer: 'admin', date: '2023-07-16', views: 0 },
    { id: 12, title: 'test2', content: 'test222', writer: 'admin', date: '2023-07-15', views: 0 },
    { id: 13, title: 'test3', content: 'test333', writer: 'admin', date: '2023-07-14', views: 0 },
    { id: 14, title: 'test4', content: 'test444', writer: 'admin', date: '2023-07-13', views: 0 },
    { id: 15, title: 'test5', content: 'test555', writer: 'admin', date: '2023-07-12', views: 0 },
    { id: 16, title: 'test6', content: 'test666', writer: 'admin', date: '2023-07-11', views: 0 },
    { id: 17, title: 'test7', content: 'test777', writer: 'admin', date: '2023-07-10', views: 0 },
    { id: 18, title: 'test8', content: 'test888', writer: 'admin', date: '2023-07-09', views: 0 },
    { id: 19, title: 'test9', content: 'test999', writer: 'admin', date: '2023-07-08', views: 0 },
    { id: 20, title: 'test10', content: 'test1010', writer: 'admin', date: '2023-07-07', views: 0 },
  ]

  // 필터 변경 핸들러
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value);
  };

  // 필터에 따라 게시물 정렬
  let sortedPosts = [...dummyNotice];
  if (filter === 'newest') {
    sortedPosts.sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1));
  } else {
    sortedPosts.sort((a, b) => (new Date(a.date) > new Date(b.date) ? 1 : -1));
  }

  const postsPerPage = 10;
  const totalPages = Math.ceil(dummyNotice.length / postsPerPage);

  const handlePageChange = (pageNumber: number) => {
      setCurrentPage(pageNumber);
  };

  useEffect(() => {
    // URL query에 page 번호를 기록하려면 아래 코드를 활성화하세요.
    router.push(`/notice?page=${currentPage}`);
  }, [currentPage]);

  // 기존 dummyNotice를 sortedPosts로 교체
  const currentPosts = sortedPosts.slice((currentPage-1) * postsPerPage, currentPage * postsPerPage);

  return (
    <div className='w-full mx-auto px-24 sm:px-2 xs:px-2 py-14 lg:py-12 md:py-6 sm:py-6 xs:py-3'>
      <div className='flex justify-center items-center w-full'>
        <div className='w-full'>
          <div className='flex justify-end mb-3'>
            <select className="border border-black py-2 px-4 pr-7 rounded-md text-sm" onChange={handleFilterChange}>
              <option className="text-sm xs:text-xs" value="newest">최신 순</option>
              <option className="text-sm xs:text-xs" value="oldest">오래된 순</option>
            </select>
          </div>
          <div className='w-full'>
            <table className="w-full text-center border-collapse sm:text-sm xs:text-xs overflow-x-scroll">
              <thead className='border-b'>
                <tr>
                  <th className="p-2">No.</th>
                  <th className="p-2">Title</th>
                  <th className="p-2">Content</th>
                  <th className="p-2">Writer</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Views</th>
                </tr>
              </thead>
              <tbody>
                {currentPosts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center">등록된 게시글이 없습니다.</td>
                  </tr>
                ) : (
                  currentPosts.map((post) => (
                    <tr className="
                      hover:bg-gray-200 
                      transition-all 
                      duration-300 
                      cursor-pointer"
                      key={post.id}
                      onClick={() => router.push(`/posts/${post.id}`)}>
                      <td className="border-b p-6 sm:p-3 xs:p-2">
                        <p className="text-xl sm:text-sm xs:text-xs font-semibold">{post.id}</p>
                      </td>
                      <td className="border-b p-6 sm:p-3 xs:p-2">
                        <p className="text-gray-600 sm:text-sm xs:text-xs"> {post.title}</p>
                      </td>
                      <td className="border-b p-6 sm:p-3 xs:p-2">
                        <p className="text-gray-600 sm:text-sm xs:text-xs"> {post.content}</p>
                      </td>
                      <td className="border-b p-6 sm:p-3 xs:p-2">
                        <p className="text-gray-600 sm:text-sm xs:text-xs">
                          {post.writer}
                        </p>
                      </td>
                      <td className="border-b p-6 sm:p-3 xs:p-2">
                        <p className="text-gray-600 sm:text-sm xs:text-xs"> 
                          {post.date}
                        </p>
                      </td>
                      <td className="border-b p-6 sm:p-3 xs:p-2">
                        <p className="text-gray-600"> 
                          {post.views}
                        </p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className='w-full mt-16 sm:mt-10 xs:mt-5 flex justify-center'>
              <div className='flex items-center'>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`px-2 py-2 mx-1 xs:text-sm ${currentPage === i + 1 ? 'font-bold' : ''}`}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
            <div className='w-full mt-16 sm:mt-10 xs:mt-5 mb-5 flex justify-center items-center'>
              <select className="border border-black py-2 px-4 pr-6 rounded mr-5 text-sm">
                <option className="text-sm sm:text-xs" value="option1">제목 + 내용</option>
                <option className="text-sm sm:text-xs" value="option2">제목</option>
                <option className="text-sm sm:text-xs" value="option3">내용</option>
                <option className="text-sm sm:text-xs" value="option3">작성자</option>
              </select>
              <input className='border rounded-lg border-black py-2 px-4 xs:px-2 w-5/12' type="text" placeholder='게시글 검색'/>
              <div className='ml-5 sm:ml-2 xs:ml-2'>
                <button className='border rounded-lg py-2 xs:py-3 px-6 sm:px-2 xs:px-3 sm:text-sm xs:text-xs bg-main-blue text-white hover:bg-blue-600 transition duration-300' type="button">검색</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notice;