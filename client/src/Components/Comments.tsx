import React, { useState, useEffect } from 'react';
import useTranslation from 'next-translate/useTranslation';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import { AiOutlineDelete, AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { MdOutlineCreate } from 'react-icons/md';
import { Comment } from './Interfaces';
import { showSuccessAlert, showErrorAlert } from '@/Redux/actions';
import { useUserSession } from '@/hooks/useUserSession';
import { userCreateComment, userLikeComment, userEditComment, userDeleteComment } from '@/services/api'

const Comments = ({ postDetailId, comments }: { postDetailId: string, comments: Comment[] }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { userData } = useUserSession();
  const { t } = useTranslation('common');

  const [comment, setComment] = useState('');
  const [likedComments, setLikedComments] = useState<{ [key: string]: boolean }>({});
  const [editCommentInput, setEditCommentInput] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /**
   * 로그인 여부를 세션 스토리지를 확인하여 설정합니다.
   */
  useEffect(() => {
    setIsLoggedIn(Boolean(sessionStorage.getItem('user')));
  }, []);

  /**
   * 댓글을 생성하는 함수
   */
  const createComment = async () => {
    try {
      const res = await userCreateComment(postDetailId, comment);

      if (res.status === 200) {
        dispatch(showSuccessAlert(res.data.message));
        router.reload();
      } else {
        dispatch(showErrorAlert(res.data.message));
      }
    } catch (error) {
      const err = error as AxiosError;

      const data = err.response?.data as { message: string };

      dispatch(showErrorAlert(data?.message));
    }
  }

  /**
   * 댓글에 '좋아요'를 표시하는 함수
   * @param {string} commentId - 좋아요를 누를 댓글의 ID
   */
  const likeComment = async (commentId: string) => {
    try {
      const res = await userLikeComment(commentId);
      if (res.status === 200) {
        const updatedLikes = { ...likedComments, [commentId]: !likedComments[commentId] };
        setLikedComments(updatedLikes);

        localStorage.setItem('likedComments', JSON.stringify(updatedLikes));
      } else {
        dispatch(showErrorAlert(res.data.message));
      }

    } catch (error) {
      const err = error as AxiosError;

      const data = err.response?.data as { message: string };
      dispatch(showErrorAlert(data?.message));
    }
  }

  useEffect(() => {
    const storedLikes = localStorage.getItem('likedComments');
    if (storedLikes) {
      setLikedComments(JSON.parse(storedLikes));
    }
  }, []);

  /**
   * 댓글 편집 모드로 전환하는 함수
   * @param {string} commentId - 편집할 댓글의 ID
   */
  const handleEditComment = (commentId: string) => {
    setEditingComment(commentId);
    setEditCommentInput(comment);
  };

  /**
   * 댓글을 편집하는 함수
   * @param {string} commentId - 편집할 댓글의 ID
   */
  const editComment = async (commentId: string) => {

    try {
      const res = await userEditComment(commentId, editCommentInput);
      if (res.status === 200) {
        dispatch(showSuccessAlert(res.data.message));
        router.reload();
      } else {
        dispatch(showErrorAlert(res.data.message));
      }
    } catch (error) {
      const err = error as AxiosError;

      const data = err.response?.data as { message: string };

      dispatch(showErrorAlert(data?.message));
    }
  }

  /**
   * 댓글을 삭제하기 전에 확인을 요구하는 다이얼로그를 표시하는 함수
   * @returns {Promise<SweetAlertResult>} - 사용자의 응답에 따른 SweetAlert 결과
   */
  const confirmDelete = () => {
    return Swal.fire({
      title: t('common:Are you sure you want to delete it'),
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#6BCB77',
      cancelButtonText: t('common:Cancel'),
      cancelButtonColor: '#FF6B6B'
    });
  }

  /**
   * 댓글을 삭제하는 함수
   * @param {string} commentId - 삭제할 댓글의 ID
   */
  const deleteComment = async (commentId: string) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        const res = await userDeleteComment(commentId);
        if (res.status === 200) {
          dispatch(showSuccessAlert(res.data.message));
          router.reload();
        } else {
          dispatch(showErrorAlert(res.data.message));
        }
      } catch (error) {
        const err = error as AxiosError;

        const data = err.response?.data as { message: string };

        dispatch(showErrorAlert(data?.message));
      }
    } else if (result.isDismissed) {
      dispatch(showSuccessAlert(t('common:You canceled deleting the comments')));
    }
  }

  return (
    <>
      <div className='w-full flex flex-col gap-4 my-6'>
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
                          dispatch(showErrorAlert(t('common:User does not exist')))
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
                    {likedComments[comment._id] ? (
                      <AiFillHeart className='text-main-red cursor-pointer sm:w-[30%] xs:w-[30%]' size={26} onClick={() => likeComment(comment._id)} />
                    ) : (
                      <AiOutlineHeart className='text-main-red cursor-pointer sm:w-[30%] xs:w-[30%]' size={26} onClick={() => likeComment(comment._id)} />
                    )}
                    {/* ... comment content ... */}
                    {isLoggedIn && userData?.user._id === comment.user_id?._id && (
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
