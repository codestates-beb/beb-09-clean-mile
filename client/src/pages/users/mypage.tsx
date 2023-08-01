import React from 'react';
import { GetServerSidePropsContext } from 'next';
import { Header, MyPage, Footer } from '../../Components/Reference'
import { ApiCaller } from '../../Components/Utils/ApiCaller';
import { UserInfo, Pagination } from '../../Components/Interfaces';

const UserPage = ({ userInfo, postPagination }: { userInfo: UserInfo, postPagination: Pagination }) => {
  return (
    <>
      <Header />
      <MyPage userInfo={userInfo} postPagination={postPagination} />
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
    const isJSON = true;
    const isCookie = true;

    const res = await ApiCaller.get(URL, dataBody, isJSON, headers, isCookie);

    console.log(res)

    let userInfo;
    let postPagination;
    if (res.status === 200 && res.data.success) {
      userInfo = res.data.data;
      postPagination = res.data.data.post.pagination.pagination;
    } else {
      // API 호출에 실패하면 오류 메시지를 출력하고 빈 객체를 반환합니다.
      console.error('API 호출 실패:', res.data.message);
      userInfo = {};
      postPagination = {};
    }
    return { props: { userInfo, postPagination } };
  } catch (error) {
    console.error('유저 정보를 가져오는데 실패했습니다:', error);

    return {
      props: {
        userInfo: null,
        postPagination: null
      }
    };
  }
}