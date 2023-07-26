import React from 'react';

const SearchInput = () => {

  return (
    <div className='w-full flex justify-center items-center'>
      <select className="border border-black py-2 px-4 rounded mr-5 sm:mr-3 text-sm sm:text-xs xs:text-xs">
        <option className="text-sm sm:text-xs" value="option1">제목 + 내용</option>
        <option className="text-sm sm:text-xs" value="option2">제목</option>
        <option className="text-sm sm:text-xs" value="option3">내용</option>
        <option className="text-sm sm:text-xs" value="option3">작성자</option>
      </select>
      <input className='border rounded-lg border-black py-2 sm:py-1 xs:py-1 px-4 sm:px-1 xs:px-1 w-5/12' type="text" placeholder='게시글 검색'/>
      <div className='ml-5 sm:ml-2 xs:ml-2'>
        <button className='border rounded-lg py-2 xs:py-3 px-6 sm:px-2 xs:px-1 sm:text-sm xs:text-xs bg-main-blue text-white hover:bg-blue-600 transition duration-300' type="button">검색</button>
      </div>
    </div>
  )
}

export default SearchInput;