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
    <div className='bg-palette-4/80 min-h-screen w-full py-3 sm:py-6'>
      {(status === 'idle' || status === 'loading') && <LoadingComponent />}
      {status === 'failed' && <ErrorComponent />}
      {status === 'succeeded' && (
        <div className='container mx-auto px-3 sm:px-6'>
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 ${
              items.length <= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
            } gap-3 sm:gap-5`}
          >
            {items.map((item) => (
              <OutfitItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OutfitWrapper;
