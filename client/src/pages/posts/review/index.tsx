import React from 'react';
import { GetServerSidePropsContext } from 'next';
import { Header, Review, Footer } from '../../../Components/Reference'
import { ApiCaller } from '../../../Components/Utils/ApiCaller';
import { Post } from '../../../Components/Interfaces';

const ReviewPage = ({ reviewList, lastId }: { reviewList: Post[], lastId: string }) => {
  return (
    <>
      <Header />
      <Review reviewList={reviewList} lastId={lastId} />
      <Footer />
    </>
  );
}

export default ReviewPage;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { query } = context;
  const last_id = query.page ? query.page : '';
  const title = query.title ? query.title : null;
  const content = query.content ? query.content : null;

  try {
    let URL;

    if(title) {
      URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/lists/review?last_id=${last_id}&title=${title}`;
    } else if(content) {
      URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/lists/review?last_id=${last_id}&content=${content}`;
    } else {
      URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/lists/review?last_id=${last_id}`;
    }

    const dataBody = null;
    const headers = {};
    const isJSON = false;
    const isCookie = false;

    const res = await ApiCaller.get(URL, dataBody, isJSON, headers, isCookie);

    console.log(res.data.data.last_item)

    let reviewList;
    let lastId;
    if (res.status === 200 && res.data.success) {
      reviewList = res.data.data.data;
      lastId = res.data.data.last_item;
    } else {
      // API 호출에 실패하면 오류 메시지를 출력하고 빈 객체를 반환합니다.
      console.error('API 호출 실패:', res.data.message);
      reviewList = {};
      lastId = '';
    }
    return { props: { reviewList, lastId } };
  } catch (error) {
    console.error('이벤트 리스트를 가져오는데 실패했습니다:', error);

    return {
      props: {
        reviewList: null,
        lastId: null,
      }
    };
  }
}