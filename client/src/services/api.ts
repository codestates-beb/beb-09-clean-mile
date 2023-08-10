import { ApiCaller } from '@/Components/Utils/ApiCaller';
import { QueryFunctionContext } from 'react-query';
import { LoginAPIOutput } from '@/Components/Interfaces';

/**
 * 백엔드 API 호출을 위한 기본 URL.
 * @constant
 * @type {string}
 */
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * 현재 사용자의 정보를 가져옴
 * @async
 * @function
 * @returns {Promise<object>} - 사용자 정보에 대한 프로미스.
 */
export const getUserInfo = async () => {
  const URL = `${BASE_URL}/users/userInfo`;
  return await ApiCaller.get(URL, null, false, {}, true);
}

/**
 * 로그인한 사용자 로그아웃
 * @async
 * @function
 * @returns {Promise<object>} - 로그아웃 결과에 대한 프로미스.
 */
export const userLogout = async () => {
  const URL = `${BASE_URL}/users/logout`;
  const headers = {
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json',
  };

  return await ApiCaller.post(URL, null, false, headers, true);
}

/**
 * 최신 공지사항을 가져옴
 * @async
 * @function
 * @returns {Promise<object>} - 최신 공지사항에 대한 프로미스.
 */
export const getLatestNotice = async () => {
  const URL = `${BASE_URL}/posts/notices_latest`;
  return await ApiCaller.get(URL, null, false, {}, true);
}

/**
 * ID를 사용하여 특정 이벤트에 참여할 수 있게 함
 * @async
 * @function
 * @param {string} eventId - 참여할 이벤트의 ID.
 * @returns {Promise<object>} - 이벤트 참여 결과에 대한 프로미스.
 */
export const enterEvent = async (eventId: string) => {
  const URL = `${BASE_URL}/events/entry/${eventId}`;
  return await ApiCaller.post(URL, null, false, {}, true);
}

interface FetchEventParams extends QueryFunctionContext<'events'> {
  pageParam: string;
  title?: string | undefined;
  content?: string | undefined;
  filter?: string | undefined;
}

/**
 * 페이지네이션 및 선택적 필터와 함께 이벤트를 가져옴
 * @async
 * @function
 * @param {object} params - 이벤트를 가져오기 위한 매개변수.
 * @param {string} params.pageParam - 페이지네이션을 위한 마지막 ID.
 * @param {string} [params.title] - 이벤트를 필터링하기 위한 제목.
 * @param {string} [params.content] - 이벤트를 필터링하기 위한 내용.
 * @param {string} [params.filter] - 이벤트의 필터 상태.
 * @returns {Promise<object>} - 이벤트 목록에 대한 프로미스.
 */
export const fetchEventsWithPaging = async ({ pageParam = 'null', title, content, filter }: FetchEventParams) => {
  let URL = `${BASE_URL}/events/list?last_id=${pageParam}`;

  // 검색 조건 추가
  if (title) {
    URL += `&title=${encodeURIComponent(title)}`;
  }

  if (content) {
    URL += `&content=${encodeURIComponent(content)}`;
  }

  // 필터 조건 추가
  if (filter && filter !== 'all') {
    URL += `&status=${encodeURIComponent(filter)}`;
  }

  const res = await ApiCaller.get(URL, null, false, {}, true);
  if (res.status === 200 && res.data.data) {
    return res.data.data;
  }
  throw new Error('Error fetching data');
}

/**
 * ID를 사용하여 사용자 게시물을 삭제
 * @async
 * @function
 * @param {string} postId - 삭제할 게시물의 ID.
 * @returns {Promise<object>} - 게시물 삭제 결과에 대한 프로미스.
 */
export const userPostDelete = async (postId: string) => {
  const URL = `${BASE_URL}/posts/delete/${postId}`;
  return await ApiCaller.delete(URL, null, false, {}, true);
}

/**
 * 선택적 미리보기와 함께 파일을 나타내는 인터페이스.
 * @interface
 * @extends {File}
 * @property {string} [preview] - 파일에 대한 선택적 미리보기.
 */
interface IFile extends File {
  preview?: string;
}

