'use client';

import { fetchAllApparel } from '@/lib/features/apparel/apparelSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useEffect, useRef, useState } from 'react';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import ErrorComponent from '../ErrorComponent/ErrorComponent';
import CarouselComponent from '../CarouselComponent/CarouselComponent';

const CarouselWrapper = () => {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((state) => state.apparel);
  const [showCoats, setShowCoats] = useState(true);

  const activeIndicesRef = useRef<Record<string, number>>({});

  useEffect(() => {
    dispatch(fetchAllApparel());
  }, [dispatch]);

  useEffect(() => {
    if (!showCoats && 'COAT' in activeIndicesRef.current) {
      const newIndices = { ...activeIndicesRef.current };
      delete newIndices['COAT'];
      activeIndicesRef.current = newIndices;
    }
  }, [showCoats]);

  const toggleCoats = () => {
    setShowCoats((prev) => !prev);
  };

  const handleIndexChange = (category: string, index: number) => {
    activeIndicesRef.current[category] = index;
  };

  const handleCreateOutfit = () => {
    const renderedCategories = Object.entries(items)
      .filter(([category]) => category !== 'COAT' || showCoats)
      .map(([category]) => category);

    const currentOutfit = Object.fromEntries(
      Object.entries(activeIndicesRef.current).filter(([category]) =>
        renderedCategories.includes(category)
      )
    );

    console.log('Outfit selection: ', currentOutfit);
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

          <div className='md:grid md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] md:gap-4'>
            {Object.entries(items)
              .filter(([category]) => category !== 'COAT' || showCoats)
              .map(([category, categoryItems]) => (
                <CarouselComponent
                  key={category}
                  category={category}
                  item={categoryItems}
                  onIndexChange={(index) => {
                    handleIndexChange(category, index);
                  }}
                />
              ))}
          </div>

          <div className='flex justify-center'>
            <button
              onClick={handleCreateOutfit}
              className='bg-palette-1 text-white p-4 mb-4 rounded-4xl hover:bg-palette-5 transition-colors font-bold'
            >
              Create this outfit!
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CarouselWrapper;
