'use client';

import { fetchAllApparel } from '@/lib/features/apparel/apparelSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import React, { useEffect } from 'react';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import ErrorComponent from '../ErrorComponent/ErrorComponent';

const CarrouselWrapper = () => {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((state) => state.apparel);

  useEffect(() => {
    dispatch(fetchAllApparel());
  }, [dispatch]);

  console.log('🚀 ~ CarrouselWrapper ~ items:', items);

  return (
    <div>
      {(status === 'idle' || status === 'loading') && <LoadingComponent />}{' '}
      {status === 'failed' && <ErrorComponent />}
      {status === 'succeeded' && <>{items?.BOTTOM?.[1]?.id}</>}
    </div>
  );
};

export default CarrouselWrapper;
