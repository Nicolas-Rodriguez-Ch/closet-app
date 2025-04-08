import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CarouselWrapper from '../CarouselWrapper';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
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
    (toast.promise as jest.Mock).mockImplementation((promise) => {
      return promise;
    });
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
    expect(screen.getByText('Save this outfit')).toBeInTheDocument();
  });

  it('toggles coat visibility when hide coats button is clicked', () => {
    (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
      items: mockApparelItems, 
      status: 'succeeded' 
    });

    render(<CarouselWrapper />);
    expect(screen.getByTestId('carousel-COAT')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText("I don't need a coat"));
    expect(screen.queryByTestId('carousel-COAT')).not.toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Add a coat'));
    expect(screen.getByTestId('carousel-COAT')).toBeInTheDocument();
  });

  it('opens modal when save outfit button is clicked', () => {
    (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
      items: mockApparelItems, 
      status: 'succeeded' 
    });

    render(<CarouselWrapper />);
    expect(screen.queryByText('Give your outfit a name')).not.toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Save this outfit'));
    expect(screen.getByText('Give your outfit a name')).toBeInTheDocument();
  });

  it('closes modal when cancel button is clicked', () => {
    (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
      items: mockApparelItems, 
      status: 'succeeded' 
    });

    render(<CarouselWrapper />);
    fireEvent.click(screen.getByText('Save this outfit'));
    expect(screen.getByText('Give your outfit a name')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Give your outfit a name')).not.toBeInTheDocument();
  });

  it('validates form and prevents API call when fields are invalid', () => {
    (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
      items: mockApparelItems, 
      status: 'succeeded' 
    });

    render(<CarouselWrapper />);
    fireEvent.click(screen.getByText('Save this outfit'));
    
    fireEvent.click(screen.getByText('Save outfit'));
    
    expect(createOutfit).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalledWith({ type: 'CREATE_OUTFIT' });
  });

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
    
    fireEvent.click(screen.getByText('Save this outfit'));
    
    const titleInput = screen.getByLabelText(/Give your outfit a name/);
    fireEvent.change(titleInput, { target: { value: 'Test Outfit' } });
    
    const tagsInput = screen.getByLabelText(/Add tags \(separated by commas\)/);
    fireEvent.change(tagsInput, { target: { value: 'casual, summer' } });
    
    const descInput = screen.getByLabelText(/Add a note \(optional\)/);
    fireEvent.change(descInput, { target: { value: 'Test description' } });
    
    fireEvent.click(screen.getByText('Save outfit'));
    
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
    
    fireEvent.click(screen.getByText("I don't need a coat"));
    
    fireEvent.click(screen.getByTestId('carousel-TOP').querySelector('button')!);
    fireEvent.click(screen.getByTestId('carousel-BOTTOM').querySelector('button')!);
    fireEvent.click(screen.getByTestId('carousel-SHOES').querySelector('button')!);
    
    fireEvent.click(screen.getByText('Save this outfit'));
    
    const titleInput = screen.getByLabelText(/Give your outfit a name/);
    fireEvent.change(titleInput, { target: { value: 'Test Outfit No Coat' } });
    
    const tagsInput = screen.getByLabelText(/Add tags \(separated by commas\)/);
    fireEvent.change(tagsInput, { target: { value: 'summer' } });
    
    fireEvent.click(screen.getByText('Save outfit'));
    
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
    
    fireEvent.click(screen.getByText('Save this outfit'));
    
    const titleInput = screen.getByLabelText(/Give your outfit a name/);
    fireEvent.change(titleInput, { target: { value: 'Test Outfit' } });
    
    const tagsInput = screen.getByLabelText(/Add tags \(separated by commas\)/);
    fireEvent.change(tagsInput, { target: { value: 'casual' } });
    
    fireEvent.click(screen.getByText('Save outfit'));
    
    await waitFor(() => {
      expect(toast.promise).toHaveBeenCalled();
    });
    
    if (capturedErrorRender) {
      const errorData = { error: 'API Error' };
      const errorMessage = capturedErrorRender({ data: errorData });
      expect(errorMessage).toBe('Couldn\'t save your outfit: API Error');
      
      const simpleErrorMessage = capturedErrorRender({ data: 'Simple Error' });
      expect(simpleErrorMessage).toBe('Couldn\'t save your outfit: Simple Error');
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
    
    fireEvent.click(screen.getByText('Save this outfit'));
    
    const titleInput = screen.getByLabelText(/Give your outfit a name/);
    fireEvent.change(titleInput, { target: { value: 'Test Outfit' } });
    
    const tagsInput = screen.getByLabelText(/Add tags \(separated by commas\)/);
    fireEvent.change(tagsInput, { target: { value: 'casual' } });
    
    fireEvent.click(screen.getByText('Save outfit'));
    
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
  
  it('validates input field based on logic, not just required attribute', async () => {
    (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
      items: mockApparelItems, 
      status: 'succeeded' 
    });

    render(<CarouselWrapper />);
    fireEvent.click(screen.getByText('Save this outfit'));
    
    const titleInput = screen.getByLabelText(/Give your outfit a name/);
    const tagsInput = screen.getByLabelText(/Add tags \(separated by commas\)/);
    
    fireEvent.change(titleInput, { target: { value: 'ab' } });
    fireEvent.change(tagsInput, { target: { value: 'valid-tag' } });
    fireEvent.click(screen.getByText('Save outfit'));
    expect(createOutfit).not.toHaveBeenCalled();
    
    fireEvent.change(titleInput, { target: { value: 'a'.repeat(51) } });
    fireEvent.click(screen.getByText('Save outfit'));
    expect(createOutfit).not.toHaveBeenCalled();
    
    fireEvent.change(titleInput, { target: { value: 'Valid Title' } });
    fireEvent.change(tagsInput, { target: { value: 'a' } });
    fireEvent.click(screen.getByText('Save outfit'));
    expect(createOutfit).not.toHaveBeenCalled();
    
    fireEvent.change(tagsInput, { target: { value: 'tag1, tag2, tag3, tag4, tag5, tag6' } });
    fireEvent.click(screen.getByText('Save outfit'));
    expect(createOutfit).not.toHaveBeenCalled();
    
    fireEvent.change(titleInput, { target: { value: 'Valid Title' } });
    fireEvent.change(tagsInput, { target: { value: 'tag1, tag2' } });
    
    fireEvent.click(screen.getByTestId('carousel-TOP').querySelector('button')!);
    fireEvent.click(screen.getByTestId('carousel-BOTTOM').querySelector('button')!);
    fireEvent.click(screen.getByTestId('carousel-SHOES').querySelector('button')!);
    
    fireEvent.click(screen.getByText('Save outfit'));
    
    await waitFor(() => {
      expect(createOutfit).toHaveBeenCalled();
    });
  });
  
  it('validates title required (specifically tests this condition)', () => {
    (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
      items: mockApparelItems, 
      status: 'succeeded' 
    });

    render(<CarouselWrapper />);
    fireEvent.click(screen.getByText('Save this outfit'));
    
    const titleInput = screen.getByLabelText(/Give your outfit a name/);
    fireEvent.change(titleInput, { target: { value: '   ' } });
    
    const tagsInput = screen.getByLabelText(/Add tags \(separated by commas\)/);
    fireEvent.change(tagsInput, { target: { value: 'valid-tag' } });
    
    fireEvent.click(screen.getByText('Save outfit'));
    
    expect(createOutfit).not.toHaveBeenCalled();
  });
  
  it('validates empty tags array (specifically tests tags.length === 0)', () => {
    (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
      items: mockApparelItems, 
      status: 'succeeded' 
    });

    render(<CarouselWrapper />);
    fireEvent.click(screen.getByText('Save this outfit'));
    
    const titleInput = screen.getByLabelText(/Give your outfit a name/);
    fireEvent.change(titleInput, { target: { value: 'Valid Title' } });
    const tagsInput = screen.getByLabelText(/Add tags \(separated by commas\)/);
    fireEvent.change(tagsInput, { target: { value: ' , , ' } });
    
    fireEvent.click(screen.getByText('Save outfit'));
    
    expect(createOutfit).not.toHaveBeenCalled();
  });

  it('closes modal after successful submission', async () => {
    (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
      items: mockApparelItems, 
      status: 'succeeded' 
    });

    render(<CarouselWrapper />);
    
    fireEvent.click(screen.getByText('Save this outfit'));
    expect(screen.getByText('Give your outfit a name')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Cancel'));
    
    expect(screen.queryByText('Give your outfit a name')).not.toBeInTheDocument();
  });
});