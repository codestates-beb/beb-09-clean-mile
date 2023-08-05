import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { SearchInput } from '../Reference';
import { Post, Pagination } from '../../Components/Interfaces';

const Notice = ({ noticeList, noticePagination }: { noticeList: Post[], noticePagination: Pagination }) => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('newest');
  // 필터 변경 핸들러
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`/notice?page=${currentPage}&order=${e.target.value}`);
  };


  const totalPages = noticePagination?.totalPages;

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    // URL query에 page 번호를 기록하려면 아래 코드를 활성화하세요.
    router.push(`/notice?page=${currentPage}`);
  }, [currentPage]);

  return (
  <div className='w-full flex flex-col justify-center gap-12 px-24 sm:px-2 xs:px-2 py-14 lg:py-12 md:py-6 sm:py-6 xs:py-3'>
      <h1 className='font-bold text-5xl lg:text-4xl md:text-3xl sm:text-2xl xs:text-xl text-center'>
        {t('common:Notice')}
      </h1>
      <div className='flex justify-center items-center w-full'>
        <div className={`w-full ${noticeList === null && 'min-h-screen items-center justify-around'}`}>
          <div className='flex justify-end mb-3'>
            <select className="border border-black py-2 px-4 pr-7 rounded-md text-sm" onChange={handleFilterChange}>
              <option className="text-sm xs:text-xs" value="desc">{t('common:Latest order')}</option>
              <option className="text-sm xs:text-xs" value="asc">{t('common:Old order')}</option>
              <option className="text-sm xs:text-xs" value="view">{t('common:View order')}</option>
            </select>
          </div>
          <div className='w-full'>
            <table className="w-full text-center border-collapse sm:text-sm xs:text-xs overflow-x-scroll">
              <thead className='border-b'>
                <tr>
                  <th className="p-2">{t('common:No')}</th>
                  <th className="p-2">{t('common:Title')}</th>
                  <th className="p-2">{t('common:Content')}</th>
                  <th className="p-2">{t('common:Writer')}</th>
                  <th className="p-2">{t('common:Date')}</th>
                  <th className="p-2">{t('common:Views')}</th>
                </tr>
              </thead>
              <tbody>
                {noticeList === null ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center">{t('common:There are no registered posts')}</td>
                  </tr>
                ) : (
                  noticeList.map((post, i) => (
                    <tr className="
                      hover:bg-gray-200 
                      transition-all 
                      duration-300 
                      cursor-pointer"
                      key={i}
                      onClick={() => router.push(`/notice/${post._id}`)}>
                      <td className="border-b p-6 sm:p-3 xs:p-2">
                        <p className="text-xl sm:text-sm xs:text-xs font-semibold">{i + 1}</p>
                      </td>
                      <td className="border-b p-6 sm:p-3 xs:p-2">
                        <p className="text-gray-600 sm:text-sm xs:text-xs">
                          {post.title.length >= 20 ? post.title.slice(0, 20) + '...' : post.title}
                        </p>
                      </td>
                      <td className="border-b p-6 sm:p-3 xs:p-2">
                        <p className="text-gray-600 sm:text-sm xs:text-xs">
                          {post.content.length >= 20 ? post.content.slice(0, 60) + '...' : post.content}
                        </p>
                      </td>
                      <td className="border-b p-6 sm:p-3 xs:p-2">
                        <p className="text-gray-600 sm:text-sm xs:text-xs">
                          {post.user_id.nickname}
                        </p>
                      </td>
                      <td className="border-b p-6 sm:p-3 xs:p-2">
                        <p className="text-gray-600 sm:text-sm xs:text-xs">
                          {post.updated_at.split('T')[0]}<br />{post.updated_at.substring(11, 19)}
                        </p>
                      </td>
                      <td className="border-b p-6 sm:p-3 xs:p-2">
                        <p className="text-gray-600">
                          {post.view.count}
                        </p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className='w-full mt-16 sm:mt-10 xs:mt-5 flex justify-center mb-5'>
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
            <SearchInput />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notice;