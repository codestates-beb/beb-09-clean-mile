import React, { useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';

const SearchInput = () => {
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
   * 사용자가 선택한 필터 옵션을 상태로 관리
   * @type {string}
   */
  const [search, setSearch] = useState('');

  /**
   * 사용자가 선택한 필터 옵션을 상태로 관리
   * @type {string}
   */
  const [filter, setFilter] = useState('title');

  /**
   * 주어진 기본 경로와 파라미터를 바탕으로 새로운 URL 경로를 생성
   * @param {string} base - 기본 경로 
   * @param {object} params - 추가될 파라미터 객체
   * @returns {string} 생성된 URL 경로
   */
  const generatePath = (base:string, params: object) => {
    const url = new URL(base, 'http://dummy.com'); // dummy domain to support URL API

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    return url.pathname + url.search;
  }

  /**
   * 현재 경로에 따라 검색 파라미터를 설정하고, 해당 파라미터를 사용하여 새로운 경로로 이동
   */
  const handleSearch = () => {
    let path;
    let params;

    switch (router.pathname) {
      case '/posts/general':
        params = {
          page: 1,
          order: 'desc',
          [filter]: search
        };
        path = generatePath('/posts/general', params);
        break;

      case '/posts/events':
        params = {
          last_id: 'null',
          [filter]: search
        };
        path = generatePath('/posts/events', params);
        break;

      case '/posts/review':
        params = {
          last_id: 'null',
          [filter]: search
        };
        path = generatePath('/posts/review', params);
        break;

      case '/notice':
        params = {
          page: 1,
          order: 'desc',
          [filter]: search
        };
        path = generatePath('/notice', params);
        break;

      default: return;
    }

    router.push(path);
  }

  return (
    <div className='w-full flex justify-center items-center'>
      <select className="border border-black py-2 px-4 rounded mr-5 sm:mr-3 text-sm sm:text-xs xs:text-xs" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilter(e.target.value)}>
        <option className="text-sm sm:text-xs" value="title">{t('common:Title')}</option>
        <option className="text-sm sm:text-xs" value="content">{t('common:Content')}</option>
      </select>
      <input className='
        border rounded-lg 
        border-black 
        py-2 
        sm:py-1 
        xs:py-1 
        px-4 
        sm:px-1 
        xs:px-1 
        w-5/12'
        type="text"
        placeholder={t('common:Search')}
        value={search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} />
      <div className='ml-5 sm:ml-2 xs:ml-2'>
        <button className='
          border 
          rounded-lg 
          py-2 
          xs:py-3 
          px-6 
          sm:px-2 
          xs:px-1 
          sm:text-sm 
          xs:text-xs 
          bg-main-blue 
          text-white 
          hover:bg-blue-600 
          transition 
          duration-300'
          type="button"
          onClick={handleSearch}>
          {t('common:Search')}
        </button>
      </div>
    </div>
  )
}

export default SearchInput;