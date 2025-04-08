import React from 'react';
import Image from 'next/image';
import loading_gif from '../../../public/images/loading_gif.gif';

const LoadingComponent = () => {
  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-palette-3/80'
      role='alert'
    >
      <div className='flex flex-col items-center justify-center space-y-4'>
        <div className='text-palette-2 font-bold text-xl'>
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
