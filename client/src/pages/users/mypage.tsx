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
  const { nickname } = context.query;

  const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile/${nickname}`;
  const dataBody = null;
  const headers = {};
  const isJSON = false;
  const isCookie = true;

  // username과 다른 쿼리 파라미터를 사용하여 필요한 데이터를 가져옵니다.
  const res = await ApiCaller.get(URL, dataBody, isJSON, headers, isCookie);

  console.log(res.data.data);

  let userInfo;
  if (res.status === 200 && res.data.success) {
    userInfo = res.data.data;
  } else {
    // API 호출에 실패하면 오류 메시지를 출력하고 빈 객체를 반환합니다.
    console.error('API 호출 실패:', res.data.message);
    userInfo = {};
  }



  // 이 데이터를 페이지의 props로 반환합니다.
  return { props: { userInfo } };
}