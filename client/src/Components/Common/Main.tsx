import React, { useEffect } from 'react';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { hero_img, insta_icon, insta_logo } from '../Reference';

const Main = () => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const dummy = [
    { id: 1, image: hero_img, insta_id: 'et', insta_content: 'Et neque dolores quia veritatis rerum aliquam labore asperiores.Dolorem sequi itaque velit nihil natus fuga.Quis alias voluptas repudiandae iusto inventore neque.Et consequatur dolorum.' },
    { id: 2, image: insta_icon, insta_id: 'rem', insta_content: 'Ea maxime dolore quam doloremque dolores exercitationem.' },
    { id: 3, image: insta_logo, insta_id: 'voluptas', insta_content: 'Porro dolorem tenetur animi aperiam ea autem.' },
  ]

  return (
    <div className='px-12 sm:px-6 xs:px-4'>
      <div className='hero-bg py-[10%] md:py-[2%] sm:py-[5%] xs:py-[4%] px-[20%] lg:px-[5%] md:px-[3%] sm:px-[1%] xs:px-[2%]'>
        <div className='w-full h-full flex flex-col justify-center md:justify-end sm:justify-end xs:justify-end md:items-center sm:items-center xs:items-center md:pb-5 sm:pb-2 xs:pb-2 items-end gap-12 lg:gap-6 md:gap-4 sm:gap-4 xs:gap-4 text-right md:text-center sm:text-center xs:text-center'>
          <h1 className='text-7xl font-bold lg:text-4xl md:text-3xl sm:text-2xl xs:text-lg'>Clean Mile</h1>
          <p className='whitespace-normal w-[60%] lg:w-[70%] md:w-[90%] sm:w-[100%] xs:w-[100%] lg:text-sm md:text-xs sm:text-xs xs:text-xs font-semibold md:font-semibold sm:font-semibold xs:font-semibold'>
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
          <img src='/assets/images/insta_logo.png' alt='instagram logo' className='w-[65%] lg:w-[65%] md:w-[45%] sm:w-[35%] xs:w-[35%]' />
          <img src='/assets/images/insta_icon.png' alt='instagram icon' className='w-[55%] lg:w-[55%] md:w-[35%] sm:w-[25%] xs:w-[25%]' />
        </div>
        <div className='flex justify-center gap-12 sm:gap-6 xs:gap-2'>
          <p className='font-semibold text-main-insta text-3xl lg:text-2xl md:text-xl sm:text-lg xs:text-xs'>#Plogging</p>
          <p className='font-semibold text-main-insta text-3xl lg:text-2xl md:text-xl sm:text-lg xs:text-xs'>#BeachComing</p>
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
                    <h2 className="text-xl font-bold hover:underline sm:text-lg xs:text-sm">{item.insta_id}</h2>
                  </div>
                  <p className="text-gray-700 font-semibold lg:text-sm sm:text-xs xs:text-xs overflow-ellipsis overflow-hidden">{item.insta_content}</p>
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
