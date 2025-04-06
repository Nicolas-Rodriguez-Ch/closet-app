import { ApparelSlideProps } from '@/lib/types';
import Image from 'next/image';
import React from 'react';

const ApparelSlide = ({ imgSrc, title }: ApparelSlideProps) => {
  return (
    <div className='flex flex-col items-center space-y-4 w-full'>
      {title && (
        <h2 className='text-lg font-semibold text-palette-2 text-center'>
          {title}
        </h2>
      )}
      <div className='w-full max-w-xs aspect-square relative flex items-center justify-center'>
        <Image
          src={imgSrc}
          alt={title || 'Apparel Item'}
          fill
          className='object-contain rounded-lg mb-3'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
      </div>
    </div>
  );
};

export default ApparelSlide;
