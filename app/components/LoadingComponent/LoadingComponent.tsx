import React from 'react';
import Image from 'next/image';
import loading_gif from '../../../public/images/loading_gif.gif';

const LoadingComponent = () => {
  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-palette-3/80 px-4 backdrop-blur-sm'
      role='alert'
    >
      <div className='flex w-full max-w-xs flex-col items-center justify-center gap-4 rounded-[1.5rem] border border-white/70 bg-white/85 p-6 text-center shadow-[0_18px_45px_rgba(79,64,54,0.12)]'>
        <div className='text-xl font-bold text-palette-2'>
          Loading, please wait
        </div>
        <Image
          src={loading_gif}
          alt='Loading Gif'
          width={100}
          height={100}
          className='animate-pulse'
          priority
          unoptimized
        />
      </div>
    </div>
  );
};

export default LoadingComponent;
