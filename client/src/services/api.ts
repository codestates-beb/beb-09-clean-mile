import { ApiCaller } from '@/Components/Utils/ApiCaller';
import { QueryFunctionContext } from 'react-query';
import { LoginAPIOutput } from '@/Components/Interfaces';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getUserInfo = async () => {
  const URL = `${BASE_URL}/users/userInfo`;
  return await ApiCaller.get(URL, null, false, {}, true);
}

export const userLogout = async () => {
  const URL = `${BASE_URL}/users/logout`;
  const headers = {
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json',
  };

  return await ApiCaller.post(URL, null, false, headers, true);
}

export const getLatestNotice = async () => {
  const URL = `${BASE_URL}/posts/notices_latest`;
  return await ApiCaller.get(URL, null, false, {}, true);
}

export const enterEvent = async (eventId: string) => {
  const URL = `${BASE_URL}/events/entry/${eventId}`;
  return await ApiCaller.post(URL, null, false, {}, true);
}

export const fetchEventsWithPaging = async ({ pageParam = 'defaultId' }: QueryFunctionContext<'events'>) => {
  const URL = `${BASE_URL}/events/list?last_id=${pageParam}`;

  const res = await ApiCaller.get(URL, null, false, {}, true);
  if (res.status === 200 && res.data.data.data) {
    return res.data.data.data;
  }
  throw new Error('Error fetching data');
}

export const userPostDelete = async (postId: string) => {
  const URL = `${BASE_URL}/posts/delete/${postId}`;
  return await ApiCaller.delete(URL, null, false, {}, true);
}

interface IFile extends File {
  preview?: string;
}

export const updatePost = async (postId: string, title: string, content: string, images: IFile[], videos: IFile[]) => {
  const formData = new FormData();

  formData.append('post_id', postId);
  formData.append('title', title);
  formData.append('content', content);
  images.forEach((image) => formData.append('image', image));
  videos.forEach((video) => formData.append('video', video));

  const URL = `${BASE_URL}/posts/edit`;
  const headers = {
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json',
  };


  const res = await ApiCaller.patch(URL, formData, false, headers, true);

  if (res.status !== 200) {
    throw new Error(res.data.message);
  }

  return postId;
}

export const fetchReviews = async ({ pageParam = 'defaultId' }: QueryFunctionContext<'reviews'>) => {
  const URL = `${BASE_URL}/posts/lists/review?last_id=${pageParam}`;
  const res = await ApiCaller.get(URL, null, false, {}, true);
  if (res.status === 200 && res.data.data.data) {
    return res.data.data.data;
  }
  throw new Error('Error fetching data');
};

interface LoginResponse {
  status: number;
  data: {
    message: string;
    data: LoginAPIOutput; // Assuming LoginAPIOutput is your actual data type.
  };
}

export const userLogin = async ({ email, password }: { email: string, password: string }): Promise<LoginResponse> => {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);
  
  const URL = `${BASE_URL}/users/login`;
  const headers = {
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json',
  };


  return await ApiCaller.post(URL, formData, false, headers, true);
}

export const userCheckEmail = async (email: string) => {
  const formData = new FormData();
  formData.append('email', email);

  const URL = `${BASE_URL}/users/check-email`;
  const headers = {
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json',
  };

  return await ApiCaller.post(URL, formData, false, headers);
}

export const userVerifyEmailCode = async (email: string, verifyCode: string) => {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('email_verification_code', verifyCode);

  const URL = `${BASE_URL}/users/verify-emailCode`;
  const headers = {
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json',
  };

  return await ApiCaller.post(URL, formData, false, headers);
}

export const userCheckNickname = async (nickname: string) => {
  const formData = new FormData();
  formData.append('nickname', nickname);

  const URL = `${BASE_URL}/users/validate-nickname`;
  const headers = {
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json',
  };

  return await ApiCaller.post(URL, formData, false, headers);
}

export const userSignUp = async (email: string, name: string, phoneNumber: string, password: string, nickname: string, walletAddress: string | undefined, socialProvider: string) => {
  const formData = new FormData();

  formData.append('email', email);
  formData.append('name', name);
  formData.append('phone_number', phoneNumber);
  formData.append('password', password);
  formData.append('nickname', nickname);
  if (walletAddress) {
    formData.append('wallet_address', walletAddress);
  }
  formData.append('social_provider', socialProvider);

  const URL = `${BASE_URL}/users/signup`;
  const headers = {
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json',
  };

  return await ApiCaller.post(URL, formData, false, headers);
}

export const fetchPageData = async (endpoint: string, userId: string, pageNumber: number) => {
  const URL = `${BASE_URL}/${endpoint}/${userId}?page=${pageNumber}`;
  return ApiCaller.get(URL, null, false, {}, true);
}

export const userCreateComment = async (postId: string, comment: string) => {
  const formData = new FormData();

  formData.append('post_id', postId);
  formData.append('content', comment);

  const URL = `${BASE_URL}/comments/create`;
  const headers = {
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json',
  };

  return await ApiCaller.post(URL, formData, false, headers, true);
}

export const userLikeComment = async (commentId: string) => {
  const URL = `${BASE_URL}/comments/like/${commentId}`;
  return await ApiCaller.patch(URL, null, false, {}, true);
}

export const userEditComment = async (commentId: string, content: string) => {
  const formData = new FormData();

  formData.append('comment_id', commentId);
  formData.append('content', content);
  const URL = `${BASE_URL}/comments/edit`;
  const headers = {
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json',
  };

  return await ApiCaller.patch(URL, formData, false, headers, true);
}

export const userDeleteComment = async (commentId: string) => {
  const URL = `${BASE_URL}/comments/delete/${commentId}`;
  return await ApiCaller.delete(URL, null, false, {}, true);
}

export const userCreatePost = async (category: string, title: string, content: string, eventId: string, images: IFile[], videos: IFile[]) => {
  const formData = new FormData();

  formData.append('category', category);
  formData.append('title', title);
  formData.append('content', content);
  formData.append('event_id', eventId);

  images.forEach((image) => formData.append('image', image));
  videos.forEach((video) => formData.append('video', video));

  const URL = `${BASE_URL}/posts/create`;
  const headers = {
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json',
  };

  return await ApiCaller.post(URL, formData, false, headers, true);
}

export const changeUserNickname = async (nickname: string) => {
  const formData = new FormData();
  formData.append('nickname', nickname);

  const URL = `${BASE_URL}/users/change-nickname`;
  const headers = {
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json',
  };

  return await ApiCaller.patch(URL, formData, false, headers, true);
}

export const changeUserBanner = async (uploadFile: IFile) => {
  const formData = new FormData();
  formData.append('imgFile', uploadFile);

  const URL = `${BASE_URL}/users/change-banner`;
  const headers = {
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json',
  };

  return await ApiCaller.patch(URL, formData, false, headers, true);
}

export const exchangeToken = async (userId: string) => {
  const formData = new FormData();
  formData.append('userId', userId);

  const URL = `${BASE_URL}/users/token-exchange`;
  const headers = {
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json',
  };

  return await ApiCaller.post(URL, formData, false, headers, true);
}

export const upgradeUserDnft = async () => {
  const URL = `${BASE_URL}/users/upgrade-dnft`;
  const headers = {
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json',
  };
  return await ApiCaller.post(URL, null, false, headers, true);
}

export const userVerifyEvent = async (tokenData: string) => {
  const formData = new FormData();
  
  formData.append('token', tokenData);

  const URL = `${BASE_URL}/events/verify`;
  const headers = {
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json',
  };
  return await ApiCaller.post(URL, formData, false, headers, true);
}