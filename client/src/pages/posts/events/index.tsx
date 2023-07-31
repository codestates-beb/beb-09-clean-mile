import React from 'react';
import { GetServerSidePropsContext } from 'next';
import { Header, Events, Footer } from '../../../Components/Reference'
import { ApiCaller } from '../../../Components/Utils/ApiCaller';
import { EventList } from '../../../Components/Interfaces';


const EventsPage = () => {
  return (
    <>
      <Header />
      <Events />
      <Footer />
    </>
  );
}

export default EventsPage;

export const getServerSideProps = async () => {
  try {
    const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/lists/event`;
    const dataBody = null;
    const headers = {};
    const isJSON = false;
    const isCookie = true;

    const res = await ApiCaller.get(URL, dataBody, isJSON, headers, isCookie);

    console.log(res.data);

    let eventList;
    if (res.status === 200 && res.data.success) {
      eventList = res.data;
    } else {
      // API 호출에 실패하면 오류 메시지를 출력하고 빈 객체를 반환합니다.
      console.error('API 호출 실패:', res.data.message);
      eventList = {};
    }
    return { props: { eventList } };
  } catch (error) {
    console.error('이벤트 리스트를 가져오는데 실패했습니다:', error);

    return {
      props: {
        eventList: null,
      }
    };
  }
}