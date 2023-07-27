import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

const Error404 = () => {
  const router = useRouter();

  return (
    <div className="w-4/5 min-h-screen flex flex-col justify-center items-center gap-12 mx-auto">
      <div className="flex justify-center items-center relative">
        <Image
          src="/assets/images/404.png"
          width={5000}
          height={1000}
          className="w-[60rem]"
          alt="error 404 page not found"
        />
      </div>
      <button
        className="
        w-1/5
        py-3 
        font-bold
        bg-[#dff1ea]
        hover:bg-[#c3eddd]
        text-black
        rounded-xl
        transition
        duration-300"
        onClick={() => {
          router.back();
        }}
      >
        Back
      </button>
    </div>
  );
};

export default Error404;
