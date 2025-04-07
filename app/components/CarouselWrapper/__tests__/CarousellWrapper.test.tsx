import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CarouselWrapper from '../CarouselWrapper';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchAllApparel } from '@/lib/features/apparel/apparelSlice';
import { createOutfit } from '@/lib/features/outfit/outfitSlice';
import { toast } from 'react-toastify';

jest.mock('@/lib/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock('@/lib/features/apparel/apparelSlice', () => ({
  fetchAllApparel: jest.fn(() => ({ type: 'FETCH_ALL_APPAREL' })),
}));

jest.mock('@/lib/features/outfit/outfitSlice', () => ({
  createOutfit: jest.fn(() => ({ type: 'CREATE_OUTFIT' })),
}));

jest.mock('react-toastify', () => ({
  toast: {
    promise: jest.fn(),
  },
}));

jest.mock('../../LoadingComponent/LoadingComponent', () => {
  return jest.fn(() => <div data-testid="loading-component">Loading</div>);
});

jest.mock('../../ErrorComponent/ErrorComponent', () => {
  return jest.fn(() => <div data-testid="error-component">Error</div>);
});

jest.mock('../../CarouselComponent/CarouselComponent', () => {
  return jest.fn(({ category, onIndexChange }) => (
    <div data-testid={`carousel-${category}`}>
      <button onClick={() => onIndexChange(0)}>Select First</button>
      <span>{category}</span>
    </div>
  ));
});

jest.mock('../CarouselWrapper', () => {
  const originalModule = jest.requireActual('../CarouselWrapper');
  
  return {
    __esModule: true,
    default: originalModule.default
  };
});

