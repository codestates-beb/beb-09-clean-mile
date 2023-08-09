import React, { useEffect } from 'react';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { hero_img, insta_logo, insta_icon, default_banner, dummy_1, dummy_2, dummy_3, dummy_4, dummy_5, dummy_6, dummy_7, dummy_8 } from '../Reference';

const Main = () => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const dummy = [
    { id: 1, image: hero_img, insta_id: 'illiilliil', insta_content: '바다와 함께하는 작은 발견. 비치코밍의 기쁨! \n#비치코밍 #해변의보물 #자연과함께' },
    { id: 2, image: default_banner, insta_id: 'hyo_o', insta_content: '플로깅은 운동이자 환경 보호! 오늘도 성공적! \n#플로깅챌린지 #조깅과환경보호' },
    { id: 3, image: dummy_1, insta_id: 'beach_combing', insta_content: '해변에서 발견한 쓰레기들. 나의 작은 노력으로 깨끗한 바다를 \n#비치코밍 #바다를지켜요' },
    { id: 4, image: dummy_2, insta_id: 'iris_0502', insta_content: 'Your personal environmental campaign! Small actions, significant changes for the earth. 💚 \n#PloggingMovement #FitPlanet' },
    { id: 5, image: dummy_3, insta_id: 'cheery_y_23', insta_content: 'Clean up as you work out with plogging! Every step counts towards a greener earth. 💪🌎 \n#PloggingForThePlanet #StepsTowardsChange' },
    { id: 6, image: dummy_4, insta_id: 'x_x__y21', insta_content: '플로깅으로 두 마리 토끼 잡기: 건강도 챙기고 환경도 지키기 \n#플로깅운동 #환경보호' },
    { id: 7, image: dummy_5, insta_id: 'jisoo_03', insta_content: 'Where fitness meets environmental care! Boost your health + Save the planet = 🍀 \n#PloggingBenefits #HealthMeetsEco' },
    { id: 8, image: dummy_6, insta_id: 'sang_hyun_25', insta_content: '가족과 함께하는 비치코밍의 특별한 순간! 바다의 보물을 찾는 우리 가족의 작은 모험. 🐚 \n#FamilyBeachDay #TreasuresInTheSand' },
    { id: 9, image: dummy_7, insta_id: 'pocarisweat', insta_content: '비치코밍 키트 증정 이벤트! 🎉 여름의 기억을 바다에서 찾아보세요. 증정 키트로 시작해보는 비치코밍, 어떠세요? 참여 방법은 프로필 링크 클릭! \n#비치코밍시작 #여름의기억' },
    { id: 10, image: dummy_8, insta_id: 'haeundae_beach_combing', insta_content: '🏖️🚯 바다를 사랑하는 우리, 오늘도 비치코밍으로 깨끗한 해변 만들기 \n#비치코밍 #해변을지키자' },
  ]

  return (
    <div className='px-12 sm:px-6 xs:px-4'>
      <div className='hero-bg py-[10%] md:py-[2%] sm:py-[5%] xs:py-[4%] px-[20%] lg:px-[5%] md:px-[3%] sm:px-[1%] xs:px-[2%]'>
        <div className='w-full h-full flex flex-col justify-center md:justify-end sm:justify-end xs:justify-end md:items-center sm:items-center xs:items-center md:pb-5 sm:pb-2 xs:pb-2 items-end gap-12 lg:gap-6 md:gap-4 sm:gap-4 xs:gap-4 text-right md:text-center sm:text-center xs:text-center'>
          <h1 className='text-7xl font-bold lg:text-4xl md:text-3xl sm:text-2xl xs:text-lg'>Clean Mile</h1>
          <p className='whitespace-normal w-[60%] lg:w-[60%] md:w-[90%] sm:w-[100%] xs:w-[100%] lg:text-sm md:text-xs sm:text-xs xs:text-xs font-semibold md:font-semibold sm:font-semibold xs:font-semibold'>
            <span>
              {t('common:It is a community service that aims to collect information about environmental protection events in one place to improve accessibility and user-friendliness, and to encourage active participation by issuing certification badges (NFTs) to users who participate in events')}
            </span>
            <br />
            <br />
            <span className='mt-2'>
              {t('common:The project was born out of the idea to facilitate interaction between people interested in protecting the environment, and to encourage participants to contribute to solving and improving environmental problems such as urban aesthetics, impaired drainage, loss of biodiversity, air pollution, and resource depletion')}
            </span>
          </p>
          <div className='flex justify-end items-end w-full md:justify-center sm:justify-center xs:justify-center'>
            <button className='bg-main-blue hover:bg-blue-600 rounded-xl text-white font-semibold px-20 py-3 md:px-16 sm:px-12 xs:px-6 md:text-sm sm:text-sm xs:text-xs transition duration-300'
              onClick={() => router.push('/login')}>
              {t('common:Get Started')}
            </button>
          </div>
        </div>
      </div>
      <div className='my-12 flex flex-col items-center gap-12 xs:gap-6'>
        <div className='flex flex-col items-center gap-12'>
          <Image src={insta_logo} alt='instagram logo' width={1500} height={100} className='w-[65%] lg:w-[65%] md:w-[45%] sm:w-[35%] xs:w-[35%]' />
          <Image src={insta_icon} alt='instagram icon' width={1500} height={100} className='w-[55%] lg:w-[55%] md:w-[35%] sm:w-[25%] xs:w-[25%]' />
        </div>
        <div className='flex justify-center gap-12 sm:gap-6 xs:gap-2'>
          <p className='font-semibold text-main-insta text-3xl lg:text-2xl md:text-xl sm:text-lg xs:text-xs'>#Plogging</p>
          <p className='font-semibold text-main-insta text-3xl lg:text-2xl md:text-xl sm:text-lg xs:text-xs'>#BeachCombing</p>
          <p className='font-semibold text-main-insta text-3xl lg:text-2xl md:text-xl sm:text-lg xs:text-xs'>#Garbage</p>
        </div>
        <div className='w-full grid grid-cols-5 gap-24 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-3 xs:grid-cols-3 lg:gap-18 md:gap-14 sm:gap-6 xs:gap-2'>
          {dummy.map((item) => {
            return (
              <div className="
                w-full
                max-h-[100%]
                bg-white 
                shadow-lg 
                border 
                rounded-3xl 
                sm:rounded-xl
                xs:rounded-lg
                transform 
                transition-transform 
                duration-300 
                hover:-translate-y-2 
                cursor-pointer"
                key={item.id}>
                <div className='border-b-2 relative pb-[65%] sm:pb-[90%] xs:pb-[90%]'>
                  <Image
                    className='rounded-t-3xl object-cover'
                    src={item.image}
                    layout='fill'
                    alt='insta image'
                  />
                </div>
                <div className='p-6 sm:p-3 xs:p-2 w-full'>
                  <div className="mb-4">
                    <h2 className="text-xl font-bold hover:underline sm:text-lg xs:text-sm">@{item.insta_id}</h2>
                  </div>
                  <p className="text-gray-700 font-semibold lg:text-sm sm:text-xs xs:text-xs overflow-ellipsis overflow-hidden">
                  {item.insta_content.length > 50 ? item.insta_content.slice(0, 50) + '...' : item.insta_content}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );

}

export default Main;
