import React from 'react';
import '@/styles/globals.css'
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { createWrapper } from 'next-redux-wrapper';
import { QueryClient, QueryClientProvider } from 'react-query'; 
import type { AppProps } from 'next/app'
import { store, AlertActionTypes } from '../Redux/store'
import { AlertState } from '../Components/Interfaces';
import HeadMeta from '../Components/Common/HeadMeta'

// Initialize a QueryClient
const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  return (
    // Provider 컴포넌트는 React 컴포넌트 트리에서 Redux 스토어를 사용할 수 있게 하는 역할
    // Provider 컴포넌트로 감싸서 모든 컴포넌트가 Redux 스토어에 접근 할 수 있게 함
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <HeadMeta />
        <Component {...pageProps} />
      </Provider>
    </QueryClientProvider>
  )
}

const makeStore = (): Store<AlertState, AlertActionTypes> => store;

// Redux 스토어를 Next.js 앱에 연결하는 데 사용
// 이 함수는 서버 사이드 렌더링에 필요한 설정을 처리
const wrapper = createWrapper<Store<AlertState, AlertActionTypes>>(makeStore);       

// App 컴포넌트를 감싸 Next.js 앱이 Redux 스토어와 함께 렌더링되게 된다.
// 이 스토어는 서버 사이드 렌더링을 지원하게 된다.
export default wrapper.withRedux(App);