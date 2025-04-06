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

jest.mock('../../LoadingComponent/LoadingComponent', () => {
  return jest.fn(() => <div data-testid="loading-component">Loading</div>);
});

describe('CarrouselWrapper', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    mockDispatch.mockClear();
    (useAppDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
  });

  it('dispatches fetchAllApparel on mount', () => {
    (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
      items: [], 
      status: 'idle' 
    });

    render(<CarrouselWrapper />);
    expect(mockDispatch).toHaveBeenCalledWith(fetchAllApparel());
  });

  it('renders LoadingComponent when status is idle', () => {
    (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
      items: [], 
      status: 'idle' 
    });

    render(<CarrouselWrapper />);
    expect(screen.getByTestId('loading-component')).toBeInTheDocument();
  });

  it('renders LoadingComponent when status is loading', () => {
    (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
      items: [], 
      status: 'loading' 
    });

    render(<CarrouselWrapper />);
    expect(screen.getByTestId('loading-component')).toBeInTheDocument();
  });

  it('renders item when status is succeeded', () => {
    const mockItems = {
      BOTTOM: [
        null,
        { id: 'test-item-id' }
      ]
    };

    (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
      items: mockItems, 
      status: 'succeeded' 
    });

    render(<CarrouselWrapper />);
    expect(screen.getByText('test-item-id')).toBeInTheDocument();
  });

  it('does not render LoadingComponent when status is succeeded', () => {
    (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
      items: {
        BOTTOM: [
          null,
          { id: 'test-item-id' }
        ]
      }, 
      status: 'succeeded' 
    });

    render(<CarrouselWrapper />);
    expect(screen.queryByTestId('loading-component')).not.toBeInTheDocument();
  });
});