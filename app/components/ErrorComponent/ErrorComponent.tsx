import Image from 'next/image';
import React from 'react';
import errorImg from '../../../public/images/error_img.png';
import Link from 'next/link';

const ErrorComponent = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-palette-3 p-4'>
      <div className='text-center max-w-md w-full space-y-6'>
        <span
          className='block text-palette-2 text-lg font-semibold mb-4'
          role='alert'
        >
          Error getting the information, please try again later
        </span>

        <div className='flex justify-center mb-6'>
          <Image
            src={errorImg}
            alt='Error'
            className='max-w-full h-auto object-contain'
            width={300}
            height={300}
          />
        </div>

        <button className='w-full bg-palette-1 text-palette-3 py-3 px-6 rounded-3xl hover:bg-palette-5 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-palette-4'>
          <Link
            href='/'
            className='block w-full text-center text-palette-3 font-bold'
          >
            Go back to the home page
          </Link>
        </button>
      </div>
    </div>
  );
};

export default ErrorComponent;
