import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import HeadMeta from '../Components/Common/HeadMeta'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <HeadMeta />
      <Component {...pageProps} />
    </>
  )
}
