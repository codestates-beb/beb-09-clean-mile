import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { BsFillImageFill } from 'react-icons/bs';
import { hero_img } from '../Reference';

const EXTENSIONS = [
  { type: 'gif' },
  { type: 'jpg' },
  { type: 'jpeg' },
  { type: 'png' },
  { type: 'mp4' },
];

const UserProfile = () => {
  const router = useRouter()
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState('admin');
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * 파일 업로드 이벤트를 처리
   * @param {Event} e - 파일 업로드 이벤트
   * @returns {void}
   */
  const fileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const FILE = e.target.files[0];
      const SIZE = 10;
      const TYPE = (FILE.type).split('/')[1];
      const FSIZE = (FILE.size) / Math.pow(10, 6);

      if (FSIZE < SIZE) {
        EXTENSIONS.forEach(e => {
          if (e.type === TYPE) {
            const objectURL = URL.createObjectURL(FILE);
            setFileUrl(objectURL);
            setFileType(TYPE);
            setUploadFile(FILE);
          }
        });
      }
    }
  }

  const dummyNotice = [
    { id: 1, title: 'general1', content: 'general111', writer: 'admin', date: '2023-07-26', views: 0 },
    { id: 2, title: 'general2', content: 'general222', writer: 'admin', date: '2023-07-25', views: 0 },
    { id: 3, title: 'general3', content: 'general333', writer: 'admin', date: '2023-07-24', views: 0 },
    { id: 4, title: 'general4', content: 'general444', writer: 'admin', date: '2023-07-23', views: 0 },
    { id: 5, title: 'general5', content: 'general555', writer: 'admin', date: '2023-07-22', views: 0 },
    { id: 6, title: 'general6', content: 'general666', writer: 'admin', date: '2023-07-21', views: 0 },
    { id: 7, title: 'general7', content: 'general777', writer: 'admin', date: '2023-07-20', views: 0 },
    { id: 8, title: 'general8', content: 'general888', writer: 'admin', date: '2023-07-19', views: 0 },
    { id: 9, title: 'general9', content: 'general999', writer: 'admin', date: '2023-07-18', views: 0 },
    { id: 10, title: 'general10', content: 'general1010', writer: 'admin', date: '2023-07-17', views: 0 },
    { id: 11, title: 'general1', content: 'general111', writer: 'admin', date: '2023-07-16', views: 0 },
    { id: 12, title: 'general2', content: 'general222', writer: 'admin', date: '2023-07-15', views: 0 },
    { id: 13, title: 'general3', content: 'general333', writer: 'admin', date: '2023-07-14', views: 0 },
    { id: 14, title: 'general4', content: 'general444', writer: 'admin', date: '2023-07-13', views: 0 },
    { id: 15, title: 'general5', content: 'general555', writer: 'admin', date: '2023-07-12', views: 0 },
    { id: 16, title: 'general6', content: 'general666', writer: 'admin', date: '2023-07-11', views: 0 },
    { id: 17, title: 'general7', content: 'general777', writer: 'admin', date: '2023-07-10', views: 0 },
    { id: 18, title: 'general8', content: 'general888', writer: 'admin', date: '2023-07-09', views: 0 },
    { id: 19, title: 'general9', content: 'general999', writer: 'admin', date: '2023-07-08', views: 0 },
    { id: 20, title: 'general10', content: 'general1010', writer: 'admin', date: '2023-07-07', views: 0 },
  ]

  const postsPerPage = 5;
  const totalPages = Math.ceil(dummyNotice.length / postsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // useEffect(() => {
  //   // URL query에 page 번호를 기록하려면 아래 코드를 활성화하세요.
  //   router.push(`/user/mypage?page=${currentPage}`);
  // }, [currentPage]);

  // 기존 dummyNotice를 sortedPosts로 교체
  const currentPosts = dummyNotice.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  /**
   * 닉네임을 유효성 검사하는 함수
   * 입력한 닉네임이 유효한지 확인하고, 유효하지 않은 경우 에러 메시지를 설정 
   */
  const validateNickname = () => {
    if (nickname.length < 2) {
      setErrorMessage('닉네임은 최소 2자 이상이어야 합니다.');
    } else if (nickname.length > 8) {
      setErrorMessage('닉네임은 최대 8자 입니다.');
    } else {
      setErrorMessage('');
    }
  };

  useEffect(() => {
    validateNickname();
  }, [nickname]);

  const changeNickname = () => {
    setNickname(nickname);
    setIsEditing(false);
  }
  
  /**
   * 클립보드에 작성자의 지갑 주소를 복사하는 함수
   * 복사가 성공하면 성공 메시지를, 실패하면 에러 메시지를 모달로 표시
   */
  const copyAddr = async () => {
    try {
      // await navigator.clipboard.writeText(postDetail.post_info.author.address);
      // setIsModalOpen(true);
      // setModalTitle('Success');
      // setModalBody('지갑주소가 복사되었습니다.');
      alert('지갑주소가 복사되었습니다.');

      // setTimeout(() => {
      //   setIsModalOpen(false);
      // }, 3000);
    } catch (err) {
      //   setIsModalOpen(true);
      // setModalTitle('Error');
      // setModalBody('지갑주소 복사가 실패되었습니다.');
      alert('지갑주소 복사가 실패되었습니다.');

      // setTimeout(() => {
      //   setIsModalOpen(false);
      // }, 3000);
    }
  }

  return (
    <div className="w-full min-h-screen">
      <div className="w-full h-[30rem] md:h-[25rem] sm:h-[20rem] xs:h-[15rem] border-2 border-dashed rounded-xl">
        <div className="
          w-full 
          h-full 
          text-gray-400 
          flex 
          items-center 
          justify-center">
          {fileUrl ? (  
            <div className="w-full h-full">
              <img src={fileUrl} className="w-full h-full object-contain" alt="NFT" />
            </div>
          ) : (
            <BsFillImageFill size={80} />
          )}        
        </div>
      </div>
      <div className='
        w-[15rem] 
        lg:w-[10rem] 
        md:w-[9rem] 
        sm:w-[9rem] 
        xs:w-[8rem] 
        h-[15rem] 
        lg:h-[10rem] 
        md:h-[9rem] 
        sm:h-[9rem] 
        xs:h-[8rem] 
        border-2 
        border-gray-200 
        rounded-full 
        absolute 
        top-[430px] 
        lg:top-[470px] 
        md:top-[400px] 
        sm:top-[335px] 
        xs:top-[240px] 
        left-[5%] 
        sm:left-[130px] 
        xs:left-[115px] 
        overflow-hidden
        shadow-lg'>
        <Image src={hero_img} layout='fill' objectFit='cover' alt='profile image' />
      </div>
      <div className='w-full h-full flex flex-col sm:items-center xs:items-center justify-center gap-6 px-12 sm:px-2 xs:px-2'>
        <div className='w-[10%] md:w-[80%] sm:w-full xs:w-full flex flex-col items-start sm:items-center xs:items-center gap-3 ml-[14%] lg:ml-[18%] md:ml-[20%] sm:ml-0 xs:ml-0 my-2 mt-5 sm:mt-24 xs:mt-20'>
          <div className='flex gap-12 sm:gap-4 xs:gap-2'>
            <p className='font-bold text-3xl lg:text-2xl md:text-xl sm:text-lg xs:text-lg'>
              {nickname}
            </p>
          </div>
          <p className='font-normal text-xs text-red-500'>{errorMessage}</p>
          <p className='font-semibold sm:text-sm xs:text-xs' onClick={copyAddr} title="Click to copy the address">
            0x3557db220dbfdBbB8Cf5489495Bf02AAC9A889ED
          </p>
          <div>
            <button className='px-3 py-2 sm:px-2 md:text-sm sm:text-sm xs:text-sm bg-[#FBA1B7] hover:bg-main-insta rounded-xl transition duration-300 text-white font-bold'>instagram connect</button>
          </div>
        </div>
        <div className='w-full h-2/3 grid grid-cols-10 lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-3 xs:grid-cols-3 gap-4 justify-items-center bg-gray-200 rounded-xl px-6 py-6'>
          <div className='w-[10rem] lg:w-[8rem] md:w-[6rem] sm:w-[6rem] xs:w-[5rem] h-[10rem] lg:h-[8rem] md:h-[6rem] sm:h-[6rem] xs:h-[5rem] border rounded-full overflow-hidden relative'>
            <Image src={hero_img} layout='fill' objectFit='cover' alt='profile image' />
          </div>
          <div className='w-[10rem] lg:w-[8rem] md:w-[6rem] sm:w-[6rem] xs:w-[5rem] h-[10rem] lg:h-[8rem] md:h-[6rem] sm:h-[6rem] xs:h-[5rem] border rounded-full overflow-hidden relative'>
            <Image src={hero_img} layout='fill' objectFit='cover' alt='profile image' />
          </div>
          <div className='w-[10rem] lg:w-[8rem] md:w-[6rem] sm:w-[6rem] xs:w-[5rem] h-[10rem] lg:h-[8rem] md:h-[6rem] sm:h-[6rem] xs:h-[5rem] border rounded-full overflow-hidden relative'>
            <Image src={hero_img} layout='fill' objectFit='cover' alt='profile image' />
          </div>
          <div className='w-[10rem] lg:w-[8rem] md:w-[6rem] sm:w-[6rem] xs:w-[5rem] h-[10rem] lg:h-[8rem] md:h-[6rem] sm:h-[6rem] xs:h-[5rem] border rounded-full overflow-hidden relative'>
            <Image src={hero_img} layout='fill' objectFit='cover' alt='profile image' />
          </div>
          <div className='w-[10rem] lg:w-[8rem] md:w-[6rem] sm:w-[6rem] xs:w-[5rem] h-[10rem] lg:h-[8rem] md:h-[6rem] sm:h-[6rem] xs:h-[5rem] border rounded-full overflow-hidden relative'>
            <Image src={hero_img} layout='fill' objectFit='cover' alt='profile image' />
          </div>
        </div>
        <div className='w-full h-2/3 flex flex-col gap-4 px-6 py-6 sm:px-2 xs:px-0'>
          <h2 className='text-3xl sm:text-2xl xs:text-xl font-bold border-b border-black pb-2'>Posts created</h2>
          <table className="w-full text-center border-collapse ">
            <thead className='border-b'>
              <tr>
                <th className="p-4 sm:p-2 xs:p-2">No.</th>
                <th className="p-4 sm:p-2 xs:p-2">Title</th>
                <th className="p-4 sm:p-2 xs:p-2">Content</th>
                <th className="p-4 sm:p-2 xs:p-2">Writer</th>
                <th className="p-4 sm:p-2 xs:p-2">Date</th>
                <th className="p-4 sm:p-2 xs:p-2">View</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center">작성한 게시글이 없습니다.</td>
                </tr>
              ) : (
                currentPosts.map((post) => (
                  <tr className="
                    hover:bg-gray-200 
                    transition-all 
                    duration-300 
                    cursor-pointer"
                    key={post.id}
                    onClick={() => router.push(`/posts/${post.id}`)}>
                    <td className="border-b p-6 sm:p-2 xs:p-2">
                      <p className="text-xl sm:text-sm xs:text-xs font-semibold">{post.id}</p>
                    </td>
                    <td className="border-b p-6 sm:p-2 xs:p-2">
                      <p className="text-gray-600 sm:text-sm xs:text-xs"> {post.title}</p>
                    </td>
                    <td className="border-b p-6 sm:p-2 xs:p-2">
                      <p className="text-gray-600 sm:text-sm xs:text-xs"> {post.content}</p>
                    </td>
                    <td className="border-b p-6 sm:p-2 xs:p-2">
                      <p className="text-gray-600 sm:text-sm xs:text-xs">
                        {post.writer}
                      </p>
                    </td>
                    <td className="border-b p-6 sm:p-2 xs:p-2">
                      <p className="text-gray-600 sm:text-sm xs:text-xs">
                        {post.date}
                      </p>
                    </td>
                    <td className="border-b p-6 sm:p-2 xs:p-2">
                      <p className="text-gray-600">
                        {post.views}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className='w-full mt-6 sm:mt-10 xs:mt-5 mb-5 flex justify-center'>
            <div className='flex items-center'>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`px-2 py-2 mx-1 xs:text-sm ${currentPage === i + 1 ? 'font-bold' : ''}`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile;