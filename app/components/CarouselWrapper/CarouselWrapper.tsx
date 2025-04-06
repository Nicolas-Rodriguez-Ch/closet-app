'use client';

import { fetchAllApparel } from '@/lib/features/apparel/apparelSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import React, { useEffect } from 'react';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import ErrorComponent from '../ErrorComponent/ErrorComponent';
import CarouselComponent from '../CarouselComponent/CarouselComponent';

const CarouselWrapper = () => {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((state) => state.apparel);

  useEffect(() => {
    dispatch(fetchAllApparel());
  }, [dispatch]);

  return (
    <div>
      {(status === 'idle' || status === 'loading') && <LoadingComponent />}{' '}
      {status === 'failed' && <ErrorComponent />}
      {status === 'succeeded' && (
        <>
          {Object.entries(items).map(([category, categoryItems]) => (
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
