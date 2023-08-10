import React from 'react';
import cookie from 'cookie';
import { GetServerSidePropsContext } from 'next';
import { Header, ReviewEdit, Footer } from '../../../../Components/Reference'
import { ApiCaller } from '../../../../Components/Utils/ApiCaller';
import { PostDetail } from '../../../../Components/Interfaces';

const ReviewEditPage = ({ reviewDetailDefault }: { reviewDetailDefault: PostDetail }) => {
  return (
    <>
      <Header />
      <ReviewEdit reviewDetailDefault={reviewDetailDefault} />
      <Footer />
    </>
  );
}

export default ReviewEditPage;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { pid } = context.query;
  const cookies = cookie.parse(context.req.headers.cookie || '');
  
  if (!cookies.clientAccessToken) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/detail/${pid}`;
  const dataBody = null;
  const headers = {};
  const isJSON = false;
  const isCookie = true;

  const res = await ApiCaller.get(URL, dataBody, isJSON, headers, isCookie);

  let reviewDetailDefault;
  if (res.status === 200 && res.data.success) {
    reviewDetailDefault = res.data.data.post;
  } else {
    // API 호출에 실패하면 오류 메시지를 출력하고 빈 객체를 반환합니다.
    console.error('API 호출 실패:', res.data.message);
    reviewDetailDefault = null;
  }

  // 이 데이터를 페이지의 props로 반환합니다.
  return { props: { reviewDetailDefault } };
}