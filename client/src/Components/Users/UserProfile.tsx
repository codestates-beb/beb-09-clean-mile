import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { User, Pagination, Dnft, UserBadge } from '../Interfaces';
import { default_banner } from '../Reference';
import { showSuccessAlert, showErrorAlert } from '@/Redux/actions';
import { fetchPageData } from '@/services/api';

const UserProfile = ({
  userInfo,
  postPagination,
  userDnft,
  userBadges,
}: {
  userInfo: User;
  postPagination: Pagination;
  userDnft: Dnft;
  userBadges: UserBadge[];
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation('common');

  const [currentPage, setCurrentPage] = useState(1);
  const [postData, setPostData] = useState<Post[]>([]);

  const totalPages = postPagination?.totalPages;

  const handlePageChange = async (pageNumber: number) => {
    try {
      const res = await fetchPageData('users/profile/postPagination', userInfo._id, pageNumber);

      setPostData(res.data.data.data);
      setCurrentPage(pageNumber);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      await handlePageChange(currentPage);
    })();
  }, []);

  /**
   * 클립보드에 작성자의 지갑 주소를 복사하는 함수
   * 복사가 성공하면 성공 메시지를, 실패하면 에러 메시지를 모달로 표시
   */
  const copyAddr = async () => {
    try {
      await navigator.clipboard.writeText(userInfo.wallet.address);

      dispatch(showSuccessAlert(t('common:Your wallet address has been copied')));
    } catch (err) {
      dispatch(showErrorAlert(t('common:Failed to copy wallet address')));
    }
  };

  return (
    <div className='w-full min-h-screen'>
      <div className='w-full h-[30rem] md:h-[25rem] sm:h-[20rem] xs:h-[15rem] border-2 border-dashed rounded-xl'>
        <Image src={!userInfo?.banner_img_url ? default_banner : userInfo?.banner_img_url} width={1500} height={100} className="w-full h-full object-contain" alt="banner Image" />
      </div>
      <div
        className='
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
        xs:top-[280px] 
        left-[5%] 
        sm:left-[130px] 
        xs:left-[115px] 
        overflow-hidden
        shadow-lg'
      >
        <Image
          src={userDnft.image_url}
          layout='fill'
          className='object-cover'
          alt='profile image'
        />
      </div>
      <div className='w-full h-full flex flex-col sm:items-center xs:items-center justify-center gap-6 px-12 sm:px-2 xs:px-2'>
        <div className='w-[80%] md:w-[80%] sm:w-full xs:w-full flex flex-col items-start sm:items-center xs:items-center gap-3 ml-[14%] lg:ml-[18%] md:ml-[20%] sm:ml-0 xs:ml-0 my-2 mt-5 sm:mt-24 xs:mt-20'>
          <div className='w-full flex justify-between sm:justify-center xs:justify-center gap-12 sm:gap-4 xs:gap-2'>
            <p className='font-bold text-3xl lg:text-2xl md:text-xl sm:text-lg xs:text-lg'>
              {userInfo?.nickname}
            </p>
          </div>
          <p
            className='font-semibold sm:text-sm xs:text-xs cursor-pointer'
            onClick={copyAddr}
            title='Click to copy the address'
          >
            {userInfo?.wallet?.address}
          </p>
          <div>
            <p className='px-3 py-2 sm:px-2 md:text-sm sm:text-sm xs:text-sm bg-[#FBA1B7] hover:bg-main-insta rounded-xl transition duration-300 text-white font-bold'>
              @insta_id
            </p>
          </div>
        </div>
        <div
          className={`w-full h-2/3 ${
            userBadges.length === 0 ? 'flex font-bold' : 'grid grid-cols-10'
          } lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-3 xs:grid-cols-3 gap-4 justify-items-center bg-gray-200 rounded-xl px-6 py-6`}
        >
          {userBadges?.length === 0 ? (
            <p className='w-full flex justify-center items-center'>
              {t('common:There are no registered badges')}
            </p>
          ) : (
            userBadges?.map((badge, i) => {
              return (
                <div
                  className='w-[10rem] 
                    lg:w-[8rem] 
                    md:w-[6rem] 
                    sm:w-[6rem] 
                    xs:w-[5rem] 
                    h-[10rem] 
                    lg:h-[8rem] 
                    md:h-[6rem] 
                    sm:h-[6rem] 
                    xs:h-[5rem] 
                    border 
                    rounded-full 
                    overflow-hidden 
                    relative'
                  key={i}
                >
                  <Image
                    src={badge.image}
                    layout='fill'
                    className='object-cover'
                    alt='profile image'
                  />
                </div>
              );
            })
          )}
        </div>
        <div className='w-full h-2/3 flex flex-col gap-4 px-6 py-6 sm:px-2 xs:px-0'>
          <h2 className='text-3xl sm:text-2xl xs:text-xl font-bold border-b border-black pb-2'>
            {t('common:Posts created')}
          </h2>
          <table className='w-full text-center border-collapse '>
            <thead className='border-b'>
              <tr>
                <th className='p-2'>{t('common:No')}</th>
                <th className='p-2'>{t('common:Title')}</th>
                <th className='p-2'>{t('common:Content')}</th>
                <th className='p-2'>{t('common:Writer')}</th>
                <th className='p-2'>{t('common:Date')}</th>
                <th className='p-2'>{t('common:Views')}</th>
              </tr>
            </thead>
            <tbody>
              {postData === null ? (
                <tr>
                  <td colSpan={6} className='p-6 text-center'>
                    No post was created.
                  </td>
                </tr>
              ) : (
                postData?.map((post, i) => (
                  <tr
                    className='
                    hover:bg-gray-200 
                    transition-all 
                    duration-300 
                    cursor-pointer'
                    key={i}
                    onClick={() => router.push(`/posts/general/${post._id}`)}
                  >
                    <td className='border-b p-6 md:p-2 sm:p-2 xs:p-2'>
                      <p className='text-xl sm:text-xs xs:text-xs font-semibold'>
                        {i + 1}
                      </p>
                    </td>
                    <td className='border-b p-6 md:p-2 sm:p-2 xs:p-2'>
                      <p className='text-gray-600 sm:text-xs xs:text-xs'>
                        {post.title.length >= 10
                          ? post.title.slice(0, 10) + '...'
                          : post.title}
                      </p>
                    </td>
                    <td className='border-b p-6 md:p-2 sm:p-2 xs:p-2'>
                      <p className='text-gray-600 sm:text-xs xs:text-xs'>
                        {post.content.length >= 20
                          ? post.content.slice(0, 20) + '...'
                          : post.content}
                      </p>
                    </td>
                    <td className='border-b p-6 md:p-2 sm:p-2 xs:p-2'>
                      <p className='text-gray-600 sm:text-xs xs:text-xs'>
                        {post.user_id.nickname}
                      </p>
                    </td>
                    <td className='border-b p-6 md:p-2 sm:p-2 xs:p-2'>
                      <p className='text-gray-600 sm:text-xs xs:text-xs'>
                        {post.updated_at.split('T')[0]}
                        <br />
                        {post.updated_at.substring(11, 19)}
                      </p>
                    </td>
                    <td className='border-b p-6 md:p-2 sm:p-2 xs:p-2'>
                      <p className='text-gray-600 sm:text-xs xs:text-xs'>
                        {post.view.count}
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
                  className={`px-2 py-2 mx-1 xs:text-sm ${
                    currentPage === i + 1 ? 'font-bold' : ''
                  }`}
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
  );
};

export default UserProfile;
