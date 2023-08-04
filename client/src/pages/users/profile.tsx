import React from 'react';
import { GetServerSidePropsContext } from 'next';
import { Header, UserProfile, Footer } from '../../Components/Reference'
import { ApiCaller } from '../../Components/Utils/ApiCaller';
import { User, Pagination, Dnft, UserBadge } from '../../Components/Interfaces';

const UserPage = ({ userInfo, postPagination, userDnft, userBadges }: { userInfo: User, postPagination: Pagination, userDnft: Dnft, userBadges: UserBadge[] }) => {
  return (
    <>
      <Header />
      <UserProfile userInfo={userInfo} postPagination={postPagination} userDnft={userDnft} userBadges={userBadges} />
      <Footer />
    </>
  );
}

export default UserPage;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { id } = context.query;

  try {
    const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile/${id}`;
    const dataBody = null;
    const headers = {};
    const isJSON = false;
    const isCookie = true;

    const res = await ApiCaller.get(URL, dataBody, isJSON, headers, isCookie);

    let userInfo;
    let postPagination;
    let userDnft;
    let userBadges;
    
    if (res.status === 200 && res.data.success) {
      userInfo = res.data.data.user;
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
    return { props: { userInfo, postPagination, userDnft, userBadges } };
  } catch (error) {
    console.error('유저 정보를 가져오는데 실패했습니다:', error);

    return {
      props: {
        userInfo: null,
        postPagination: null,
        userDnft: null,
        userBadges: null,
      }
    };
  }
}