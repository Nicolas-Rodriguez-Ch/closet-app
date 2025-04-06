import { CarouselComponentProps } from '@/lib/types';
import React, { useState } from 'react';

const CarouselComponent = ({ item, category }: CarouselComponentProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const showNextItem = () => {
    setActiveIndex((prev) => (prev + 1) % item.length);
  };

  const showPreviousItem = () => {
    setActiveIndex((prev) => (prev === 0 ? item.length - 1 : prev - 1));
  };

  return (
    <div className='flex justify-center align-middle content-center'>
      <section className='flex gap-5 flex-col justify-center align-middle content-center text-center mb-4'>
        <h1>{category}</h1>
        <button onClick={showPreviousItem}>Prev apparel</button>
        <span>{item[activeIndex].id}</span>
        <button onClick={showNextItem}>Show next apparel</button>
      </section>
    </div>
  );
};

export default CarouselComponent;
