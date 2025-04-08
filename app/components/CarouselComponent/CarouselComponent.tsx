import { CarouselComponentProps } from '@/lib/types';
import React, { useEffect, useState } from 'react';
import ApparelSlide from './ApparrelSlide/ApparelSlide';
import Link from 'next/link';

const CarouselComponent = ({
  item,
  category,
  onIndexChange,
}: CarouselComponentProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (onIndexChange) {
      onIndexChange(activeIndex, category);
    }
  }, [activeIndex, onIndexChange, category]);

  const showNextItem = () => {
    setActiveIndex((prev) => (prev + 1) % item.length);
  };

  const showPreviousItem = () => {
    setActiveIndex((prev) => (prev === 0 ? item.length - 1 : prev - 1));
  };

  return (
    <div className='w-full px-4 py-4 md:py-8 bg-palette-3'>
      <section className='w-full max-w-[500px] mx-auto flex flex-col items-center space-y-4 bg-white rounded-lg shadow-md p-4'>
        <h2 className='text-lg font-bold text-palette-2 capitalize'>
          {category}
        </h2>

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

        <Link
          href={`/apparel/${item[activeIndex].id}`}
          className='w-full'
          aria-label={`View details of ${item[activeIndex].title}`}
        >
          <ApparelSlide
            imgSrc={item[activeIndex].pictureURL}
            title={item[activeIndex].title}
          />
        </Link>

        <p className='text-xs text-palette-5 text-center mt-2'>
          Tap the image to view or edit details
        </p>
      </section>
    </div>
  );
};

export default CarouselComponent;
