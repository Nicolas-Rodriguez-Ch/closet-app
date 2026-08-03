import { ApparelSlideProps } from '@/lib/types';
import Image from 'next/image';
import React from 'react';

const ApparelSlide = ({ imgSrc, title }: ApparelSlideProps) => {
  return (
    <div className='flex w-full flex-col items-center gap-4'>
      {title && (
        <h2 className='text-center text-lg font-semibold text-palette-2 sm:text-xl'>
          {title}
        </h2>
      )}
      <div className='relative flex aspect-[1/1.06] w-full max-w-sm items-center justify-center overflow-hidden rounded-[1.25rem] border border-palette-4/30 bg-gradient-to-br from-white via-palette-3 to-palette-4/20 p-5'>
        <Image
          src={imgSrc}
          alt={title || 'Apparel Item'}
          fill
          className='object-contain p-1 sm:p-2'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
      </div>
    </div>
  );
};

export default ApparelSlide;
