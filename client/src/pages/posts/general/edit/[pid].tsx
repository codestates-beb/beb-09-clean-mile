import React from 'react';
import { GetServerSidePropsContext } from 'next';
import { Header, GeneralEdit, Footer } from '../../../../Components/Reference'
import { ApiCaller } from '../../../../Components/Utils/ApiCaller';
import { PostDetail } from '../../../../Components/Interfaces';

const GeneralEditPage = ({ postDetailDefault }: { postDetailDefault: PostDetail }) => {
  return (
    <>
      <Header />
      <GeneralEdit postDetailDefault={postDetailDefault} />
      <Footer />
    </>
  );
}

export default GeneralEditPage;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { pid } = context.query;

  const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/detail/${pid}`;
  const dataBody = null;
  const headers = {};
  const isJSON = false;
  const isCookie = true;

  const res = await ApiCaller.get(URL, dataBody, isJSON, headers, isCookie);

  let postDetailDefault;
  if (res.status === 200 && res.data.success) {
    postDetailDefault = res.data.data.post;
  } else {
    // API 호출에 실패하면 오류 메시지를 출력하고 빈 객체를 반환합니다.
    console.error('API 호출 실패:', res.data.message);
    postDetailDefault = null;
  }

  // 이 데이터를 페이지의 props로 반환합니다.
  return { props: { postDetailDefault } };
}