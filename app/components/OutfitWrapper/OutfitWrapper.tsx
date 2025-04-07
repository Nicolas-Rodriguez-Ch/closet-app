'use client';

import { fetchAllOutfits } from '@/lib/features/outfit/outfitSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useEffect } from 'react';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import ErrorComponent from '../ErrorComponent/ErrorComponent';
import OutfitItem from './OutfitItem/OutfitItem';

const OutfitWrapper = () => {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((state) => state.outfit);

  useEffect(() => {
    dispatch(fetchAllOutfits());
  }, [dispatch]);
  
  return (
    <>
      {(status === 'idle' || status === 'loading') && <LoadingComponent />}
      {status === 'failed' && <ErrorComponent />}
      {status === 'succeeded' && (
        <>
          {items.map((item) => (
            <OutfitItem key={item.id} item={item} />
          ))}
        </>
      )}
    </>
  );
};

export default OutfitWrapper;
