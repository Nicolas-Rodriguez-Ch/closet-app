import React from 'react';
import { render, screen } from '@testing-library/react';
import NavBar from '../navBar';
import * as nextNavigation from 'next/navigation';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('NavBar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders logo and navigation links', () => {
    (nextNavigation.usePathname as jest.Mock).mockReturnValue('/');
    
    render(<NavBar />);
    
    expect(screen.getByText('LookBook')).toBeInTheDocument();
    expect(screen.getByText('Saved Outfits')).toBeInTheDocument();
    expect(screen.getByText('Theme')).toBeInTheDocument();
  });

  it('highlights the active link based on current path', () => {
    (nextNavigation.usePathname as jest.Mock).mockReturnValue('/outfits');
    
    render(<NavBar />);
    

    const outfitsLink = screen.getByText('Saved Outfits').closest('a');
    expect(outfitsLink).toHaveClass('before:w-full');
    
    const homeLink = screen.getByText('LookBook').closest('a');
    expect(homeLink).toHaveClass('before:w-0');
  });
});