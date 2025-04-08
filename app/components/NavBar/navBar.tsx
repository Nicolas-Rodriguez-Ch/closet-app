'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const NavBar = () => {
  const pathname = usePathname();
  return (
    <header className='bg-palette-5 flex flex-row gap-1 p-5 md:gap-8 md:p-8 items-center justify-around'>
      <Link
        href='/'
        className={`nav-item text-palette-3 text-center font-bold md:text-xl px-3 py-1 relative z-10 transition-colors duration-300 before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:-z-10 before:h-full ${
          pathname === '/' ? 'before:w-full' : 'before:w-0'
        } before:bg-palette-2 before:transition-all before:rounded-lg hover:text-palette-3 hover:before:w-full`}
      >
        LookBook
      </Link>
      <Link
        href='/outfits'
        className={`nav-item text-palette-3 text-center font-bold md:text-xl px-3 py-1 relative z-10 transition-colors duration-300 before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:-z-10 before:h-full ${
          pathname === '/outfits' ? 'before:w-full' : 'before:w-0'
        } before:bg-palette-2 before:transition-all before:rounded-lg hover:text-palette-3 hover:before:w-full`}
      >
        Saved Outfits
      </Link>
      <Link
        href='/upload'
        className={`nav-item text-palette-3 text-center font-bold md:text-xl px-3 py-1 relative z-10 transition-colors duration-300 before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:-z-10 before:h-full ${
          pathname === '/upload' ? 'before:w-full' : 'before:w-0'
        } before:bg-palette-2 before:transition-all before:rounded-lg hover:text-palette-3 hover:before:w-full`}
      >
        Upload Apparel
      </Link>
    </header>
  );
};

export default NavBar;
