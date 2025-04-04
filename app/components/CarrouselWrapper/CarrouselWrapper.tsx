'use client';

import { fetchAllApparel } from '@/lib/features/apparel/apparelSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import React, { useEffect } from 'react';

const CarrouselWrapper = () => {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((state) => state.apparel);

  useEffect(() => {
    dispatch(fetchAllApparel());
  }, [dispatch]);

  console.log('🚀 ~ CarrouselWrapper ~ items:', items);
  console.log('🚀 ~ CarrouselWrapper ~ status:', status);

  return (
    <div>
      <>Carrousel wrapper</>
    </div>
  );
};

export default CarrouselWrapper;
