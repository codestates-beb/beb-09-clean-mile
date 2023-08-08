import Head from 'next/head';

const HeadMeta = () => {
  return (
    <Head>
      <title>Clean Mile</title>
      <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
      <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
      <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
      <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
      <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
      <meta name="theme-color" content="#ffffff"></meta>
      <meta name="description" content={'플로깅(Plogging)을 주제로 블록체인 인센티브 기반 커뮤니티 웹'} />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta property="og:title" content={'CleanMile'} />
      <meta property="og:sit_name" content={'Clean Mile'} />
      <meta property="og:locale" content={'en_us'} />
      <meta property="og:type" content={'website'} />
      <meta property="og:url" content={'https://www.clean-mile.co'} />
      <meta property="og:image" content={'https://i.ibb.co/FJxQHd2/clean-mile-logo-2.png'} />
      <meta property="og:image:width" content={'1200'} />
      <meta property="og:image:height" content={'630'} />
      <meta property="og:article:author" content={'CleanMile'} />
      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content={'https://i.ibb.co/FJxQHd2/clean-mile-logo-2.png'} />
      <meta property="twitter:domain" content="clean-mile.co" />
      <meta property="twitter:url" content="https://www.clean-mile.co/" />
      <meta name="twitter:title" content="CleanMile" />
      <meta name="twitter:description" content="플로깅(Plogging)을 주제로 블록체인 인센티브 기반 커뮤니티 웹" />
      <meta name="twitter:image" content={'https://i.ibb.co/FJxQHd2/clean-mile-logo-2.png'} />
    </Head>
  );
};

export default HeadMeta;
