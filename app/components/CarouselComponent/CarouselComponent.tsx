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
    <div className='w-full px-4 py-6 bg-palette-3'>
    <section className='w-full max-w-[500px] mx-auto flex flex-col items-center space-y-4 bg-white rounded-lg shadow-md p-4'>
      <h1 className='text-lg font-bold text-palette-2 uppercase tracking-wider'>
        {category}
      </h1>

      <div className='flex items-center justify-between w-full gap-4'>
        <button
          onClick={showPreviousItem}
          className='flex-1 bg-palette-1 text-white py-2 px-4 rounded-full hover:bg-palette-5 transition-colors'
        >
          Previous
        </button>

        <button
          onClick={showNextItem}
          className='flex-1 bg-palette-1 text-white py-2 px-4 rounded-full hover:bg-palette-5 transition-colors'
        >
          Next
        </button>
      </div>

      <div className='w-full h-[400px]'>
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
