import React, { useState, useRef } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import { PostDetail } from '../Interfaces';
import { showErrorAlert, showSuccessAlert } from '@/Redux/actions';
import { updatePost } from '@/services/api';

interface IFile extends File {
  preview?: string;
}

const GeneralEdit = ({ postDetailDefault }: { postDetailDefault: PostDetail }) => {
  /**
   * 컴포넌트에서 사용하는 라우터 인스턴스를 가져옴
   * @type {NextRouter}
   */
  const router = useRouter();

  /**
   * 리덕스 액션을 디스패치하기 위한 디스패치 함수를 가져옴
   * @type {Dispatch<any>}
   */
  const dispatch = useDispatch();

  /**
   * 사용자 세션 훅을 사용하여 사용자 데이터를 가져옴
   * @type {object}
   */
  const { userData } = useUserSession();

  /**
   * 공통 번역 훅을 사용하여 번역 함수를 가져옴
   * @type {TFunction}
   */
  const { t } = useTranslation('common');

  const [selectCategory, setSelectCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<IFile[]>([]);
  const [videos, setVideos] = useState<IFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<IFile[]>([]);

  /**
   * 파일을 선택할 수 있도록 input 요소의 참조를 생성
   * @type {RefObject<HTMLInputElement>}
   */
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * 파일 입력 요소를 클릭하여 사용자가 파일을 선택할 수 있도록 함
   */
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  /**
   * 사용자가 파일을 선택했을 때 해당 파일의 확장자를 확인하고 
   * 해당 확장자에 따라 이미지 또는 비디오 상태를 업데이트하는 함수
   * @param {React.ChangeEvent<HTMLInputElement>} e - 파일을 선택했을 때 발생하는 이벤트 객체
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

  /**
   * 게시물을 수정하고 수정된 게시물의 ID를 반환하는 함수
   * 성공적으로 게시물이 수정되면 수정된 게시물 페이지로 리디렉션
   */
  const editPost = async () => {
    try {
      const updatedPostId = await updatePost(postDetailDefault._id, title, content, images, videos);
      dispatch(showSuccessAlert(t('common:SuccessMessage')));
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
          <p className='font-bold text-4xl sm:text-2xl xs:text-2xl'>{t('common:Edit General Posts')}</p>
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
            <option className="text-sm" value="" disabled>{t('common:Please select a category')}</option>
            <option className="text-sm" value="general" selected>{t('common:General')}</option>
            <option className="text-sm" value="review">{t('common:Review')}</option>
          </select>
        </div>
        <div className='w-2/5 sm:w-full xs:w-full'>
          <input
            className='w-full sm:w-[50%] xs:w-[50%] border-b focus:border-black transition duration-300 py-2 px-3'
            type="text"
            defaultValue={postDetailDefault.title}
            placeholder={postDetailDefault.title}
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
            defaultValue={postDetailDefault.content}
            placeholder={postDetailDefault.content}
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

export default GeneralEdit;