'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const NavBar = () => {
  const pathname = usePathname();
  return (
    <header className='sticky top-0 z-40 border-b border-white/10 bg-palette-5/95 backdrop-blur-md shadow-sm'>
      <div className='mx-auto flex w-full max-w-6xl flex-row items-center justify-around gap-1 px-4 py-4 sm:gap-8 sm:px-6 sm:py-5 lg:px-8'>
        <nav className='grid w-full grid-cols-3 gap-2 sm:flex sm:flex-row sm:justify-around sm:gap-3'>
          <Link
            href='/'
            className={`nav-item rounded-full text-palette-3 text-center text-sm font-bold px-3 py-3 sm:px-4 sm:py-2 sm:text-base relative z-10 transition-colors duration-300 before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:-z-10 before:h-full ${
              pathname === '/' ? 'before:w-full' : 'before:w-0'
            } before:bg-palette-2 before:transition-all before:rounded-lg hover:text-palette-3 hover:before:w-full`}
          >
            LookBook
          </Link>
          <Link
            href='/outfits'
            className={`nav-item rounded-full text-palette-3 text-center text-sm font-bold px-3 py-3 sm:px-4 sm:py-2 sm:text-base relative z-10 transition-colors duration-300 before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:-z-10 before:h-full ${
              pathname === '/outfits' ? 'before:w-full' : 'before:w-0'
            } before:bg-palette-2 before:transition-all before:rounded-lg hover:text-palette-3 hover:before:w-full`}
          >
            Saved Outfits
          </Link>
          <Link
            href='/upload'
            className={`nav-item rounded-full text-palette-3 text-center text-sm font-bold px-3 py-3 sm:px-4 sm:py-2 sm:text-base relative z-10 transition-colors duration-300 before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:-z-10 before:h-full ${
              pathname === '/upload' ? 'before:w-full' : 'before:w-0'
            } before:bg-palette-2 before:transition-all before:rounded-lg hover:text-palette-3 hover:before:w-full`}
          >
            Upload Apparel
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
