interface Post {
  id: number;
  image: string | StaticImageData; // <- change here
  review_writer: string;
  review_title: string;
  review_content: string;
  date: string;
}

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


export type { Post, LoginAPIInput, LoginAPIOutput }