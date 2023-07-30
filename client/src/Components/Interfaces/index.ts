interface LoginAPIInput {
  email: string;
  password: string;
}

interface Wallet {
  address: string;
}

interface LoginAPIOutput {
  wallet: Wallet;
  _id: string;
  name: string;
  email: string;
  phone_number: string;
  user_type: number;
  nickname: string;
  social_type: string;
  created_at: string;
  updated_at: string;
}

type Post = {
  media: {
    image: string | StaticImageData;
    video: null | string;
  };
  view: {
    count: number;
    viewers: string[];
  };
  _id: string;
  user_id: string;
  category: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  __v: number;
};

type Pagination = {
  total: number;
  totalPage: number;
  currentPage: number;
  startPage: number;
  endPage: number;
  prevPage: null | number;
  nextPage: null | number;
};

type User = {
  wallet: Wallet;
  _id: string;
  email: string;
  name: string;
  phone_number: string;
  user_type: number;
  hashed_pw: string;
  nickname: string;
  social_provider: string;
  created_at: string;
  updated_at: string;
  __v: number;
  banner_img_url: string;
};

type UserInfo = {
  user: User;
  post: {
    data: Post[];
    last_id: string;
    pagination: Pagination;
  };
  event: {
    data: Event[];
    last_id: string;
    pagination: Pagination;
  };
};



export type { Post, LoginAPIInput, LoginAPIOutput, UserInfo }