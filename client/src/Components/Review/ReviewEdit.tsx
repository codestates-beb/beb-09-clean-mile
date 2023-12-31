import React, { useEffect, useState, useRef } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import { PostDetail } from '../Interfaces';
import { showSuccessAlert, showErrorAlert } from '@/Redux/actions';
import { updatePost } from '@/services/api';

interface IFile extends File {
  preview?: string;
}

const ReviewEdit = ({ reviewDetailDefault }: { reviewDetailDefault: PostDetail }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation('common');

  const [selectCategory, setSelectCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<IFile[]>([]);
  const [videos, setVideos] = useState<IFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<IFile[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(sessionStorage.getItem('user')));
  }, []);


  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

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

  const editPost = async () => {
    try {
      const updatedPostId = await updatePost(reviewDetailDefault._id, title, content, images, videos);
      dispatch(showSuccessAlert(t('Success')));
      router.replace(`/posts/review/${updatedPostId}`);
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
          <p className='font-bold text-4xl sm:text-2xl xs:text-2xl'>{t('common:Edit Review Posts')}</p>
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
            <option className="text-sm" defaultValue="review" selected>{t('common:Review')}</option>
          </select>
        </div>
        <div className='w-2/5 sm:w-full xs:w-full'>
          <input
            className='w-full sm:w-[50%] xs:w-[50%] border-b focus:border-black transition duration-300 py-2 px-3'
            type="text"
            defaultValue={reviewDetailDefault.title}
            placeholder={reviewDetailDefault.title}
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
          <textarea className="
            border 
            border-gray-300 
            rounded-lg 
            w-full 
            h-full 
            p-3 
            outline-none"
            defaultValue={reviewDetailDefault.content}
            placeholder={reviewDetailDefault.content}
            value={content}
            onChange={(e) => setContent(e.target.value)} />
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
            onClick={() => router.back()}>
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
            onClick={editPost}>
            {t('common:Edit')}
          </button>
        </div>
      </div>
    </>
  )
}

export default ReviewEdit;