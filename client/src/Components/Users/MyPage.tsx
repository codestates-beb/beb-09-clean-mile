import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { AxiosError, AxiosResponse } from 'axios';
import { BsFillImageFill } from 'react-icons/bs';
import { User, Pagination, Post, EventList, Dnft, UserBadge } from '../Interfaces';
import { default_banner } from '../Reference';
import { ApiCaller } from '../Utils/ApiCaller';
import { showSuccessAlert, showErrorAlert } from '@/Redux/actions'

const EXTENSIONS = [
  { type: 'gif' },
  { type: 'jpg' },
  { type: 'jpeg' },
  { type: 'png' },
  { type: 'mp4' },
];

const MyPage = ({
  userInfo,
  eventPagination,
  postPagination,
  userDnft,
  userBadges
}: {
  userInfo: User,
  eventPagination: Pagination,
  postPagination: Pagination,
  userDnft: Dnft,
  userBadges: UserBadge[]
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation('common');

  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(userInfo?.nickname);
  const [errorMessage, setErrorMessage] = useState('');
  const [postCurrentPage, setPostCurrentPage] = useState(1);
  const [eventCurrentPage, setEventCurrentPage] = useState(1);
  const [postData, setPostData] = useState<Post[]>([]);
  const [eventsData, setEventsData] = useState<EventList[] | null>(null);
  const [isQrVisible, setIsQrVisible] = useState(false);

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
            setUploadFile(FILE);
          }
        });
      }
    }
  }

  const postTotalPages = postPagination?.totalPages;
  const eventTotalPages = eventPagination?.totalPages;

  const handlePostPageChange = async (pageNumber: number) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile/postPagination/${userInfo._id}?page=${pageNumber}`;
      const dataBody = null;
      const isJSON = false;
      const headers = {};
      const isCookie = true;

      const res = await ApiCaller.get(URL, dataBody, isJSON, headers, isCookie);

      setPostData(res.data.data.data);
      setPostCurrentPage(pageNumber);

    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    (async () => {
      await handlePostPageChange(postCurrentPage);
    })();
  }, []);

  const handleEventPageChange = async (pageNumber: number) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile/eventPagination/${userInfo._id}?page=${pageNumber}`;
      const dataBody = null;
      const isJSON = false;
      const headers = {};
      const isCookie = true;

      const res = await ApiCaller.get(URL, dataBody, isJSON, headers, isCookie);

      setEventsData(res.data.data.data);
      setEventCurrentPage(pageNumber);

    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    (async () => {
      await handleEventPageChange(eventCurrentPage);
    })();
  }, []);


  const myPageEdit = () => {
    setIsEditing(true);
  };

  /**
   * 닉네임을 유효성 검사하는 함수
   * 입력한 닉네임이 유효한지 확인하고, 유효하지 않은 경우 에러 메시지를 설정 
   */
  const validateNickname = () => {
    if (nickname?.length < 2) {
      setErrorMessage('닉네임은 최소 2자 이상이어야 합니다.');
    } else if (nickname?.length > 8) {
      setErrorMessage('닉네임은 최대 8자 입니다.');
    } else {
      setErrorMessage('');
    }
  };

  useEffect(() => {
    validateNickname();
  }, [nickname]);

  const profileChange = async () => {
    const hasNicknameChange = nickname !== userInfo.nickname;
    const hasImageChange = uploadFile !== null;

    try {
      const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/change-nickname`;
      const URL2 = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/change-banner`;
      const isJSON = false;
      const headers = {}
      const isCookie = true;

      if (hasNicknameChange) {
        const formData = new FormData();
        formData.append('nickname', nickname);
        const res = await ApiCaller.patch(URL, formData, isJSON, headers, isCookie);
        handleResponse(res);
      }

      if (hasImageChange) {
        const formData = new FormData();
        formData.append('imgFile', uploadFile);
        const res = await ApiCaller.patch(URL2, formData, isJSON, headers, isCookie);
        handleResponse(res);
        setFileUrl(res.data.imageUrl);
      }

    } catch (error) {
      const err = error as AxiosError;

      const data = err.response?.data as { message: string };

      dispatch(showErrorAlert(data?.message));
    }
  }

  const handleResponse = (res: AxiosResponse) => {
    if (res.status === 200) {
      dispatch(showSuccessAlert(t('common:Profile change was successful')))
      router.reload();
      setIsEditing(false);
    } else {
      dispatch(showSuccessAlert(res.data.message));
    }
  }

  /**
   * 클립보드에 작성자의 지갑 주소를 복사하는 함수
   * 복사가 성공하면 성공 메시지를, 실패하면 에러 메시지를 모달로 표시
   */
  const copyAddr = async () => {
    try {
      await navigator.clipboard.writeText(userInfo.wallet.address);
      dispatch(showSuccessAlert(t('common:Your wallet address has been copied')))
    } catch (err) {
      dispatch(showErrorAlert(t('commonFailed to copy wallet address')));
    }
  }

  const tokenExchange = async () => {
    const formData = new FormData();
    
    formData.append('userId', userInfo._id);

    try {
      const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/token-exchange`;
      const dataBody = formData;
      const isJSON = true;
      const headers = {}
      const isCookie = true;

      const res = await ApiCaller.post(URL, dataBody, isJSON, headers, isCookie);
      if(res.status === 200) {
        dispatch(showSuccessAlert(res.data?.message));
      } else {
        dispatch(showErrorAlert(res.data?.message));
      }
    } catch (error) {
      const err = error as AxiosError;

      const data = err.response?.data as { message: string };

      dispatch(showErrorAlert(data?.message));
    }
  }

  const upgradeDnft = async () => {
    Swal.showLoading();

    const formData = new FormData();

    formData.append('email', userInfo.email);
    try {
      const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/upgrade-dnft`;
      const dataBody = formData;
      const isJSON = true;
      const headers = {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      }
      const isCookie = true;
  
      const res = await ApiCaller.post(URL, dataBody, isJSON, headers, isCookie);
      
      Swal.close();

      if(res.status === 200) {
        dispatch(showSuccessAlert(res.data?.message));
      } else {
        dispatch(showErrorAlert(res.data?.message));
      }
    } catch (error) {
      Swal.close();
      const err = error as AxiosError;

      const data = err.response?.data as { message: string };

      dispatch(showErrorAlert(data?.message));
    }
  }

  const getClassNameForStatus = (status: string) => {
    switch (status) {
      case 'created': return 'bg-main-insta';
      case 'recruiting': return 'bg-main-blue';
      case 'progressing': return 'bg-main-green';
      case 'finished': return 'bg-main-red';
      case 'canceled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  }

  const getClassNameForType = (type: string) => {
    switch (type) {
      case 'fcfs': return 'bg-main-yellow';
      case 'random': return 'bg-main-green';
      default: return 'bg-gray-500';
    }
  }

  return (
    <>
      <div className="w-full min-h-screen">
        <div className={`w-full h-[30rem] md:h-[25rem] sm:h-[20rem] xs:h-[15rem] ${isEditing ? 'border-2 border-dashed' : 'border-2'} rounded-xl`}>
          {isEditing ? (
            <label className="
              h-full 
              text-gray-400 
              flex 
              items-center 
              justify-center 
              cursor-pointer
              hover:bg-gray-300
              transition
              duration-300"
              htmlFor="nft-file">
              {fileUrl ? (
                <div className="w-full h-full">
                  <Image src={fileUrl} width={1500} height={100} className="w-full h-full object-contain" alt="banner Image" />
                </div>
              ) : (
                <BsFillImageFill size={80} />
              )}
              <input
                className="hidden"
                id="nft-file"
                type="file"
                accept="image/*,video/*"
                onChange={fileUpload}
                required />
            </label>
          ) : (
            <Image src={!userInfo?.banner_img_url ? default_banner : userInfo?.banner_img_url} width={1500} height={100} className="w-full h-full object-contain" alt="banner Image" />
          )}
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
          xs:top-[280px] 
          left-[5%] 
          sm:left-[130px] 
          xs:left-[115px] 
          overflow-hidden
          shadow-lg'>
          <Image src={userDnft.image_url} layout='fill' className='object-cover' alt='profile image' />
        </div>
        <div className='w-full h-full flex flex-col sm:items-center xs:items-center justify-center gap-6 px-12 sm:px-2 xs:px-2'>
          <div className='w-[80%] md:w-[80%] sm:w-full xs:w-full flex flex-col items-start sm:items-center xs:items-center gap-3 ml-[14%] lg:ml-[18%] md:ml-[20%] sm:ml-0 xs:ml-0 my-2 mt-5 sm:mt-24 xs:mt-20'>
            <div className='w-full flex justify-between sm:justify-center xs:justify-center gap-12 sm:gap-4 xs:gap-2'>
              {isEditing ? (
                <input
                  type="text"
                  value={nickname}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNickname(e.target.value)}
                  className="border rounded-xl px-2 py-1 w-32"
                />
              ) : (
                <>
                  <p className='font-bold text-3xl lg:text-2xl md:text-xl sm:text-lg xs:text-lg'>
                    {userInfo?.nickname}
                  </p>
                </>
              )}
              {isEditing ? (
                <button className='
                  text-white 
                  font-semibold 
                  bg-main-yellow 
                  hover:bg-yellow-400 
                  px-8 
                  lg:px-6
                  xs:px-4
                  xs:text-sm
                  py-1 
                  rounded-lg 
                  transition 
                  duration-300
                  cursor-pointer'
                  type="button"
                  onClick={profileChange}
                  disabled={errorMessage !== ''}
                >
                  {t('common:Save')}
                </button>
              ) : (
                <button className='
                  text-white 
                  font-semibold 
                  bg-main-yellow 
                  hover:bg-yellow-400 
                  px-8 
                  lg:px-6
                  xs:px-4
                  xs:text-sm
                  py-1 
                  rounded-lg 
                  transition 
                  duration-300
                  cursor-pointer'
                  type="button"
                  onClick={myPageEdit}
                >
                  {t('common:Edit')}
                </button>
              )}
            </div>
            {isEditing && <p className='font-normal text-xs text-red-500'>{errorMessage}</p>}
            <p className='font-semibold sm:text-sm xs:text-xs cursor-pointer' onClick={copyAddr} title="Click to copy the address">
              {userInfo?.wallet?.address}
            </p>
            <div className='flex items-center justify-center gap-2'>
              <p className='font-semibold sm:text-sm xs:text-xs'>
                {t('common:Mileage')}: {userInfo?.wallet?.mileage_amount}
              </p>
              <p className='font-semibold sm:text-sm xs:text-xs'>
                |
              </p>
              <p className='font-semibold sm:text-sm xs:text-xs'>
                {t('common:Token')}: {userInfo?.wallet?.token_amount} CM
              </p>
              <p className='font-semibold sm:text-sm xs:text-xs'>
                |
              </p>
              <p className='font-semibold sm:text-sm xs:text-xs'>
                {t('common:Total Badge Score')}: {userInfo?.wallet?.total_badge_score}
              </p>
            </div>
            <div className='flex gap-2'>
              <button className='
                px-3 
                py-2 
                sm:px-2 
                md:text-sm 
                sm:text-sm 
                xs:text-sm 
                bg-[#FBA1B7] 
                hover:bg-main-insta 
                rounded-xl 
                transition 
                duration-300 
                text-white 
                font-bold'>
                {t('common:Instagram Connect')}
              </button>
              <button className='
                px-3 
                py-2 
                sm:px-2 
                md:text-sm 
                sm:text-sm 
                xs:text-sm 
                bg-main-green 
                hover:bg-green-500 
                rounded-xl 
                transition 
                duration-300 
                text-white 
                font-bold'
                onClick={upgradeDnft}>
                {t('common:DNFT Upgrade')}
              </button>
              <button className='
                px-3 
                py-2 
                sm:px-2 
                md:text-sm 
                sm:text-sm 
                xs:text-sm 
                bg-main-blue 
                hover:bg-blue-500 
                rounded-xl 
                transition 
                duration-300 
                text-white 
                font-bold'
                onClick={tokenExchange}>
                {t('common:Token Exchange')}
              </button>
              <button className='
                px-3 
                py-2 
                sm:px-2 
                md:text-sm 
                sm:text-sm 
                xs:text-sm 
                bg-main-yellow 
                hover:bg-yellow-500 
                rounded-xl 
                transition 
                duration-300 
                text-white 
                font-bold'
                onClick={() => router.push('/qrscan')}>
                {t('common:QR Code Scan')}
              </button>
            </div>
          </div>
          <div className={`w-full h-2/3 ${userBadges.length === 0 ? 'flex font-bold' : 'grid grid-cols-10'} lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-3 xs:grid-cols-3 gap-4 justify-items-center bg-gray-200 rounded-xl px-6 py-6`}>
            {userBadges.length === 0 ? (
              <p className='w-full flex justify-center items-center'>{t('common:There are no registered badges')}</p>
            ) : (
              userBadges.map((badge, i) => {
                return (
                  <div className='w-[10rem] 
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
                    key={i}>
                    <Image src={badge.image} layout='fill' objectFit='cover' alt='profile image' />
                  </div>
                )
              })
            )}
          </div>
          <div className='w-full h-2/3 flex flex-col gap-4 px-6 py-6 sm:px-2 xs:px-0'>
            <h2 className='text-3xl sm:text-2xl xs:text-xl font-bold border-b border-black pb-2'>{t('common:Participated Events')}</h2>
            <table className="w-full text-center border-collapse ">
              <thead className='border-b sm:text-sm xs:text-xs'>
                <tr>
                  <th className="p-4 md:p-2 sm:p-1 xs:p-1">{t('common:No')}</th>
                  <th className="p-4 md:p-2 sm:p-1 xs:p-1">{t('common:Title')}</th>
                  <th className="p-4 md:p-2 sm:p-1 xs:p-1">{t('common:Content')}</th>
                  <th className="p-4 md:p-2 sm:p-1 xs:p-1">{t('common:Writer')}</th>
                  <th className="p-4 md:p-2 sm:p-1 xs:p-1">{t('common:Event Type')}</th>
                  <th className="p-4 md:p-2 sm:p-1 xs:p-1">{t('common:Status')}</th>
                  <th className="p-4 md:p-2 sm:p-1 xs:p-1">{t('common:Date')}</th>
                  <th className="p-4 md:p-2 sm:p-1 xs:p-1">{t('common:Views')}</th>
                </tr>
              </thead>
              <tbody>
                {eventsData === null ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center">{t('common:No events participated')}</td>
                  </tr>
                ) : (
                  eventsData?.map((event, i) => (
                    <tr className="
                      hover:bg-gray-200 
                      transition-all 
                      duration-300 
                      cursor-pointer
                      sm:text-sm"
                      key={i}
                      onClick={() => router.push(`/posts/events/${event._id}`)}>
                      <td className="border-b p-6 md:p-2 sm:p-1 xs:p-1">
                        <p className="text-xl sm:text-xs xs:text-xs font-semibold">{i + 1}</p>
                      </td>
                      <td className="border-b p-6 md:p-2 sm:p-1 xs:p-1">
                        <p className="text-gray-600 sm:text-xs xs:text-xs">{event.title}</p>
                      </td>
                      <td className="border-b p-6 md:p-2 sm:p-1 xs:p-1">
                        <p className="text-gray-600 sm:text-xs xs:text-xs">{event.content.length >= 10 ? event.content.slice(0, 10) + '...' : event.content}</p>
                      </td>
                      <td className="border-b p-6 md:p-2 sm:p-1 xs:p-1">
                        <p className="text-gray-600 sm:text-xs xs:text-xs">
                          {event.host_id.name}
                        </p>
                      </td>
                      <td className="border-b p-6 md:p-2 sm:p-1 xs:p-1">
                        <p className={`sm:text-xs xs:text-xs rounded-lg text-white font-semibold py-1 ${getClassNameForType(event.event_type)}`}>
                          {(() => {
                            switch (event.event_type) {
                              case 'fcfs': return t('common:First come, first served');
                              case 'random': return t('common:Draw lots');
                              default: return '';
                            }
                          })()}
                        </p>
                      </td>
                      <td className="border-b p-6 md:p-2 sm:p-1 xs:p-1">
                        <p className={`sm:text-xs xs:text-xs rounded-lg text-white font-semibold py-1 ${getClassNameForStatus(event.status)}`}>
                          {(() => {
                            switch (event.status) {
                              case 'created': return t('common:Before proceeding');
                              case 'recruiting': return t('common:Recruiting');
                              case 'progressing': return t('common:In progress');
                              case 'finished': return t('common:End of progress');
                              case 'canceled': return t('common:Cancel Progress');
                              default: return t('common:Unknown');
                            }
                          })()}
                        </p>
                      </td>
                      <td className="border-b p-6 md:p-2 sm:p-1 xs:p-1">
                        <p className="text-gray-600 sm:text-xs xs:text-xs">
                          {event.updated_at.split('T')[0]}<br />{event.updated_at.substring(11, 19)}
                        </p>
                      </td>
                      <td className="border-b p-6 md:p-2 sm:p-1 xs:p-1">
                        <p className="text-gray-600 sm:text-xs xs:text-xs">
                          {event.view.count}
                        </p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className='w-full mt-6 sm:mt-10 xs:mt-5 mb-5 flex justify-center'>
              <div className='flex items-center'>
                {Array.from({ length: eventTotalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`px-2 py-2 mx-1 xs:text-sm ${eventCurrentPage === i + 1 ? 'font-bold' : ''}`}
                    onClick={() => handleEventPageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className='w-full h-2/3 flex flex-col gap-4 px-6 py-6 sm:px-2 xs:px-0'>
            <h2 className='text-3xl sm:text-2xl xs:text-xl font-bold border-b border-black pb-2'>{t('common:Posts created')}</h2>
            <table className="w-full text-center border-collapse ">
              <thead className='border-b'>
                <tr>
                  <th className="p-2">{t('common:No')}</th>
                  <th className="p-2">{t('common:Title')}</th>
                  <th className="p-2">{t('common:Content')}</th>
                  <th className="p-2">{t('common:Writer')}</th>
                  <th className="p-2">{t('common:Date')}</th>
                  <th className="p-2">{t('common:Views')}</th>
                </tr>
              </thead>
              <tbody>
                {postData === null ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center">{t('common:No post was created')}</td>
                  </tr>
                ) : (
                  postData?.map((post, i) => (
                    <tr className="
                      hover:bg-gray-200 
                      transition-all 
                      duration-300 
                      cursor-pointer"
                      key={i}
                      onClick={() => router.push(`/posts/general/${post._id}`)}>
                      <td className="border-b p-6 md:p-2 sm:p-2 xs:p-2">
                        <p className="text-xl sm:text-xs xs:text-xs font-semibold">{i + 1}</p>
                      </td>
                      <td className="border-b p-6 md:p-2 sm:p-2 xs:p-2">
                        <p className="text-gray-600 sm:text-xs xs:text-xs">{post.title.length >= 10 ? post.title.slice(0, 10) + '...' : post.title}</p>
                      </td>
                      <td className="border-b p-6 md:p-2 sm:p-2 xs:p-2">
                        <p className="text-gray-600 sm:text-xs xs:text-xs">{post.content.length >= 20 ? post.content.slice(0, 20) + '...' : post.content}</p>
                      </td>
                      <td className="border-b p-6 md:p-2 sm:p-2 xs:p-2">
                        <p className="text-gray-600 sm:text-xs xs:text-xs">
                          {post.user_id?.nickname}
                        </p>
                      </td>
                      <td className="border-b p-6 md:p-2 sm:p-2 xs:p-2">
                        <p className="text-gray-600 sm:text-xs xs:text-xs">
                          {post.updated_at.split('T')[0]}<br />{post.updated_at.substring(11, 19)}
                        </p>
                      </td>
                      <td className="border-b p-6 md:p-2 sm:p-2 xs:p-2">
                        <p className="text-gray-600 sm:text-xs xs:text-xs">
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
                {Array.from({ length: postTotalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`px-2 py-2 mx-1 xs:text-sm ${postCurrentPage === i + 1 ? 'font-bold' : ''}`}
                    onClick={() => handlePostPageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default MyPage;