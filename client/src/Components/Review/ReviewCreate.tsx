import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const ReviewCreate = () => {
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');
  const [selectCategory, setSelectCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent ] = useState('');
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [selectedFile, setSelectedFile] = useState([]);

  const fileInputRef = useRef(null);

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  /**
   * 사용자가 파일을 선택하면 이를 처리하는 함수
   * 이 함수는 선택한 파일의 확장자를 확인하고,
   * 확장자에 따라 이미지 또는 비디오를 각각의 상태에 저장
   * @param {Event} e - 파일 입력 이벤트 객체
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files)

    files.forEach((file) => {
      const extension = file.name.split('.').pop().toLowerCase();
  
      if (extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
          setImages((prevImages) => [...prevImages, file]);
      } else if (extension === 'mp4' || extension === 'avi' || extension === 'mov') {
          setVideos((prevVideos) => [...prevVideos, file]);
      }
    });
    setSelectedFile(files)
  };

  return (
    <>
      <div className='w-[90%] min-h-screen mx-auto py-20 sm:py-10 xs:py-10 flex flex-col gap-12'>
        <div>
          <p className='font-bold text-4xl sm:text-2xl xs:text-2xl'>Create Review Posts</p>
        </div>
        <div className='w-1/5 lg:w-[50%] md:w-[50%] sm:w-[50%] xs:w-[50%]'>
          <select className="
            border-b 
            outline-none 
            focus:border-black 
            transition 
            duration-300 
            py-2 
            px-4 
            w-full
            sm:text-sm
            xs:text-sm" 
            value={selectCategory}
            onChange={(e) => setSelectCategory(e.target.value)}
            required>
            <option className="text-sm" value="" disabled>카테고리를 선택해 주세요.</option>
            <option className="text-sm" value="eventinfo">행사 정보</option>
            <option className="text-sm" value="courseinfo">코스 정보</option>
            <option className="text-sm" value="review">참여 후기</option>
          </select>
        </div>
        <div className='w-2/5 sm:w-full xs:w-full'>
          <input 
            className='w-full sm:w-[50%] xs:w-[50%] border-b focus:border-black transition duration-300 py-2 px-3' 
            type="text" 
            name="" 
            placeholder='제목을 입력해 주세요'
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}/>
        </div>
        <div className='w-full h-[45rem]'>
          <input
            type='file'
            ref={fileInputRef}
            className='w-full hidden'
            onChange={handleFileChange}
            multiple
            />
          <div className='flex w-[30%] lg:w-[50%] md:w-[70%] sm:w-full xs:w-full justify-between mb-5'>
            <p className='border-b w-[60%] xs:text-sm m-0'>
              {selectedFile.length > 0 ? (
                selectedFile.map((file) => file.name + ', ')
              ) : (
                '파일을 선택해 주세요.'
              )}
            </p>
            <button 
              className='border rounded-lg p-2 bg-main-blue text-white hover:bg-blue-600 transition duration-300 xs:text-sm'
              onClick={handleFileSelect}>
              파일 선택
            </button>
          </div>
          <textarea className="border border-gray-300 rounded-lg w-full h-full p-3 outline-none" onChange={(e) => setContent(e.target.value)} />
        </div>
        <div className='w-full flex gap-3 justify-end mt-16'>
          <button className='
            w-[15%]
            sm:w-[30%]
            xs:w-[30%] 
            border 
            rounded-2xl 
            p-3 
            bg-main-red 
            text-white 
            hover:bg-red-500
            transition 
            duration-300'
            onClick={() => router.push('/')}>
            Cancel
          </button>
          <button className='
            w-[15%]
            sm:w-[30%]
            xs:w-[30%] 
            border 
            rounded-2xl 
            p-3 
            bg-main-green 
            text-white 
            hover:bg-green-600
            transition 
            duration-300'
            >
            Create
          </button>
        </div>
      </div>
    </>
  )
}

export default ReviewCreate;