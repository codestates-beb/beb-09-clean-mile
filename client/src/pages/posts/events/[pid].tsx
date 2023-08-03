import React from 'react';
import { GetServerSidePropsContext } from 'next';
import cookie from 'cookie';
import axios from 'axios';
import { Header, EventDetail, Footer } from '../../../Components/Reference'
import { ApiCaller } from '../../../Components/Utils/ApiCaller';
import { EventDetailType, Comment } from '../../../Components/Interfaces';


const EventDetailPage = ({ eventDetail, comments }: { eventDetail: EventDetailType, comments: Comment[] }) => {
  return (
    <>
      <Header />
      <EventDetail eventDetail={eventDetail} comments={comments} />
      <Footer />
    </>
  );
}

export default EventDetailPage;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { pid } = context.query;

  const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/events/detail/${pid}`;
  const dataBody = null;
  const headers = {};
  const isJSON = false;
  const isCookie = false;

  // username과 다른 쿼리 파라미터를 사용하여 필요한 데이터를 가져옵니다.
  const res = await ApiCaller.get(URL, dataBody, isJSON, headers, isCookie);

  let eventDetail;
  let comments;
  if (res.status === 200 && res.data.success) {
    eventDetail = res.data.data.event;
    comments = res.data.data.comments;
  } else {
    // API 호출에 실패하면 오류 메시지를 출력하고 빈 객체를 반환합니다.
    console.error('API 호출 실패:', res.data.message);
    eventDetail = null;
    comments = null;
  }



  // 이 데이터를 페이지의 props로 반환합니다.
  return { props: { eventDetail, comments } };
}