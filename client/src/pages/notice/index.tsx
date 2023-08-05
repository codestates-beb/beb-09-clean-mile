import React from 'react';
import { GetServerSidePropsContext } from 'next';
import { Header, Notice, NewNotice, Footer } from '../../Components/Reference';
import { ApiCaller } from '../../Components/Utils/ApiCaller';
import { Post, Pagination } from '../../Components/Interfaces';

const NoticePage = ({
  noticeList,
  noticePagination,
}: {
  noticeList: Post[];
  noticePagination: Pagination;
}) => {
  return (
    <>
      <Header />
      <Notice noticeList={noticeList} noticePagination={noticePagination} />
      <Footer />
    </>
  );
};

export default NoticePage;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { query } = context;
  const page = query.page ? query.page : '1';
  const order = query.order ? query.order : 'desc';
  const title = query.title ? query.title : null;
  const content = query.content ? query.content : null;

  try {
    let URL;
    if (title) {
      URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/list/notice?page=${page}&order=${order}&title=${title}`;
    } else if (content) {
      URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/list/notice?page=${page}&order=${order}&content=${content}`;
    } else {
      URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/list/notice?page=${page}&order=${order}`;
    }
    const dataBody = null;
    const headers = {};
    const isJSON = false;
    const isCookie = false;

    const res = await ApiCaller.get(URL, dataBody, isJSON, headers, isCookie);

    let noticeList;
    let noticePagination;
    if (res.status === 200 && res.data.success) {
      noticeList = res.data.data.data;
      noticePagination = res.data.data.pagination;
    } else {
      // API 호출에 실패하면 오류 메시지를 출력하고 빈 객체를 반환합니다.
      console.error('API 호출 실패:', res.data.message);
      noticeList = {};
      noticePagination = {};
    }
    return { props: { noticeList, noticePagination } };
  } catch (error) {
    console.error('게시글 리스트를 가져오는데 실패했습니다:', error);

    return {
      props: {
        noticeList: null,
        noticePagination: null,
      },
    };
  }
};
