import React, { useEffect } from 'react';
import '@/styles/globals.css'
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { createWrapper } from 'next-redux-wrapper';
import { QueryClient, QueryClientProvider } from 'react-query'; 
import { AxiosError } from 'axios';
import type { AppProps } from 'next/app'
import HeadMeta from '../Components/Common/HeadMeta'
import { ApiCaller } from '../Components/Utils/ApiCaller';

// Initialize a QueryClient
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {

  useEffect(() => {
    /**
     * 토큰을 갱신하는 함수
     * 백엔드 서버에 POST 요청을 보내어 토큰을 갱신하고,
     * 응답 메시지를 콘솔에 출력.
     */
    const refresh = async () => {
      try {
        const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/refresh`;
        const dataBody = null;
        const headers = {};
        const isJSON = false;
        const isCookie = true;

        const res = await ApiCaller.post(URL, dataBody, isJSON, headers, isCookie);
              
        console.log('refresh message: ', res.data.message);
      
      } catch (error) {
        const err = error as AxiosError;

        const data = err.response?.data as { message: string };
  
        console.log('Error', data?.message);
      }

    };
    refresh();
    
    // 10분마다 실행
    const intervalId = setInterval(refresh, 10 * 60 * 1000);
    // const intervalId = setInterval(refresh, 10 * 1000);
    
    // 컴포넌트가 언마운트될 때 인터벌을 해제
    return () => {
      clearInterval(intervalId);
    };
  }, []);


  return (
    <QueryClientProvider client={queryClient}>
        <HeadMeta />
        <Component {...pageProps} />
    </QueryClientProvider>
  )
}
