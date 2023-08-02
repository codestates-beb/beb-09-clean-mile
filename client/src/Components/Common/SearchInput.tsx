import React, { useState } from 'react';
import { useRouter } from 'next/router';

const SearchInput = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('title');

  const handleSearch = () => {
    switch (router.pathname) {
      case '/posts/general':
        if (filter === 'title') {
          router.push(`/posts/general?page=1&order=desc&title=${search}`);
        } else if (filter === 'content') {
          router.push(`/posts/general?page=1&order=desc&content=${search}`);
        }
        return;
      case '/posts/events':
        if (filter === 'title') {
          router.push(`/posts/events?last_id=null&title=${search}`);
        } else if (filter === 'content') {
          router.push(`/posts/events?last_id=null&content=${search}`);
        }
        return;
      case '/notice':
        if (filter === 'title') {
          router.push(`/notice?page=1&order=desc&title=${search}`);
        } else if (filter === 'content') {
          router.push(`/notice?page=1&order=desc&content=${search}`);
        }
        return;
      default: return '';
    }
  }

  return (
    <div className='w-full flex justify-center items-center'>
      <select className="border border-black py-2 px-4 rounded mr-5 sm:mr-3 text-sm sm:text-xs xs:text-xs" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilter(e.target.value)}>
        <option className="text-sm sm:text-xs" value="title">제목</option>
        <option className="text-sm sm:text-xs" value="content">내용</option>
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
        placeholder='게시글 검색'
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
          검색
        </button>
      </div>
    </div>
  )
}

export default SearchInput;