/**
 * 특정 게시물을 수정
 * @async
 * @function
 * @param {string} postId - 수정할 게시물의 ID.
 * @param {string} title - 게시물의 새로운 제목.
 * @param {string} content - 게시물의 새로운 내용.
 * @param {IFile[]} images - 게시물에 첨부할 이미지들.
 * @param {IFile[]} videos - 게시물에 첨부할 비디오들.
 * @returns {Promise<string>} - 수정된 게시물의 ID에 대한 프로미스.
 */
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

interface FetchReviewParams extends QueryFunctionContext<'reviews'> {
  pageParam: string;
  title?: string | undefined;
  content?: string | undefined;
  filter?: string | undefined;
}

/**
 * 페이지네이션 및 선택적 필터와 함께 리뷰를 가져옴
 * @async
 * @function
 * @param {object} params - 리뷰를 가져오기 위한 매개변수.
 * @param {string} params.pageParam - 페이지네이션을 위한 마지막 ID.
 * @param {string} [params.title] - 리뷰를 필터링하기 위한 제목.
 * @param {string} [params.content] - 리뷰를 필터링하기 위한 내용.
 * @param {string} [params.filter] - 리뷰의 필터 순서.
 * @returns {Promise<object>} - 리뷰 목록에 대한 프로미스.
 */
export const fetchReviews = async ({ pageParam = 'null', title, content, filter }: FetchReviewParams) => {
  let URL = `${BASE_URL}/posts/lists/review?last_id=${pageParam}`;

  // 검색 조건 추가
  if (title) {
    URL += `&title=${encodeURIComponent(title)}`;
  }

  if (content) {
    URL += `&content=${encodeURIComponent(content)}`;
  }

  // 필터 조건 추가
  if (filter && filter !== 'all') {
    URL += `&order=${encodeURIComponent(filter)}`;
  }

  const res = await ApiCaller.get(URL, null, false, {}, true);
  if (res.status === 200 && res.data.data) {
    return res.data.data;
  }
  throw new Error('Error fetching data');
};

/**
 * 사용자 로그인 응답을 나타내는 인터페이스.
 * @interface
 * @property {number} status - 응답 상태 코드.
 * @property {object} data - 응답 데이터.
 * @property {string} data.message - 응답 메시지.
 * @property {LoginAPIOutput} data.data - 실제 로그인 데이터.
 */
interface LoginResponse {
  status: number;
  data: {
    message: string;
    data: LoginAPIOutput; // Assuming LoginAPIOutput is your actual data type.
  };
}

/**
 * 사용자 로그인
 * @async
 * @function
 * @param {object} credentials - 사용자의 로그인 정보.
 * @param {string} credentials.email - 사용자의 이메일 주소.
 * @param {string} credentials.password - 사용자의 비밀번호.
 * @returns {Promise<LoginResponse>} - 로그인 응답에 대한 프로미스.
 */
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

/**
 * 유저 이메일 중복 체크
 * @async
 * @function
 * @param {string} email - 확인할 이메일 주소.
 * @returns {Promise<object>} - 이메일 확인 결과에 대한 프로미스.
 */
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

/**
 * 유저의 이메일 인증 코드를 확인
 * @async
 * @param {string} email - 인증할 이메일 주소.
 * @param {string} verifyCode - 인증 코드.
 * @returns {Promise<object>} - 이메일 인증 결과에 대한 프로미스.
 */
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

/**
 * 유저 닉네임 중복 체크
 * @async
 * @param {string} nickname - 확인할 사용자의 별명.
 * @returns {Promise<object>} - 별명 확인 결과에 대한 프로미스.
 */
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

/**
 * 유저 회원가입
 * @async
 * @param {string} email - 사용자의 이메일 주소.
 * @param {string} name - 사용자의 이름.
 * @param {string} phoneNumber - 사용자의 전화번호.
 * @param {string} password - 사용자의 비밀번호.
 * @param {string} nickname - 사용자의 별명.
 * @param {string | undefined} walletAddress - 사용자의 지갑 주소.
 * @param {string} socialProvider - 소셜 로그인 제공자.
 * @returns {Promise<object>} - 사용자 등록 결과에 대한 프로미스.
 */
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

