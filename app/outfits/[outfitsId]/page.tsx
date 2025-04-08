'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import LoadingComponent from '@/app/components/LoadingComponent/LoadingComponent';
import ErrorComponent from '@/app/components/ErrorComponent/ErrorComponent';
import { fetchAllOutfits } from '@/lib/features/outfit/outfitSlice';
import Image from 'next/image';
import Link from 'next/link';

const IndividualOutfitPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const outfitId = params.outfitsId;
  const [isLoading, setIsLoading] = useState(true);

  const { items, status } = useAppSelector((state) => state.outfit);
  const outfit = useAppSelector((state) =>
    state.outfit.items.find((item) => item.id === outfitId)
  );

  useEffect(() => {
    if (status === 'idle' || (status === 'succeeded' && items.length === 0)) {
      dispatch(fetchAllOutfits());
    } else if (status === 'succeeded') {
      setIsLoading(false);
    }
  }, [dispatch, status, items.length]);

  if (status === 'failed') {
    return <ErrorComponent />;
  }

  if (isLoading || status === 'loading') {
    return <LoadingComponent />;
  }

  if (!outfit && status === 'succeeded') {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-palette-3 p-4'>
        <div className='text-center max-w-md space-y-6'>
          <h1 className='text-2xl font-bold text-palette-2'>
            Outfit Not Found
          </h1>
          <p className='text-palette-2'>
            The outfit you are looking for does not exist or has been removed.
          </p>
          <button className='bg-palette-1 text-white p-3 rounded-lg hover:bg-palette-5 transition-colors'>
            <Link href='/outfits'>Return to Outfits</Link>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-palette-3 min-h-screen py-6 px-4'>
      {outfit && (
        <div className='container mx-auto max-w-4xl'>
          <div className='bg-white rounded-xl overflow-hidden shadow-lg'>
            <div className='p-6 border-b border-palette-4/20'>
              <h1 className='text-3xl font-bold text-palette-2'>
                {outfit.title}
              </h1>
              {outfit.description && (
                <p className='mt-2 text-palette-5 italic'>
                  {outfit.description}
                </p>
              )}
              <div className='mt-3 flex flex-wrap gap-2'>
                {outfit.tags.map((tag, index) => (
                  <span
                    key={index}
                    className='px-3 py-1 bg-palette-4/30 rounded-full text-sm text-palette-2'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className='p-6'>
              <div
                className={`grid grid-cols-2 lg:${
                  outfit.coatID ? 'grid-cols-4' : 'grid-cols-3'
                } gap-6`}
              >
                {outfit.coatID && (
                  <div className='flex flex-col items-center border border-palette-4/20 rounded-lg'>
                    <h2 className='text-xl font-semibold text-palette-2 mb-2'>
                      Coat
                    </h2>
                    <div className='relative w-full h-64 mb-2'>
                      <Image
                        src={outfit.coatID.pictureURL}
                        alt={outfit.coatID.title}
                        fill
                        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                        className='object-contain'
                      />
                    </div>
                    <h3 className='text-palette-2'>{outfit.coatID.title}</h3>
                  </div>
                )}

                <div className='flex flex-col items-center  border border-palette-4/20 rounded-lg'>
                  <h2 className='text-xl font-semibold text-palette-2 mb-2'>
                    Top
                  </h2>
                  <div className='relative w-full h-64 mb-2'>
                    <Image
                      src={outfit.topID.pictureURL}
                      alt={outfit.topID.title}
                      fill
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                      className='object-contain'
                    />
                  </div>
                  <h3 className='text-palette-2'>{outfit.topID.title}</h3>
                </div>

                <div className='flex flex-col items-center border border-palette-4/20 rounded-lg'>
                  <h2 className='text-xl font-semibold text-palette-2 mb-2'>
                    Bottom
                  </h2>
                  <div className='relative w-full h-64 mb-2'>
                    <Image
                      src={outfit.bottomID.pictureURL}
                      alt={outfit.bottomID.title}
                      fill
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                      className='object-contain'
                    />
                  </div>
                  <h3 className='text-palette-2'>{outfit.bottomID.title}</h3>
                </div>

                <div className='flex flex-col items-center border border-palette-4/20 rounded-lg'>
                  <h2 className='text-xl font-semibold text-palette-2 mb-2'>
                    Shoes
                  </h2>
                  <div className='relative w-full h-64 mb-2'>
                    <Image
                      src={outfit.shoesID.pictureURL}
                      alt={outfit.shoesID.title}
                      fill
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                      className='object-contain'
                    />
                  </div>
                  <h3 className='text-palette-2'>{outfit.shoesID.title}</h3>
                </div>
              </div>
            </div>

            <div className='p-6 border-t border-palette-4/20 flex justify-around'>
              <button>Delete outfit</button>
              <button
                onClick={() => router.push('/outfits')}
                className='px-4 py-2 bg-palette-1 text-white rounded-lg hover:bg-palette-5 transition-colors'
              >
                Back to Outfits
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndividualOutfitPage;
