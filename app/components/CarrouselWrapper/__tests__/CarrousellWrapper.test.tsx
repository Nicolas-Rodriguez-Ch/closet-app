import { render, screen } from '@testing-library/react';
import CarrouselWrapper from '../CarrouselWrapper';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchAllApparel } from '@/lib/features/apparel/apparelSlice';

jest.mock('@/lib/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock('@/lib/features/apparel/apparelSlice', () => ({
  fetchAllApparel: jest.fn(() => ({ type: 'FETCH_ALL_APPAREL' })),
}));

describe('CarrouselWrapper', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    mockDispatch.mockClear();
    (useAppDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useAppSelector as unknown as jest.Mock).mockReturnValue({ items: [], status: 'idle' });
  });

  it('renders correctly', () => {
    render(<CarrouselWrapper />);
    expect(screen.getByText('Carrousel wrapper')).toBeInTheDocument();
  });

  it('dispatches fetchAllApparel on mount', () => {
    render(<CarrouselWrapper />);
    expect(mockDispatch).toHaveBeenCalledWith(fetchAllApparel());
  });
});