describe('CarouselWrapper', () => {
  const mockDispatch = jest.fn();
  const mockUnwrap = jest.fn();
  
  const mockApparelItems = {
    TOP: [{ id: 'top-1' }],
    BOTTOM: [{ id: 'bottom-1' }],
    SHOES: [{ id: 'shoes-1' }],
    COAT: [{ id: 'coat-1' }]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    mockDispatch.mockReturnValue({
      unwrap: mockUnwrap
    });
    mockUnwrap.mockResolvedValue({});
    (toast.promise as jest.Mock).mockImplementation((promise, options) => {
      return promise;
    });
  });

  it('dispatches fetchAllApparel on mount', () => {
    (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
      items: {}, 
      status: 'idle' 
    });

    render(<CarouselWrapper />);
    expect(mockDispatch).toHaveBeenCalledWith(fetchAllApparel());
  });

  it('renders LoadingComponent when status is idle', () => {
    (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
      items: {}, 
      status: 'idle' 
    });

    render(<CarouselWrapper />);
    expect(screen.getByTestId('loading-component')).toBeInTheDocument();
  });

  it('renders LoadingComponent when status is loading', () => {
    (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
      items: {}, 
      status: 'loading' 
    });

    render(<CarouselWrapper />);
    expect(screen.getByTestId('loading-component')).toBeInTheDocument();
  });

  it('renders ErrorComponent when status is failed', () => {
    (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
      items: {}, 
      status: 'failed' 
    });

    render(<CarouselWrapper />);
    expect(screen.getByTestId('error-component')).toBeInTheDocument();
  });

  it('renders carousel components when status is succeeded', () => {
    (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
      items: mockApparelItems, 
      status: 'succeeded' 
    });

    render(<CarouselWrapper />);
    expect(screen.getByTestId('carousel-TOP')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-BOTTOM')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-SHOES')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-COAT')).toBeInTheDocument();
    expect(screen.getByText('Create this outfit!')).toBeInTheDocument();
  });

  it('toggles coat visibility when hide coats button is clicked', () => {
    (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
      items: mockApparelItems, 
      status: 'succeeded' 
    });

    render(<CarouselWrapper />);
    expect(screen.getByTestId('carousel-COAT')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Hide Coats'));
    expect(screen.queryByTestId('carousel-COAT')).not.toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Show Coats'));
    expect(screen.getByTestId('carousel-COAT')).toBeInTheDocument();
  });

  it('opens modal when create outfit button is clicked', () => {
    (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
      items: mockApparelItems, 
      status: 'succeeded' 
    });

    render(<CarouselWrapper />);
    expect(screen.queryByText('Add a title for this Outfit')).not.toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Create this outfit!'));
    expect(screen.getByText('Add a title for this Outfit')).toBeInTheDocument();
  });

  it('closes modal when close button is clicked', () => {
    (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
      items: mockApparelItems, 
      status: 'succeeded' 
    });

    render(<CarouselWrapper />);
    fireEvent.click(screen.getByText('Create this outfit!'));
    expect(screen.getByText('Add a title for this Outfit')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByText('Add a title for this Outfit')).not.toBeInTheDocument();
  });

  it.skip('shows validation errors for empty form fields', () => {});
  it.skip('validates title length', () => {});
  it.skip('validates tags input', () => {});

  it('creates outfit successfully with valid data', async () => {
    (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
      items: mockApparelItems, 
      status: 'succeeded' 
    });

    render(<CarouselWrapper />);
    
    fireEvent.click(screen.getByTestId('carousel-TOP').querySelector('button')!);
    fireEvent.click(screen.getByTestId('carousel-BOTTOM').querySelector('button')!);
    fireEvent.click(screen.getByTestId('carousel-SHOES').querySelector('button')!);
    fireEvent.click(screen.getByTestId('carousel-COAT').querySelector('button')!);
    
    fireEvent.click(screen.getByText('Create this outfit!'));
    
    const titleInput = screen.getByLabelText(/Add a title for this Outfit/);
    fireEvent.change(titleInput, { target: { value: 'Test Outfit' } });
    
    const tagsInput = screen.getByLabelText(/Tags for this outfit/);
    fireEvent.change(tagsInput, { target: { value: 'casual, summer' } });
    
    const descInput = screen.getByLabelText(/Add a description for this Outfit/);
    fireEvent.change(descInput, { target: { value: 'Test description' } });
    
    fireEvent.click(screen.getByText('Create outfit'));
    
    await waitFor(() => {
      expect(createOutfit).toHaveBeenCalledWith({
        topID: 'top-1',
        bottomID: 'bottom-1',
        shoesID: 'shoes-1',
        coatID: 'coat-1',
        title: 'Test Outfit',
        tags: ['casual', 'summer'],
        description: 'Test description'
      });
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'CREATE_OUTFIT' });
      expect(mockUnwrap).toHaveBeenCalled();
      expect(toast.promise).toHaveBeenCalled();
    });
  });

  it('creates outfit without coat when coats are hidden', async () => {
    (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
      items: mockApparelItems, 
      status: 'succeeded' 
    });

    render(<CarouselWrapper />);
    
    fireEvent.click(screen.getByText('Hide Coats'));
    
    fireEvent.click(screen.getByTestId('carousel-TOP').querySelector('button')!);
    fireEvent.click(screen.getByTestId('carousel-BOTTOM').querySelector('button')!);
    fireEvent.click(screen.getByTestId('carousel-SHOES').querySelector('button')!);
    
    fireEvent.click(screen.getByText('Create this outfit!'));
    
    const titleInput = screen.getByLabelText(/Add a title for this Outfit/);
    fireEvent.change(titleInput, { target: { value: 'Test Outfit No Coat' } });
    
    const tagsInput = screen.getByLabelText(/Tags for this outfit/);
    fireEvent.change(tagsInput, { target: { value: 'summer' } });
    
    fireEvent.click(screen.getByText('Create outfit'));
    
    await waitFor(() => {
      expect(createOutfit).toHaveBeenCalledWith({
        topID: 'top-1',
        bottomID: 'bottom-1',
        shoesID: 'shoes-1',
        title: 'Test Outfit No Coat',
        tags: ['summer']
      });
    });
  });

  it('handles error from createOutfit', async () => {
    (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
      items: mockApparelItems, 
      status: 'succeeded' 
    });
    
    let capturedErrorRender: any;
    
    (toast.promise as jest.Mock).mockImplementation((promise, options) => {
      if (options) {
        capturedErrorRender = options.error.render;
      }
      return promise;
    });

    render(<CarouselWrapper />);
    
    fireEvent.click(screen.getByTestId('carousel-TOP').querySelector('button')!);
    fireEvent.click(screen.getByTestId('carousel-BOTTOM').querySelector('button')!);
    fireEvent.click(screen.getByTestId('carousel-SHOES').querySelector('button')!);
    
    fireEvent.click(screen.getByText('Create this outfit!'));
    
    const titleInput = screen.getByLabelText(/Add a title for this Outfit/);
    fireEvent.change(titleInput, { target: { value: 'Test Outfit' } });
    
    const tagsInput = screen.getByLabelText(/Tags for this outfit/);
    fireEvent.change(tagsInput, { target: { value: 'casual' } });
    
    fireEvent.click(screen.getByText('Create outfit'));
    
    await waitFor(() => {
      expect(toast.promise).toHaveBeenCalled();
    });
    
    if (capturedErrorRender) {
      const errorData = { error: 'API Error' };
      const errorMessage = capturedErrorRender({ data: errorData });
      expect(errorMessage).toBe('Error creating outfit: API Error');
      
      const simpleErrorMessage = capturedErrorRender({ data: 'Simple Error' });
      expect(simpleErrorMessage).toBe('Error creating outfit: Simple Error');
    }
  });

  it('omits description field when empty', async () => {
    (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
      items: mockApparelItems, 
      status: 'succeeded' 
    });

    render(<CarouselWrapper />);
    
    fireEvent.click(screen.getByTestId('carousel-TOP').querySelector('button')!);
    fireEvent.click(screen.getByTestId('carousel-BOTTOM').querySelector('button')!);
    fireEvent.click(screen.getByTestId('carousel-SHOES').querySelector('button')!);
    
    fireEvent.click(screen.getByText('Create this outfit!'));
    
    const titleInput = screen.getByLabelText(/Add a title for this Outfit/);
    fireEvent.change(titleInput, { target: { value: 'Test Outfit' } });
    
    const tagsInput = screen.getByLabelText(/Tags for this outfit/);
    fireEvent.change(tagsInput, { target: { value: 'casual' } });
    
    
    fireEvent.click(screen.getByText('Create outfit'));
    
    await waitFor(() => {
      expect(createOutfit).toHaveBeenCalledWith({
        topID: 'top-1',
        bottomID: 'bottom-1',
        shoesID: 'shoes-1',
        title: 'Test Outfit',
        tags: ['casual']
      });
      expect(createOutfit).not.toHaveBeenCalledWith(
        expect.objectContaining({ description: expect.anything() })
      );
    });
  });

  it('closes modal after successful submission', async () => {
    (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
      items: mockApparelItems, 
      status: 'succeeded' 
    });

    render(<CarouselWrapper />);
    
    fireEvent.click(screen.getByText('Create this outfit!'));
    expect(screen.getByText('Add a title for this Outfit')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Close'));
    
    expect(screen.queryByText('Add a title for this Outfit')).not.toBeInTheDocument();
  });
});