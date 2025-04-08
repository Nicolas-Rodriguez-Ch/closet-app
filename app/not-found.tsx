'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import errorImg from '../public/images/error_img.png';

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-palette-3 p-4'>
      <div className='text-center max-w-md w-full space-y-6'>
        <h1 className='text-3xl font-bold text-palette-2 mb-2'>Page Not Found</h1>
        
        <span className='block text-palette-2 text-lg mb-4'>
          The page you are looking for does not exist or has been moved.
        </span>

        <div className='flex justify-center mb-6'>
          <Image
            src={errorImg}
            alt='Page Not Found'
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
}