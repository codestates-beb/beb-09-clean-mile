import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { SearchInput } from '../Reference';
import { Post, Pagination } from '../Interfaces';

const General = ({
  postList,
  postPagination,
}: {
  postList: Post[];
  postPagination: Pagination;
}) => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const [currentPage, setCurrentPage] = useState(
    Number(router.query.page || 1)
  );

  const totalPages = postPagination?.totalPages;

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // 필터 변경 핸들러
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`/posts/general?page=${currentPage}&order=${e.target.value}`);
  };

  useEffect(() => {
    // URL query에 page 번호를 기록하려면 아래 코드를 활성화하세요.
    router.push(`/posts/general?page=${currentPage}`);
  }, [currentPage]);

  return (
    <div className='w-full flex flex-col justify-center gap-12 px-24 sm:px-2 xs:px-2 py-14 lg:py-12 md:py-6 sm:py-6 xs:py-3'>
      <h1 className='font-bold text-5xl lg:text-4xl md:text-3xl sm:text-2xl xs:text-xl text-center'>
        {t('common:General')}
      </h1>
      <div className={`flex justify-center items-center w-full`}>
        <div
          className={`w-full ${
            postList?.length <= 4 ||
            (postList === null && 'min-h-screen items-center justify-around')
          }`}
        >
          <div className='flex justify-end mb-3 gap-3'>
            <select
              className='border border-black py-2 px-4 pr-7 rounded-md text-sm'
              onChange={handleFilterChange}
            >
              <option className='text-sm xs:text-xs' value='desc'>
                {t('common:Latest order')}
              </option>
              <option className='text-sm xs:text-xs' value='asc'>
                {t('common:Old order')}
              </option>
              <option className='text-sm xs:text-xs' value='view'>
                {t('common:View order')}
              </option>
            </select>
            <Link
              className='
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
              href='/posts/create'
            >
              <button type='button'>{t('common:Write')}</button>
            </Link>
          </div>
          <div className='w-full'>
            <table className='w-full text-center border-collapse sm:text-sm xs:text-xs overflow-x-scroll'>
              <thead className='border-b'>
                <tr>
                  <th className='p-2'>{t('common:No')}</th>
                  <th className='p-2'>{t('common:Title')}</th>
                  <th className='p-2'>{t('common:Content')}</th>
                  <th className='p-2'>{t('common:Writer')}</th>
                  <th className='p-2'>{t('common:Date')}</th>
                  <th className='p-2'>{t('common:Views')}</th>
                </tr>
              </thead>
              <tbody>
                {postList === null ? (
                  <tr>
                    <td colSpan={6} className='p-6 text-center'>
                      {t('common:There are no registered posts')}
                    </td>
                  </tr>
                ) : (
                  postList?.map((post, i) => (
                    <tr
                      className='
                      hover:bg-gray-200 
                      transition-all 
                      duration-300 
                      cursor-pointer'
                      key={i}
                      onClick={() => router.push(`/posts/general/${post._id}`)}
                    >
                      <td className='border-b p-6 sm:p-3 xs:p-2'>
                        <p className='text-xl sm:text-sm xs:text-xs font-semibold'>
                          {i + 1}
                        </p>
                      </td>
                      <td className='border-b p-6 sm:p-3 xs:p-2'>
                        <p className='text-gray-600 sm:text-sm xs:text-xs'>
                          {post.title.length >= 20
                            ? post.title.slice(0, 20) + '...'
                            : post.title}
                        </p>
                      </td>
                      <td className='border-b p-6 sm:p-3 xs:p-2'>
                        <p className='text-gray-600 sm:text-sm xs:text-xs'>
                          {post.content.length >= 20
                            ? post.content.slice(0, 60) + '...'
                            : post.content}
                        </p>
                      </td>
                      <td className='border-b p-6 sm:p-3 xs:p-2'>
                        <p className='text-gray-600 sm:text-sm xs:text-xs'>
                          {post.user_id === null
                            ? t('common:Unknown')
                            : post.user_id?.nickname}
                        </p>
                      </td>
                      <td className='border-b p-6 sm:p-3 xs:p-2'>
                        <p className='text-gray-600 sm:text-sm xs:text-xs'>
                          {post.updated_at.split('T')[0]}
                          <br />
                          {post.updated_at.substring(11, 19)}
                        </p>
                      </td>
                      <td className='border-b p-6 sm:p-3 xs:p-2'>
                        <p className='text-gray-600'>{post.view.count}</p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className='w-full mt-16 sm:mt-10 xs:mt-5 mb-5 flex justify-center'>
              <div className='flex items-center'>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`px-2 py-2 mx-1 xs:text-sm ${
                      currentPage === i + 1 ? 'font-bold' : ''
                    }`}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
            <SearchInput />
          </div>
        </div>
      </div>
    </div>
  );
};

export default General;
