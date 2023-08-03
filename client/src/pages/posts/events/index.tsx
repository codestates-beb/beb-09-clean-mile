import React from 'react';
import { GetServerSidePropsContext } from 'next';
import { Header, Events, Footer } from '../../../Components/Reference'
import { ApiCaller } from '../../../Components/Utils/ApiCaller';
import { EventList } from '../../../Components/Interfaces';

const EventsPage = ({ eventList, lastId }: { eventList: EventList[], lastId: string }) => {
  return (
    <>
      <Header />
      <Events eventList={eventList} lastId={lastId} />
      <Footer />
    </>
  );
}

export default EventsPage;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { query } = context;
  const last_id = query.page ? query.page : '';
  const title = query.title ? query.title : null;
  const content = query.content ? query.content : null;
  const status = query.status ? query.status : null;

  try {
    let URL;

    if(title) {
      URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/events/list?last_id=${last_id}&title=${title}`;
    } else if(content) {
      URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/events/list?last_id=${last_id}&content=${content}`;
    } else if(status) {
      URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/events/list?status=${status}`;
    } else {
      URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/events/list?last_id=${last_id}`;
    }

    const dataBody = null;
    const headers = {};
    const isJSON = false;
    const isCookie = true;

    const res = await ApiCaller.get(URL, dataBody, isJSON, headers, isCookie);

    let eventList;
    let lastId;
    if (res.status === 200 && res.data.success) {
      eventList = res.data.data.data;
      lastId = res.data.data.last_id;
    } else {
      // API 호출에 실패하면 오류 메시지를 출력하고 빈 객체를 반환합니다.
      console.error('API 호출 실패:', res.data.message);
      eventList = {};
      lastId = '';
    }
    return { props: { eventList, lastId } };
  } catch (error) {
    console.error('이벤트 리스트를 가져오는데 실패했습니다:', error);

    return {
      props: {
        eventList: null,
        lastId: null,
      }
    };
  }
}