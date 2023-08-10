import React, { useState, useEffect } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { SearchInput } from '../Reference';
import { Post, Pagination } from '../../Components/Interfaces';

const DEFAULT_PAGE = 1;

const Notice = ({ noticeList, noticePagination }: { noticeList: Post[], noticePagination: Pagination }) => {
  /**
   * 컴포넌트에서 사용하는 라우터 인스턴스를 가져옴
   * @type {NextRouter}
   */
  const router = useRouter();

  /**
   * 공통 번역 훅을 사용하여 번역 함수를 가져옴
   * @type {TFunction}
   */
  const { t } = useTranslation('common');

  /**
   * 현재 페이지의 상태를 설정
   * 초기값은 라우터의 쿼리에서 페이지 번호를 가져오거나 
   * 페이지 번호가 없을 경우 기본 페이지 값을 사용
   * @type {number}
   */
  const [currentPage, setCurrentPage] = useState(
    Number(router.query.page) || DEFAULT_PAGE
  );

  /**
   * 필터(순서)가 변경될 때 호출되는 핸들러
   * 변경된 필터 값에 따라 notice 페이지로 라우트를 변경
   * @param {React.ChangeEvent<HTMLSelectElement>} e - select 요소의 변경 이벤트 객체
   */
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const order = e.target.value;
    router.push(`/notice?page=${currentPage}&order=${order}`);
  };

  /**
   * 페이징 정보에서 전체 페이지 수를 가져옴
   * @type {number | undefined}
   */
  const totalPages = noticePagination?.totalPages;

  /**
   * 페이지가 변경될 때 호출되는 핸들러
   * 선택된 페이지 번호로 현재 페이지의 상태를 업데이트
   * @param {number} pageNumber - 선택된 페이지 번호
   */
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  /**
   * 현재 페이지 상태가 변경될 때마다 페이지를 다시 로드
   */
  useEffect(() => {
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
                      <td className="w-[40%] border-b p-6 sm:p-3 xs:p-2">
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