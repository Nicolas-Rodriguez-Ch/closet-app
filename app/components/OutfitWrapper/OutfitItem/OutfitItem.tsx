'use client';
import { OutfitItemProps } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';

const OutfitItem = ({ item }: OutfitItemProps) => {
  return (
    <div className='bg-palette-3 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-palette-4/30'>
      <div className='p-3 sm:p-4 border-b border-palette-1/20'>
        <h1 className='text-palette-2 text-lg sm:text-xl font-medium'>
          {item.title}
        </h1>
        {item.description ? (
          <p className='text-palette-5 text-xs sm:text-sm mt-1 italic font-light'>
            {item.description}
          </p>
        ) : null}
      </div>

      <Link href={`/outfits/${item.id}`} className='block p-3 sm:p-4'>
        <div className='grid grid-cols-2 gap-3 sm:gap-4'>
          {item.coatID && (
            <div className='flex flex-col items-center'>
              <p className='text-palette-2 text-xs sm:text-sm mt-1 sm:mt-2 font-bold'>
                Coat
              </p>
              <div className='flex justify-center items-center h-36 sm:h-48 w-full'>
                <Image
                  src={item.coatID.pictureURL}
                  alt={item.coatID.title}
                  width={150}
                  height={150}
                  className='object-contain max-h-32 sm:max-h-44 max-w-full'
                />
              </div>
            </div>
          )}

          <div className='flex flex-col items-center'>
            <p className='text-palette-2 text-xs sm:text-sm mt-1 sm:mt-2 font-bold'>
              Top
            </p>
            <div className='flex justify-center items-center h-36 sm:h-48 w-full'>
              <Image
                src={item.topID.pictureURL}
                alt={item.topID.title}
                width={150}
                height={150}
                className='object-contain max-h-32 sm:max-h-44 max-w-full'
              />
            </div>
          </div>

          <div className='flex flex-col items-center'>
            <p className='text-palette-2 text-xs sm:text-sm mt-1 sm:mt-2 font-bold'>
              Bottom
            </p>

            <div className='flex justify-center items-center h-36 sm:h-48 w-full'>
              <Image
                src={item.bottomID.pictureURL}
                alt={item.bottomID.title}
                width={150}
                height={150}
                className='object-contain max-h-32 sm:max-h-44 max-w-full'
              />
            </div>
          </div>

          <div className='flex flex-col items-center'>
            <p className='text-palette-2 text-xs sm:text-sm mt-1 sm:mt-2 font-bold'>
              Shoes
            </p>
            <div className='flex justify-center items-center h-36 sm:h-48 w-full'>
              <Image
                src={item.shoesID.pictureURL}
                alt={item.shoesID.title}
                width={150}
                height={150}
                className='object-contain max-h-32 sm:max-h-44 max-w-full'
              />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default OutfitItem;
