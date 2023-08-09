import React from 'react';
import cookie from 'cookie';
import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import { Header, MyPage, Footer } from '../../Components/Reference';
import { ApiCaller } from '../../Components/Utils/ApiCaller';
import { User, Pagination, Dnft, UserBadge } from '../../Components/Interfaces';

const mypage = ({
  userInfo,
  eventPagination,
  postPagination,
  userDnft,
  userBadges,
}: {
  userInfo: User;
  eventPagination: Pagination;
  postPagination: Pagination;
  userDnft: Dnft;
  userBadges: UserBadge[];
}) => {
  return (
    <>
      <Header />
      <MyPage
        userInfo={userInfo}
        eventPagination={eventPagination}
        postPagination={postPagination}
        userDnft={userDnft}
        userBadges={userBadges}
      />
      <Footer />
    </>
  );
};

export default mypage;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const cookiesObj = cookie.parse(context.req.headers.cookie || '');

  console.log(cookiesObj)

  let cookiesStr = '';
  if (context.req && cookiesObj) {
    cookiesStr = Object.entries(cookiesObj)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ');
    axios.defaults.headers.Cookie = cookiesStr;
  }

  try {
    const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile`;
    const dataBody = null;
    const headers = {};
    const isJSON = false;
    const isCookie = true;

    const res = await ApiCaller.get(URL, dataBody, isJSON, headers, isCookie);

    let userInfo;
    let userPosts;
    let postPagination;
    let userEvents;
    let eventPagination;
    let userDnft;
    let userBadges;
    if (res.status === 200 && res.data.success) {
      userInfo = res.data.data.user;
      userEvents = res.data.data.events;
      eventPagination = res.data.data.eventPagination;
      userPosts = res.data.data.posts;
      postPagination = res.data.data.postPagination;
      userDnft = res.data.data.dnft;
      userBadges = res.data.data.badges;
    } else {
      // API 호출에 실패하면 오류 메시지를 출력하고 빈 객체를 반환합니다.
      console.error('API 호출 실패:', res.data.message);
      userInfo = {};
      postPagination = {};
      userDnft = {};
      userBadges = {};
    }
    return {
      props: {
        userInfo,
        userEvents,
        eventPagination,
        userPosts,
        postPagination,
        userDnft,
        userBadges,
      },
    };
  } catch (error) {
    console.error('유저 정보를 가져오는데 실패했습니다:', error);

    return {
      props: {
        userInfo: null,
        postPagination: null,
        userDnft: null,
        userBadges: null,
      },
    };
  }
};
