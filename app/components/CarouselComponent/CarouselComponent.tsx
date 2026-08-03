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
      <section className='w-full max-w-[560px] mx-auto overflow-hidden rounded-[1.5rem] border border-white/70 bg-white shadow-[0_18px_45px_rgba(79,64,54,0.12)]'>
        <div className='flex items-center justify-between gap-3 border-b border-palette-4/40 bg-palette-4/15 px-4 py-3 sm:px-5'>
          <div className='flex flex-col'>
            <h2 className='text-base font-bold uppercase tracking-[0.22em] text-palette-2 sm:text-lg'>
              {category}
            </h2>
          </div>
          <span className='rounded-full bg-white px-3 py-1 text-xs font-semibold text-palette-2 shadow-sm sm:text-sm'>
            {activeIndex + 1}/{item.length}
          </span>
        </div>

        <div className='px-4 py-4 sm:px-5 sm:py-5'>
          <div className='flex items-center justify-between w-full gap-4'>
          <button
            onClick={showPreviousItem}
            className='flex-1 bg-palette-1 text-white py-3 px-4 rounded-full text-sm font-semibold hover:bg-palette-5 transition-colors sm:text-base'
          >
            Previous
          </button>

          <button
            onClick={showNextItem}
            className='flex-1 rounded-full bg-palette-1 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-palette-5 sm:text-base'
          >
            Next
          </button>
          </div>
          <Link
            href={`/apparel/${item[activeIndex].id}`}
            className='mt-4 block w-full'
            aria-label={`View details of ${item[activeIndex].title}`}
          >
            <ApparelSlide
              imgSrc={item[activeIndex].pictureURL}
              title={item[activeIndex].title}
            />
          </Link>

          <p className='mt-4 text-center text-xs text-palette-5 sm:text-sm'>
            Tap the image to view or edit details
          </p>
        </div>
      </section>
    </div>
  );
};

export default CarouselComponent;
