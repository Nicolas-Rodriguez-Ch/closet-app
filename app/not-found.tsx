'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import errorImg from '../public/images/error_img.png';

export default function NotFound() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-palette-3 px-4 py-6 sm:px-6'>
      <div className='w-full max-w-md space-y-6 rounded-[1.5rem] border border-white/70 bg-white/85 p-6 text-center shadow-[0_18px_45px_rgba(79,64,54,0.12)] backdrop-blur-sm sm:p-8'>
        <h1 className='mb-2 text-3xl font-bold text-palette-2'>Page Not Found</h1>

        <span className='mb-4 block text-lg text-palette-2'>
          The page you are looking for does not exist or has been moved.
        </span>

        <div className='mb-6 flex justify-center'>
          <Image
            src={errorImg}
            alt='Page Not Found'
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
}