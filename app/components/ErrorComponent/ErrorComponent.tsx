import Image from 'next/image';
import React from 'react';
import errorImg from '../../../public/images/error_img.png';
import Link from 'next/link';

const ErrorComponent = () => {
  return (
    <div className='flex min-h-screen items-center justify-center bg-palette-3 px-4 py-6 sm:px-6'>
      <div className='w-full max-w-md space-y-6 rounded-[1.5rem] border border-white/70 bg-white/85 p-6 text-center shadow-[0_18px_45px_rgba(79,64,54,0.12)] backdrop-blur-sm sm:p-8'>
        <span
          className='mb-2 block text-lg font-semibold text-palette-2'
          role='alert'
        >
          Error getting the information, please try again later
        </span>

        <div className='mb-6 flex justify-center'>
          <Image
            src={errorImg}
            alt='Error'
            className='max-w-full h-auto object-contain'
            width={300}
            height={300}
          />
        </div>

        <button className='w-full rounded-full bg-palette-1 px-6 py-3 text-palette-3 transition-colors duration-300 hover:bg-palette-5 focus:outline-none focus:ring-2 focus:ring-palette-4'>
          <Link
            href='/'
            className='block w-full text-center font-bold text-palette-3'
          >
            Go back to the home page
          </Link>
        </button>
      </div>
    </div>
  );
};

export default ErrorComponent;
