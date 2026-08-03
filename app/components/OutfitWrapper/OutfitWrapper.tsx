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
    <div className='min-h-screen w-full bg-palette-3 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10'>
      {(status === 'idle' || status === 'loading') && <LoadingComponent />}
      {status === 'failed' && <ErrorComponent />}
      {status === 'succeeded' && (
        <div className='mx-auto w-full max-w-7xl'>
          <div
            data-testid='outfits-grid'
            className={`grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6 ${
              items.length <= 3 ? 'xl:grid-cols-3' : 'xl:grid-cols-4'
            }`}
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
