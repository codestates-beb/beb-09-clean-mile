import React from 'react';
import { useRouter } from 'next/router'; 
import { Post } from '../Interfaces';

const NewNotice = ({ latestNotice }: { latestNotice: Post }) => {
  const router = useRouter();

  return (
    <div className='w-full flex justify-center bg-green-700 text-white py-2 sticky top-[79px] z-10'>
      <p className='font-bold mr-4'>New</p>
      <p className='cursor-pointer hover:underline' onClick={() => router.push(`/notice/${latestNotice?._id}`)}>{latestNotice?.content}</p>
    </div>
  )
}

export default NewNotice;