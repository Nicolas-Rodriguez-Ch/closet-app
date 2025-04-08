import { render, screen } from '@testing-library/react';
import OutfitItem from '../OutfitItem';
import { IOutfit, IApparel } from '@/lib/types';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, className }) => (
    <img src={src} alt={alt} className={className} data-testid='next-image' />
  ),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, className }) => (
    <a href={href} className={className} data-testid='next-link'>
      {children}
    </a>
  ),
}));

describe('OutfitItem', () => {
  const mockApparel: IApparel = {
    id: 'apparel-1',
    title: 'Test Apparel',
    pictureURL: '/test-image.jpg',
    type: 'TOP' as any,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  };

  const mockOutfit: IOutfit = {
    id: 'outfit-1',
    title: 'Test Outfit',
    description: 'Test description',
    topID: { ...mockApparel, title: 'Test Top' },
    bottomID: { ...mockApparel, title: 'Test Bottom' },
    shoesID: { ...mockApparel, title: 'Test Shoes' },
    coatID: { ...mockApparel, title: 'Test Coat' },
    tags: ['test'],
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  };

  test('renders outfit title and description', () => {
    render(<OutfitItem item={mockOutfit} />);

    expect(screen.getByText('Test Outfit')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  test('renders outfit without description when description is not provided', () => {
    const outfitWithoutDescription = { ...mockOutfit, description: undefined };
    render(<OutfitItem item={outfitWithoutDescription} />);

    expect(screen.getByText('Test Outfit')).toBeInTheDocument();
    expect(screen.queryByText('Test description')).not.toBeInTheDocument();
  });

  test('renders all clothing items with their labels', () => {
    render(<OutfitItem item={mockOutfit} />);

    expect(screen.getByText('Coat')).toBeInTheDocument();
    expect(screen.getByText('Top')).toBeInTheDocument();
    expect(screen.getByText('Bottom')).toBeInTheDocument();
    expect(screen.getByText('Shoes')).toBeInTheDocument();

    const images = screen.getAllByTestId('next-image');
    expect(images).toHaveLength(4);
  });

  test('does not render coat when coatID is not provided', () => {
    const outfitWithoutCoat = { ...mockOutfit, coatID: undefined };
    render(<OutfitItem item={outfitWithoutCoat} />);

    expect(screen.queryByText('Coat')).not.toBeInTheDocument();
    const images = screen.getAllByTestId('next-image');
    expect(images).toHaveLength(3);
  });

  test('contains a link to the outfit detail page', () => {
    render(<OutfitItem item={mockOutfit} />);

    const link = screen.getByTestId('next-link');
    expect(link).toHaveAttribute('href', '/outfits/outfit-1');
  });

  test('renders with responsive classes for different screen sizes', () => {
    render(<OutfitItem item={mockOutfit} />);

    const container = screen.getByText('Test Outfit').closest('div');
    expect(container).toHaveClass('p-3', 'sm:p-4');

    const title = screen.getByText('Test Outfit');
    expect(title).toHaveClass('text-lg', 'sm:text-xl');

    const imageContainers = document.querySelectorAll('.h-36.sm\\:h-48');
    expect(imageContainers.length).toBe(4);
  });
});
