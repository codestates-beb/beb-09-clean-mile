import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import { AiOutlineDelete, AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { MdOutlineCreate } from 'react-icons/md';
import { ApiCaller } from './Utils/ApiCaller';
import { PostDetail, Comment, UserInfo } from './Interfaces';



const Comments = ({ postDetail, comments }: { postDetail: PostDetail, comments: Comment[] }) => {
  const router = useRouter();
  const [comment, setComment] = useState('');
  const [likedComments, setLikedComments] = useState<{ [key: string]: boolean }>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);


  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem('user')) {
      const userCache = JSON.parse(localStorage.getItem('user') || '');
      setIsLoggedIn(userCache !== null);
      setUserInfo(userCache.queries[0]?.state.data)
    }
  }, []);
  
  const createComment = async () => {
    const formData = new FormData();

    formData.append('post_id', postDetail._id);
    formData.append('content', comment);

    try {
      const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments/create`;
      const dataBody = formData;
      const isJSON = false;
      const headers = {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
      };
      const isCookie = true;

      const res = await ApiCaller.post(URL, dataBody, isJSON, headers, isCookie);
      if (res.status === 200) {
        Swal.fire({
          title: 'Success!',
          text: res.data.message,
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#6BCB77'
        }).then(() => {
          Swal.close();
          router.replace(`/users/mypage?nickname=`);
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: res.data.message,
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#6BCB77'
        }).then(() => {
          Swal.close();
        });
      }
    } catch (error) {
      const err = error as AxiosError;

      const data = err.response?.data as { message: string };

      Swal.fire({
        title: 'Error',
        text: data?.message,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#6BCB77'
      }).then(() => {
        Swal.close();
      });
    }
  }

  const likeComment = async (comment_id: string) => {
    console.log(comment_id)
    try {
      const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments/like/${comment_id}`;
      const dataBody = null;
      const isJSON = false;
      const headers = {};
      const isCookie = true;

      const res = await ApiCaller.post(URL, dataBody, isJSON, headers, isCookie);
      if (res.status === 200) {
        setLikedComments({...likedComments, [comment_id]: !likedComments[comment_id]});
      }


    } catch (error) {
      const err = error as AxiosError;

      const data = err.response?.data as { message: string };

      Swal.fire({
        title: 'Error',
        text: data?.message,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#6BCB77'
      }).then(() => {
        Swal.close();
      });
    }
  }

  const editComment = async () => {
    
  }


  return (
    <>
      <div className='w-full flex flex-col gap-4'>
          <h2 className='text-xl font-bold xs:text-base'>Comment</h2>
          {comments.length !== 0 ? (
            comments.map((comment, i) => {
              return (
                <div className='w-full grid grid-cols-2 items-center border rounded-xl p-3 sm:p-2' key={i}>
                  <div>
                    <p className='text-lg sm:text-base xs:text-xs font-semibold'>{comment.content}</p>
                  </div>
                  <div className='text-right flex justify-end gap-6 sm:gap-2 xs:gap-2'>
                    <div>
                      <p className='font-bold text-lg sm:text-sm xs:text-xs cursor-pointer hover:underline' onClick={() => router.push(`/user/profile`)}>{comment.user_id.nickname}</p>
                      <div>
                        <p className='text-sm sm:text-xs xs:text-xs'>
                          {comment.updated_at.split('T')[0]} {comment.updated_at.substring(11, 19)}
                        </p>
                      </div>
                    </div>
                    <div className='flex justify-end items-center gap-4 sm:gap-2 xs:gap-2'>
                      {likedComments[comment._id] ?  (
                        <AiFillHeart className='text-main-red cursor-pointer sm:w-[30%] xs:w-[30%]' size={26} onClick={() => likeComment(comment._id)}/>
                      ) : (
                        <AiOutlineHeart className='text-main-red cursor-pointer sm:w-[30%] xs:w-[30%]' size={26} onClick={() => likeComment(comment._id)} />
                      )}
                      {/* ... comment content ... */}
                      {isLoggedIn && userInfo?._id === comment.user_id._id && (
                        <>
                          <MdOutlineCreate className="text-red-500 cursor-pointer sm:w-[30%] xs:w-[30%]" size={26} />
                          <AiOutlineDelete className="text-red-500 cursor-pointer sm:w-[30%] xs:w-[30%]" size={26} />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            null
          )}
          <textarea
            className='border border-gray-300 rounded-lg p-2 w-full outline-none'
            rows={4}
            placeholder='댓글을 입력하세요.'
            value={comment}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
          />
          <div className='flex justify-end'>
            <button className='
              py-2 
              px-4
              sm:px-6 
              xs:px-6
              bg-main-blue
              text-white 
              text-lg
              sm:text-sm
              xs:text-sm
              rounded-md 
              hover:bg-blue-600 
              transition 
              duration-300'
              onClick={createComment}>
              Create
            </button>
          </div>
        </div>
    </>
  )
}

export default Comments;