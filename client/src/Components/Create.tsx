import React, { useEffect, useState, useRef, useCallback } from 'react';
import useTranslation from 'next-translate/useTranslation';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import { showErrorAlert } from '@/Redux/actions';
import { useUserSession } from '@/hooks/useUserSession';
import { userCreatePost } from '@/services/api'

interface IFile extends File {
  preview?: string;
}

const Create = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { userData } = useUserSession();
  const { t } = useTranslation('common');

  const [selectCategory, setSelectCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<IFile[]>([]);
  const [videos, setVideos] = useState<IFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<IFile[]>([]);
  const [isReview, setIsReview] = useState(false);
  const [selectEvent, setSelectEvent] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(sessionStorage.getItem('user')));
  }, []);


  useEffect(() => {
    if (userData?.events && userData?.events.length > 0) {
      setSelectEvent(userData?.events[0]._id);
    }
  }, [userData?.events]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value;
    setSelectCategory(selectedCategory);
    setIsReview(selectedCategory === 'review');
  }

  /**
   * 사용자가 파일을 선택하면 이를 처리하는 함수
   * 이 함수는 선택한 파일의 확장자를 확인하고,
   * 확장자에 따라 이미지 또는 비디오를 각각의 상태에 저장
   * @param {Event} e - 파일 입력 이벤트 객체
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: IFile[] = Array.from(e.target.files!) as IFile[];

    files.forEach((file) => {
      const extension = file.name.split('.').pop()?.toLowerCase();

      if (['jpg', 'jpeg', 'png'].includes(extension || '')) {
        setImages((prevImages) => [...prevImages, file]);
      } else if (['mp4', 'avi', 'mov'].includes(extension || '')) {
        setVideos((prevVideos) => [...prevVideos, file]);
      }
    });
    setSelectedFile(files)
  };

  const createPost = async () => {
    try {
      const res = await userCreatePost(selectCategory, title, content, selectEvent, images, videos);
      if (res.status === 200) {
        await Swal.fire({
          title: 'Success',
          text: res.data.message,
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#6BCB77'
        });
        router.push(`/users/mypage`);
      } else {
        dispatch(showErrorAlert(res.data.message));
      }
    } catch (error) {
      const err = error as AxiosError;

      const data = err.response?.data as { message: string };

      dispatch(showErrorAlert(data?.message));
    }
  }

  return (
    <>
      <div className='w-[90%] min-h-screen mx-auto py-20 sm:py-10 xs:py-10 flex flex-col gap-12'>
        <div>
          <p className='font-bold text-4xl sm:text-2xl xs:text-2xl'>{t('common:Create Posts')}</p>
        </div>
        <div className='flex gap-5 w-1/5 lg:w-[50%] md:w-[50%] sm:w-[50%] xs:w-[50%]'>
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
            onChange={handleCategoryChange}
            required>
            <option className="text-sm" value="" disabled>{t('common:Please select a category')}</option>
            <option className="text-sm" value="general">{t('common:General')}</option>
            <option className="text-sm" value="review">{t('common:Review')}</option>
          </select>
          {isReview && userData?.events && (
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
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectEvent(e.target.value)}>
              {userData?.events.map((event, i) => {
                return (
                  <>
                    <option key={i} value={event._id}>{event.title}</option>
                  </>
                )
              })}
            </select>
          )}
        </div>
        <div className='w-2/5 sm:w-full xs:w-full'>
          <input
            className='w-full sm:w-[50%] xs:w-[50%] border-b focus:border-black transition duration-300 py-2 px-3'
            type="text"
            placeholder={t('common:Please enter the title')}
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />
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
                t('common:Please select a file')
              )}
            </p>
            <button
              className='border rounded-lg p-2 bg-main-blue text-white hover:bg-blue-600 transition duration-300 xs:text-sm'
              onClick={handleFileSelect}>
              {t('common:Select File')}
            </button>
          </div>
          <textarea className="border border-gray-300 rounded-lg w-full h-full p-3 outline-none" value={content} onChange={(e) => setContent(e.target.value)} />
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
            {t('common:Cancel')}
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
            onClick={createPost}>
            {(t('common:Create'))}
          </button>
        </div>
      </div>
    </>
  )
}

export default Create;