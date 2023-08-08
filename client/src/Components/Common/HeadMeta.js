import Head from 'next/head';

const HeadMeta = () => {
  return (
    <Head>
      <title>Clean Mile</title>
      <meta name="description" content={'플로깅(Plogging)을 주제로 블록체인 인센티브 기반 커뮤니티 웹'} />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta property="og:title" content={'CleanMile'} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={''} />
      <meta property="og:image" content={''} />
      <meta property="og:article:author" content="CleanMile" />
      {/* <script src="https://t1.kakaocdn.net/kakao_js_sdk/2.3.0/kakao.min.js" integrity="sha384-70k0rrouSYPWJt7q9rSTKpiTfX6USlMYjZUtr1Du+9o4cGvhPAWxngdtVZDdErlh" crossorigin="anonymous"></script> */}
    </Head>
  );
};

export default HeadMeta;
