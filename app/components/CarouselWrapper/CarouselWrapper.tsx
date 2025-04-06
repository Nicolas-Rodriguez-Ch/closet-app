'use client';

import { fetchAllApparel } from '@/lib/features/apparel/apparelSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useEffect, useState } from 'react';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import ErrorComponent from '../ErrorComponent/ErrorComponent';
import CarouselComponent from '../CarouselComponent/CarouselComponent';

const CarouselWrapper = () => {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((state) => state.apparel);
  const [showCoats, setShowCoats] = useState(true);

  useEffect(() => {
    dispatch(fetchAllApparel());
  }, [dispatch]);

  const toggleCoats = () => {
    setShowCoats((prev) => !prev);
  };

  return (
    <div className='bg-palette-3'>
      {(status === 'idle' || status === 'loading') && <LoadingComponent />}{' '}
      {status === 'failed' && <ErrorComponent />}
      {status === 'succeeded' && (
        <>
          <button
            onClick={toggleCoats}
            className='bg-palette-1 text-white p-2 rounded-full text-sm shadow-md hover:bg-palette-5 transition-colors duration-300 ease-in-out self-start m-2 md:absolute md:top-[initial] md:left-[initial] sm:p-3 sm:text-base'
          >
            {showCoats ? 'Hide Coats' : 'Show Coats'}
          </button>
          {Object.entries(items)
            .filter(([category]) => category !== 'COAT' || showCoats)
            .map(([category, categoryItems]) => (
              <CarouselComponent
                key={category}
                category={category}
                item={categoryItems}
              />
            ))}
        </>
      )}
      <button>Create this outfit!</button>
    </div>
  );
};

export default CarouselWrapper;
