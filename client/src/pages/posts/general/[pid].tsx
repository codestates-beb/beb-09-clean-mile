import React from 'react';
import { GetServerSidePropsContext } from 'next';
import { Header, GeneralDetail, Footer } from '../../../Components/Reference'
import { ApiCaller } from '../../../Components/Utils/ApiCaller';
import { PostDetail, Comment } from '../../../Components/Interfaces';


const GeneralDetailPage = ({ postDetail, comment }: { postDetail: PostDetail, comment: Comment }) => {
  return (
    <>
      <Header />
      <GeneralDetail postDetail={postDetail} comment={Comment} />
      <Footer />
    </>
  );
}

export default GeneralDetailPage;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { pid } = context.query;
  console.log(context.query);

  const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/detail/${pid}`;
  const dataBody = null;
  const headers = {};
  const isJSON = false;
  const isCookie = true;

  // username과 다른 쿼리 파라미터를 사용하여 필요한 데이터를 가져옵니다.
  const res = await ApiCaller.get(URL, dataBody, isJSON, headers, isCookie);

  console.log(res.data.data.post.data);

  let postDetail;
  let comment;
  if (res.status === 200 && res.data.success) {
    postDetail = res.data.data.post.data;
    comment = res.data.data.comment;
  } else {
    // API 호출에 실패하면 오류 메시지를 출력하고 빈 객체를 반환합니다.
    console.error('API 호출 실패:', res.data.message);
    postDetail = {};
    comment = {};
  }



  // 이 데이터를 페이지의 props로 반환합니다.
  return { props: { postDetail, comment } };
}