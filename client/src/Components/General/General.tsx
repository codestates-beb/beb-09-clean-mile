import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { SearchInput } from '../Reference';
import { Post, Pagination } from '../Interfaces';

const DEFAULT_PAGE = 1;

const General: React.FC<{ postList: Post[], postPagination: Pagination }> = ({ postList, postPagination }) => {
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
   * 사용자가 현재 있는 페이지를 나타냄
   * 라우터의 쿼리에서 페이지를 가져오거나 기본 페이지 상수를 기본값으로 사용
   * @type {number}
   */
  const [currentPage, setCurrentPage] = useState(
    Number(router.query.page) || DEFAULT_PAGE
  );

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
   * 게시글 페이징을 기반으로 사용 가능한 총 페이지 수
   * @type {number}
   */
  const totalPages = postPagination?.totalPages;

  /**
   * 페이지 변경 이벤트 처리
   * 주어진 페이지 번호로 현재 페이지를 설정
   * @param {number} pageNumber - 새 페이지 번호
   */
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  /**
   * 필터 변경을 처리
   * 선택한 순서에 따라 해당 URL로 리디렉션
   * @param {React.ChangeEvent<HTMLSelectElement>} e - 선택 요소의 변경으로 트리거된 이벤트
   */
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const order = e.target.value;
    router.push(`/posts/general?page=${currentPage}&order=${order}`);
  };

  /**
   * 현재 페이지가 변경될 때마다 히스토리에 새 경로를 푸시함
   */
  useEffect(() => {
    router.push(`/posts/general?page=${currentPage}`);
  }, [currentPage]);

  const handleButtonClick = () => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: 'warning',
        title: t('common:Warning'),
        text: t('common:You need to log in'),
        confirmButtonText: '확인'
      }).then(() => {
        router.push('/login')
      });
    } else {
      router.push('/posts/create')
    }
  };

  return (
    <div className='w-full flex flex-col justify-center gap-12 px-24 sm:px-2 xs:px-2 py-14 lg:py-12 md:py-6 sm:py-6 xs:py-3'>
      <h1 className='font-bold text-5xl lg:text-4xl md:text-3xl sm:text-2xl xs:text-xl text-center'>
        {t('common:General')}
      </h1>
      <div className={`flex justify-center items-center w-full`}>
        <div
          className={`w-full ${(postList?.length <= 4 || postList === null) && 'min-h-screen items-center justify-around'}`}
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
                  postList?.map((post, i) => {
                    return (
                      <tr
                        className='
                      hover:bg-gray-200 
                      transition-all 
                      duration-300 
                      cursor-pointer'
                        key={i}
                        onClick={() => router.push(`/posts/general/${post._id}`)}>
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
                    )
                  })
                )}
              </tbody>
            </table>
            <div className='w-full mt-16 sm:mt-10 xs:mt-5 mb-5 flex justify-center'>
              <div className='flex items-center'>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`px-2 py-2 mx-1 xs:text-sm ${currentPage === i + 1 ? 'font-bold' : ''
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
