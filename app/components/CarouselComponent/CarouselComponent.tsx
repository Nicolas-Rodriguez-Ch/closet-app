import { CarouselComponentProps } from '@/lib/types';
import React, { useState } from 'react';
import ApparelSlide from './ApparrelSlide/ApparelSlide';

const CarouselComponent = ({ item, category }: CarouselComponentProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const showNextItem = () => {
    setActiveIndex((prev) => (prev + 1) % item.length);
  };

  const showPreviousItem = () => {
    setActiveIndex((prev) => (prev === 0 ? item.length - 1 : prev - 1));
  };

  return (
    <div className='w-full max-w-md mx-auto px-4 py-6 bg-palette-3'>
      <section className='flex flex-col items-center space-y-4 bg-white rounded-lg shadow-md p-6'>
        <h1 className='text-2xl font-bold text-palette-2 uppercase tracking-wider mb-2'>
          {category}
        </h1>

        <div className='flex items-center justify-between w-full space-x-4'>
          <button
            onClick={showPreviousItem}
            className='bg-palette-1 text-white w-1/4 p-1 rounded-4xl hover:bg-palette-5 transition-colors duration-300 ease-in-out'
          >
            Previous
          </button>

          <button
            onClick={showNextItem}
            className='bg-palette-1 text-white w-1/4 p-1 rounded-4xl hover:bg-palette-5 transition-colors duration-300 ease-in-out'
          >
            Next
          </button>
        </div>

        <div className='w-full max-w-xs aspect-square flex items-center justify-center'>
          <ApparelSlide
            imgSrc={item[activeIndex].pictureURL}
            title={item[activeIndex].title}
          />
        </div>
      </section>
    </div>
  );
};

export default CarouselComponent;
