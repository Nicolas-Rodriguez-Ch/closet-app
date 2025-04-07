import React from 'react';
import { render, screen } from '@testing-library/react';
import ApparelSlide from '../ApparelSlide';
import '@testing-library/jest-dom';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img data-testid="mock-image" {...props} />;
  },
}));

describe('ApparelSlide', () => {
  const mockProps = {
    imgSrc: '/test-image.jpg',
    title: 'Test Apparel',
  };

  test('renders the component with image and title', () => {
    render(<ApparelSlide {...mockProps} />);
    
    expect(screen.getByText('Test Apparel')).toBeInTheDocument();
    
    const image = screen.getByAltText('Test Apparel');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.jpg');
  });

  test('renders the component with empty title', () => {
    const propsWithEmptyTitle = {
      imgSrc: '/test-image.jpg',
      title: '',
    };
    
    render(<ApparelSlide {...propsWithEmptyTitle} />);
    
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    
    const image = screen.getByAltText('Apparel Item');
    expect(image).toBeInTheDocument();
  });

  test('applies correct CSS classes', () => {
    render(<ApparelSlide {...mockProps} />);
    
    const title = screen.getByText('Test Apparel');
    expect(title).toHaveClass('text-lg font-semibold text-palette-2 text-center');
    
    const imageContainer = screen.getByAltText('Test Apparel').parentElement;
    expect(imageContainer).toHaveClass('w-full max-w-xs aspect-square relative flex items-center justify-center');
    
    const image = screen.getByAltText('Test Apparel');
    expect(image).toHaveClass('object-contain rounded-lg mb-3');
  });

  test('passes correct props to Next.js Image component', () => {
    render(<ApparelSlide {...mockProps} />);
    
    const image = screen.getByAltText('Test Apparel');
    expect(image).toHaveAttribute('src', '/test-image.jpg');
    expect(image).toHaveAttribute('alt', 'Test Apparel');
    expect(image).toHaveAttribute('sizes', '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw');
  });
});