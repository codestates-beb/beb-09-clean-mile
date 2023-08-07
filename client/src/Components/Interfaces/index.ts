interface LoginAPIInput {
  email: string;
  password: string;
}

interface Wallet {
  address: string;
  mileage_amount: number;
  token_amount: number;
  badge_amount: number;
  total_badge_score: number;
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

type CommentUsers = {
  _id: string;
  nickname: string;
}

type CommentLikes = {
  count: number;
  is_like: boolean;
}

type Comment = {
  _id: string;
  user_id: CommentUsers;
  post_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  likes: CommentLikes;
}

type PostUsers = {
  _id: string;
  nickname: string;
}

type PostDetail = {
  media: {
    img: string[];
    video: string[];
  };
  view: {
    count: number;
  };
  _id: string;
  user_id: PostUsers;
  category: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  __v: number;
};

type Post = {
  media: {
    img: string[];
    video: string[];
  }
  view: {
    count: number;
  }
  _id: string;
  user_id: PostUsers;
  category: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

type Pagination = {
  total: number;
  totalPages: number;
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
  posts: {
    data: PostDetail[];
    last_id: string;
    pagination: Pagination;
  };
  event: {
    data: Event[];
    last_id: string;
    pagination: Pagination;
  };
};

type EventHost = {
  _id: string;
  name: string;
  organization: string;
}

type EventList = {
  view: {
    count: number;
  };
  _id: string;
  title: string;
  host_id: EventHost;
  poster_url: string;
  content: string;
  capacity: number;
  remaining: number;
  status: string;
  event_type: string;
  recruitment_start_at: string;
  recruitment_end_at: string;
  event_start_at: string;
  event_end_at: string;
  created_at: string;
  updated_at: string;
}

type EventDetailType = {
  view: {
    count: number;
  };
  _id: string;
  title: string;
  host_id: EventHost;
  poster_url: string;
  content: string;
  location: string;
  capacity: number;
  remaining: number;
  status: string;
  event_type: string;
  recruitment_start_at: string;
  recruitment_end_at: string;
  event_start_at: string;
  event_end_at: string;
  created_at: string;
  updated_at: string;
}

type LoggedIn = {
  isLoggedIn: boolean;
}

type Dnft = {
  owner: string;
  token_id: number;
  name: string;
  image_url: string;
  description: string;
}

type UserBadge = {
  name: string;
  description: string;
  image: string;
  badge_type: string;
}

export type { 
  Post,
  PostDetail, 
  Comment, 
  LoginAPIInput, 
  LoginAPIOutput, 
  User, 
  UserInfo, 
  Pagination, 
  EventList, 
  EventDetailType, 
  LoggedIn, 
  Dnft, 
  UserBadge 
}