/**
 * 특정 페이지의 데이터를 가져옴
 * @async
 * @param {string} endpoint - 데이터를 가져올 엔드포인트.
 * @param {string} userId - 사용자 ID.
 * @param {number} pageNumber - 페이지 번호.
 * @returns {Promise<object>} - 페이지 데이터에 대한 프로미스.
 */
export const fetchPageData = async (endpoint: string, userId: string, pageNumber: number) => {
  const URL = `${BASE_URL}/${endpoint}/${userId}?page=${pageNumber}`;
  return ApiCaller.get(URL, null, false, {}, true);
}

/**
 * 게시물에 댓글을 생성
 * @async
 * @param {string} postId - 댓글을 추가할 게시물의 ID.
 * @param {string} comment - 댓글 내용.
 * @returns {Promise<object>} - 댓글 생성 결과에 대한 프로미스.
 */
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

/**
 * 댓글에 좋아요를 추가
 * @async
 * @param {string} commentId - 좋아요를 추가할 댓글의 ID.
 * @returns {Promise<object>} - 좋아요 추가 결과에 대한 프로미스.
 */
export const userLikeComment = async (commentId: string) => {
  const URL = `${BASE_URL}/comments/like/${commentId}`;
  return await ApiCaller.patch(URL, null, false, {}, true);
}

/**
 * 유저가 작성한 댓글 수정
 * @async
 * @param {string} commentId - 수정할 댓글의 ID.
 * @param {string} content - 새로운 댓글 내용.
 * @returns {Promise<object>} - 댓글 수정 결과에 대한 프로미스.
 */
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

/**
 * 사용자의 댓글을 삭제
 * @async
 * @param {string} commentId - 삭제할 댓글의 ID.
 * @returns {Promise<object>} - 댓글 삭제 결과에 대한 프로미스.
 */
export const userDeleteComment = async (commentId: string) => {
  const URL = `${BASE_URL}/comments/delete/${commentId}`;
  return await ApiCaller.delete(URL, null, false, {}, true);
}

/**
 * 사용자의 게시물을 생성
 * @async
 * @param {string} category - 게시물 카테고리.
 * @param {string} title - 게시물 제목.
 * @param {string} content - 게시물 내용.
 * @param {string} eventId - 관련 이벤트 ID.
 * @param {IFile[]} images - 첨부할 이미지 파일들.
 * @param {IFile[]} videos - 첨부할 비디오 파일들.
 * @returns {Promise<object>} - 게시물 생성 결과에 대한 프로미스.
 */
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

/**
 * 유저 닉네임 변경
 * @async
 * @param {string} nickname - 새로운 별명.
 * @returns {Promise<object>} - 별명 변경 결과에 대한 프로미스.
 */
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

/**
 * 유저 배너 이미지 변경
 * @async
 * @param {IFile} uploadFile - 새로운 배너 이미지 파일.
 * @returns {Promise<object>} - 배너 변경 결과에 대한 프로미스.
 */
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

/**
 * 마일리지를 토큰으로 교환하는 함수
 * @async
 * @param {string} userId - 토큰 교환을 요청할 사용자의 ID.
 * @returns {Promise<object>} - 토큰 교환 결과에 대한 프로미스.
 */
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

/**
 * 사용자의 DNFT 레벨을 업그레이드
 * @async
 * @returns {Promise<object>} - DNFT 업그레이드 결과에 대한 프로미스.
 */
export const upgradeUserDnft = async () => {
  const URL = `${BASE_URL}/users/upgrade-dnft`;
  const headers = {
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json',
  };
  return await ApiCaller.post(URL, null, false, headers, true);
}

/**
 * 이벤트 참여 인증 함수
 * 이벤트 토큰을 서버로 전송
 * @async
 * @param {string} tokenData - 검증할 토큰 데이터.
 * @returns {Promise<object>} - 토큰 데이터 검증 결과에 대한 프로미스.
 */
export const userVerifyEvent = async (tokenData: string) => {
  const formData = new FormData();
  console.log('tokenData', tokenData);
  
  formData.append('token', tokenData);

  const URL = `${BASE_URL}/events/verify`;
  const headers = {
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json',
  };
  return await ApiCaller.post(URL, formData, false, headers, true);
}