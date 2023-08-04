import React, { useState, useEffect } from 'react';
import useTranslation from 'next-translate/useTranslation';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import { AiOutlineDelete, AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { MdOutlineCreate } from 'react-icons/md';
import { ApiCaller } from './Utils/ApiCaller';
import { Comment, User } from './Interfaces';

const Comments = ({ postDetailId, comments }: { postDetailId: string, comments: Comment[] }) => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const [comment, setComment] = useState('');
  const [likedComments, setLikedComments] = useState<{ [key: string]: boolean }>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editCommentInput, setEditCommentInput] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);


  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem('user_info')) {
      const userCache = JSON.parse(sessionStorage.getItem('user_info') || '');
      setIsLoggedIn(userCache !== null);
      setUserInfo(userCache.user)
    }
  }, []);
  
  const createComment = async () => {
    const formData = new FormData();

    formData.append('post_id', postDetailId);
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
          router.reload();
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

  const likeComment = async (commentId: string) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments/like/${commentId}`;
      const dataBody = null;
      const isJSON = false;
      const headers = {};
      const isCookie = true;

      const res = await ApiCaller.patch(URL, dataBody, isJSON, headers, isCookie);
      if (res.status === 200) {
        setLikedComments({...likedComments, [commentId]: !likedComments[commentId]});
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

  const handleEditComment = (commentId: string) => {
    setEditingComment(commentId);
    setEditCommentInput(comment);
  };

  const editComment = async (commentId: string) => {
    const formData = new FormData();

    formData.append('comment_id', commentId);
    formData.append('content', editCommentInput);

    try {
      const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments/edit`;
      const dataBody = formData;
      const isJSON = false;
      const headers = {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
      };
      const isCookie = true;

      const res = await ApiCaller.patch(URL, dataBody, isJSON, headers, isCookie);
      if (res.status === 200) {
        Swal.fire({
          title: 'Success!',
          text: res.data.message,
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#6BCB77'
        }).then(() => {
          Swal.close();
          router.reload();
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

  const deleteComment = async (commentId: string) => {
    Swal.fire({
      title: 'Are you sure you want to delete it?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#6BCB77',
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#FF6B6B'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments/delete/${commentId}`;
          const dataBody = null;
          const isJSON = false;
          const headers = {};
          const isCookie = true;

          const res = await ApiCaller.delete(URL, dataBody, isJSON, headers, isCookie);
          if (res.status === 200) {
            Swal.fire({
              title: 'Success!',
              text: res.data.message,
              icon: 'success',
              confirmButtonText: 'OK',
              confirmButtonColor: '#6BCB77'
            }).then(() => {
              Swal.close();
              router.reload();
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
      } else if (result.isDismissed) {
        Swal.fire({
          title: 'Success!',
          text: 'You canceled deleting the comments.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#6BCB77',
        })
      }
    })
  }

  return (
    <>
      <div className='w-full flex flex-col gap-4'>
          <h2 className='text-xl font-bold xs:text-base'>{t('common:Comment')}</h2>
          {comments.length !== 0 ? (
            comments.map((comment, i) => {
              return (
                <div className='w-full grid grid-cols-2 items-center border rounded-xl p-3 sm:p-2' key={i}>
                  <div>
                  {editingComment === comment._id ? (
                    <div className='flex gap-2'>
                      <input
                        type="text"
                        value={editCommentInput}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditCommentInput(e.target.value)}
                        className="border rounded-xl px-2 py-1 w-32"
                      />
                      <button className='
                        bg-main-yellow 
                        hover:bg-yellow-400 
                        rounded-lg 
                        text-sm 
                        px-2 
                        py-1 
                        text-white 
                        transition 
                        duration-300'
                        onClick={() => { editComment(comment._id); setEditingComment(null); }}>
                        Save
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className='text-lg sm:text-base xs:text-xs font-semibold'>
                        {comment.content}
                      </p>
                    </>
                  )}
                  </div>
                  <div className='text-right flex justify-end gap-6 sm:gap-2 xs:gap-2'>
                    <div>
                      <p className='font-bold text-lg sm:text-sm xs:text-xs cursor-pointer hover:underline'
                        onClick={() => {
                          comment.user_id === null ? (
                            Swal.fire({
                              title: 'Error',
                              text: 'User does not exist.',
                              icon: 'error',
                              confirmButtonText: 'OK',
                              confirmButtonColor: '#6BCB77'
                            }).then(() => {
                              Swal.close();
                            })
                          ) : (
                            router.push(`/users/profile?id=${comment.user_id._id}`)
                          )
                        }}>
                        {comment.user_id === null ? t('common:Unknown') : comment.user_id.nickname}
                      </p>
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
                          <MdOutlineCreate className="text-red-500 cursor-pointer sm:w-[30%] xs:w-[30%]" size={26} onClick={() => handleEditComment(comment._id)} />
                          <AiOutlineDelete className="text-red-500 cursor-pointer sm:w-[30%] xs:w-[30%]" size={26} onClick={() => deleteComment(comment._id)} />
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
            placeholder={t('common:Please enter comments')}
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
              {t('common:Create')}
            </button>
          </div>
        </div>
    </>
  )
}

export default Comments;