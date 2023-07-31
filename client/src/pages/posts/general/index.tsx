import React from 'react';
import { GetServerSidePropsContext } from 'next';
import { Header, General, Footer } from '../../../Components/Reference'
import { ApiCaller } from '../../../Components/Utils/ApiCaller';
import { Post, Pagination } from '../../../Components/Interfaces';


const GeneralPage = ({ postList, postPagination }: { postList: Post, postPagination: Pagination }) => {
  return (
    <>
      <Header />
      <General postList={postList} postPagination={postPagination} />
      <Footer />
    </>
  );
}

export default GeneralPage;

export const getServerSideProps = async () => {
  try {
    const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/lists/general`;
    const dataBody = null;
    const headers = {};
    const isJSON = false;
    const isCookie = true;

    const res = await ApiCaller.get(URL, dataBody, isJSON, headers, isCookie);

    console.log(res.data.data.data);

    let postList;
    let postPagination;
    if (res.status === 200 && res.data.success) {
      postList = res.data.data.data;
      postPagination = res.data.data.pagination.pagination;
    } else {
      // API 호출에 실패하면 오류 메시지를 출력하고 빈 객체를 반환합니다.
      console.error('API 호출 실패:', res.data.message);
      postList = {};
      postPagination = {}
    }
    return { props: { postList, postPagination } };
  } catch (error) {
    console.error('게시글 리스트를 가져오는데 실패했습니다:', error);
    
    return {
      props: {
        postList: null,
        postPagination: null
      }
    };
  }
}