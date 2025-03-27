'use client';

import Link from 'next/link';
import React from 'react';

const navBar = () => {
  return (
    <header className='bg-palette-5 flex flex-row gap-5 p-5 md:gap-8 md:p-8 items-center justify-around'>
      <Link 
        href='/'
        className='text-palette-3 font-bold md:text-xl'
      >
        LookBook
      </Link>
      <Link
        href='/outfits'
        className='text-palette-3 font-bold md:text-xl'
      >
        Saved Outfits
      </Link>
      <h1>Theme</h1>
    </header>
  );
};

export default navBar;
