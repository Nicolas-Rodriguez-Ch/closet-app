'use client';

import Link from 'next/link';
import React from 'react';

const navBar = () => {
  return (
    <header className='bg-palette-5 flex flex-row gap-5 p-5'>
      <Link 
        href='/'
        className='text-palette-3 font-bold'
      >
        LookBook
      </Link>

      <h1 className='text-palette-3'>Saved Outfits</h1>
      <h1>Theme Dark or light</h1>
    </header>
  );
};

export default navBar;
