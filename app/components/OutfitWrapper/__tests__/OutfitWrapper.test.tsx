import { render, screen } from '@testing-library/react';
import OutfitWrapper from '../OutfitWrapper';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchAllOutfits } from '@/lib/features/outfit/outfitSlice';
import { Dispatch } from '@reduxjs/toolkit';
import { IApparel } from '@/lib/types';

jest.mock('@/lib/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock('@/lib/features/outfit/outfitSlice', () => ({
  fetchAllOutfits: jest.fn(),
}));

jest.mock('../../LoadingComponent/LoadingComponent', () => {
  return function MockLoading() {
    return <div data-testid='loading-component'>Loading...</div>;
  };
});

jest.mock('../../ErrorComponent/ErrorComponent', () => {
  return function MockError() {
    return <div data-testid='error-component'>Error occurred</div>;
  };
});

jest.mock('../OutfitItem/OutfitItem', () => {
  return function MockOutfitItem({ item }: { item: IApparel }) {
    return <div data-testid={`outfit-item-${item.id}`}>{item.title}</div>;
  };
});

describe('OutfitWrapper', () => {
  const mockDispatch = jest.fn() as unknown as Dispatch<any>;

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
  });

  test('should fetch outfits on mount', () => {
    (useAppSelector as unknown as jest.Mock).mockReturnValue({
      items: [],
      status: 'idle',
    });

    render(<OutfitWrapper />);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(fetchAllOutfits());
  });

  test('should render loading component when status is idle', () => {
    (useAppSelector as unknown as jest.Mock).mockReturnValue({
      items: [],
      status: 'idle',
    });

    render(<OutfitWrapper />);

    expect(screen.getByTestId('loading-component')).toBeInTheDocument();
  });

  test('should render loading component when status is loading', () => {
    (useAppSelector as unknown as jest.Mock).mockReturnValue({
      items: [],
      status: 'loading',
    });

    render(<OutfitWrapper />);

    expect(screen.getByTestId('loading-component')).toBeInTheDocument();
  });

  test('should render error component when status is failed', () => {
    (useAppSelector as unknown as jest.Mock).mockReturnValue({
      items: [],
      status: 'failed',
    });

    render(<OutfitWrapper />);

    expect(screen.getByTestId('error-component')).toBeInTheDocument();
  });

  test('should render outfits when status is succeeded', () => {
    const mockOutfits = [
      { id: '1', title: 'Outfit 1' },
      { id: '2', title: 'Outfit 2' },
    ];

    (useAppSelector as unknown as jest.Mock).mockReturnValue({
      items: mockOutfits,
      status: 'succeeded',
    });

    render(<OutfitWrapper />);

    expect(screen.getByTestId('outfit-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('outfit-item-2')).toBeInTheDocument();
    expect(screen.getByText('Outfit 1')).toBeInTheDocument();
    expect(screen.getByText('Outfit 2')).toBeInTheDocument();
  });

  test('should use 3 columns layout when there are 3 or fewer outfits', () => {
    const mockOutfits = [
      { id: '1', title: 'Outfit 1' },
      { id: '2', title: 'Outfit 2' },
      { id: '3', title: 'Outfit 3' },
    ];

    (useAppSelector as unknown as jest.Mock).mockReturnValue({
      items: mockOutfits,
      status: 'succeeded',
    });

    render(<OutfitWrapper />);

    const gridContainer = screen.getByTestId('outfits-grid');
    expect(gridContainer).toHaveClass('lg:grid-cols-3');
    expect(gridContainer).not.toHaveClass('lg:grid-cols-4');
  });

  test('should use 4 columns layout when there are more than 3 outfits', () => {
    const mockOutfits = [
      { id: '1', title: 'Outfit 1' },
      { id: '2', title: 'Outfit 2' },
      { id: '3', title: 'Outfit 3' },
      { id: '4', title: 'Outfit 4' },
    ];

    (useAppSelector as unknown as jest.Mock).mockReturnValue({
      items: mockOutfits,
      status: 'succeeded',
    });

    render(<OutfitWrapper />);

    const gridContainer = screen.getByTestId('outfits-grid');
    expect(gridContainer).toHaveClass('lg:grid-cols-4');
    expect(gridContainer).not.toHaveClass('lg:grid-cols-3');
  });
});
