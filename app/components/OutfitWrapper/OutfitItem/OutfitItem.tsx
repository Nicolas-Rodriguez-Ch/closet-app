'use client';
import { OutfitItemProps } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';

const OutfitItem = ({ item }: OutfitItemProps) => {
  return (
    <div className='overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/85 shadow-[0_18px_45px_rgba(79,64,54,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(79,64,54,0.16)]'>
      <div className='border-b border-palette-4/30 bg-palette-4/10 p-4 sm:p-5'>
        <h1 className='text-lg font-medium text-palette-2 sm:text-xl'>
          {item.title}
        </h1>
        {item.description ? (
          <p className='mt-1 text-xs font-light italic text-palette-5 sm:text-sm'>
            {item.description}
          </p>
        ) : null}
      </div>

      <Link href={`/outfits/${item.id}`} className='block p-4 sm:p-5'>
        <div className='grid grid-cols-2 gap-3 sm:gap-4'>
          {item.coatID && (
            <div className='flex flex-col items-center'>
              <p className='mt-1 text-xs font-bold text-palette-2 sm:mt-2 sm:text-sm'>
                Coat
              </p>
              <div className='flex w-full items-center justify-center overflow-hidden rounded-2xl bg-palette-4/10 aspect-square'>
                <Image
                  src={item.coatID.pictureURL}
                  alt={item.coatID.title}
                  width={150}
                  height={150}
                  className='h-full w-full object-contain p-3 sm:p-4'
                />
              </div>
            </div>
          )}

          <div className='flex flex-col items-center'>
            <p className='mt-1 text-xs font-bold text-palette-2 sm:mt-2 sm:text-sm'>
              Top
            </p>
            <div className='flex w-full items-center justify-center overflow-hidden rounded-2xl bg-palette-4/10 aspect-square'>
              <Image
                src={item.topID.pictureURL}
                alt={item.topID.title}
                width={150}
                height={150}
                className='h-full w-full object-contain p-3 sm:p-4'
              />
            </div>
          </div>

          <div className='flex flex-col items-center'>
            <p className='mt-1 text-xs font-bold text-palette-2 sm:mt-2 sm:text-sm'>
              Bottom
            </p>

            <div className='flex w-full items-center justify-center overflow-hidden rounded-2xl bg-palette-4/10 aspect-square'>
              <Image
                src={item.bottomID.pictureURL}
                alt={item.bottomID.title}
                width={150}
                height={150}
                className='h-full w-full object-contain p-3 sm:p-4'
              />
            </div>
          </div>

          <div className='flex flex-col items-center'>
            <p className='mt-1 text-xs font-bold text-palette-2 sm:mt-2 sm:text-sm'>
              Shoes
            </p>
            <div className='flex w-full items-center justify-center overflow-hidden rounded-2xl bg-palette-4/10 aspect-square'>
              <Image
                src={item.shoesID.pictureURL}
                alt={item.shoesID.title}
                width={150}
                height={150}
                className='h-full w-full object-contain p-3 sm:p-4'
              />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default OutfitItem;
