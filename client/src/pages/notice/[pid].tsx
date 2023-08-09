import React from 'react';
import { GetServerSidePropsContext } from 'next';
import { Header, NoticeDetail, Footer } from '../../Components/Reference'
import { ApiCaller } from '../../Components/Utils/ApiCaller';
import { PostDetail, Comment } from '../../Components/Interfaces';


const NoticeDetailPage = ({ noticeDetail, comments }: { noticeDetail: PostDetail, comments: Comment[] }) => {
  return (
    <>
      <Header />
      <NoticeDetail noticeDetail={noticeDetail} comments={comments} />
      <Footer />
    </>
  );
}

export default NoticeDetailPage;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { pid } = context.query;

  const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/detail/${pid}`;
  const dataBody = null;
  const headers = {};
  const isJSON = false;
  const isCookie = false;

  const res = await ApiCaller.get(URL, dataBody, isJSON, headers, isCookie);

  let noticeDetail;
  let comments;
  if (res.status === 200 && res.data.success) {
    noticeDetail = res.data.data.post;
    comments = res.data.data.comment;
  } else {
    // API 호출에 실패하면 오류 메시지를 출력하고 빈 객체를 반환
    console.error('API 호출 실패:', res.data.message);
    noticeDetail = null;
    comments = null;
  }



  // 이 데이터를 페이지의 props로 반환
  return { props: { noticeDetail, comments } };
}