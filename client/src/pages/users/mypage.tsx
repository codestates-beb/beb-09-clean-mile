import React from 'react';
import { GetServerSidePropsContext } from 'next';
import { Header, MyPage, Footer } from '../../Components/Reference'
import { ApiCaller } from '../../Components/Utils/ApiCaller';
import { UserInfo } from '../../Components/Interfaces';

const UserPage = ({ userInfo }: { userInfo: UserInfo }) => {
  return (
    <>
      <Header />
      <MyPage userInfo={userInfo} />
      <Footer />
    </>
  );
}

export default UserPage;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { id } = context.query;
  console.log(id === '64c3dee91014d3885aa94bc9');

  try {
    const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile/64c3dee91014d3885aa94bc9`;
    const dataBody = null;
    const headers = {};
    const isJSON = true;
    const isCookie = true;

    const res = await ApiCaller.get(URL, dataBody, isJSON, headers, isCookie);

    console.log(res.data.data)

    let userInfo;
    if (res.status === 200 && res.data.success) {
      userInfo = res.data.data;
    } else {
      // API 호출에 실패하면 오류 메시지를 출력하고 빈 객체를 반환합니다.
      console.error('API 호출 실패:', res.data.message);
      userInfo = {};
    }
    return { props: { userInfo } };
  } catch (error) {
    console.error('유저 정보를 가져오는데 실패했습니다:', error);

    return {
      props: {
        userInfo: null,
      }
    };
  }
}