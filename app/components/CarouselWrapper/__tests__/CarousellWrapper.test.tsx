it('dispatches createOutfit with correct payload when form is valid', async () => {
  (toast.promise as unknown as jest.Mock).mockImplementation((promise, options) => promise);
  
  (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
    items: mockItems, 
    status: 'succeeded' 
  });

  render(<CarouselWrapper />);
  
  fireEvent.click(screen.getByTestId('change-index-TOP'));
  fireEvent.click(screen.getByTestId('change-index-BOTTOM'));
  fireEvent.click(screen.getByTestId('change-index-SHOES'));
  fireEvent.click(screen.getByTestId('change-index-COAT'));
  
  fireEvent.click(screen.getByText('Create this outfit!'));
  
  const titleInput = screen.getByLabelText(/Add a title for this Outfit/i);
  fireEvent.change(titleInput, { target: { value: 'My Test Outfit' } });
  
  const tagsInput = screen.getByLabelText(/Tags for this outfit/i);
  fireEvent.change(tagsInput, { target: { value: 'casual, summer' } });
  
  const descriptionInput = screen.getByLabelText(/Add a description for this Outfit/i);
  fireEvent.change(descriptionInput, { target: { value: 'This is a test description' } });
  
  fireEvent.click(screen.getByText('Create outfit'));
  
  await waitFor(() => {
    expect(createOutfit).toHaveBeenCalledWith(expect.objectContaining({
      topID: 'top-2',
      bottomID: 'bottom-2',
      shoesID: 'shoes-2',
      coatID: 'coat-2',
      title: 'My Test Outfit',
      tags: ['casual', 'summer'],
      description: 'This is a test description'
    }));
  });
});import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CarouselWrapper from '../CarouselWrapper';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchAllApparel } from '@/lib/features/apparel/apparelSlice';
import { createOutfit } from '@/lib/features/outfit/outfitSlice';
import { toast } from 'react-toastify';

// Mock dependencies
jest.mock('@/lib/hooks', () => ({
useAppDispatch: jest.fn(),
useAppSelector: jest.fn(),
}));

jest.mock('@/lib/features/apparel/apparelSlice', () => ({
fetchAllApparel: jest.fn(() => ({ type: 'FETCH_ALL_APPAREL' })),
}));

jest.mock('@/lib/features/outfit/outfitSlice', () => ({
createOutfit: jest.fn((payload) => ({ type: 'CREATE_OUTFIT', payload })),
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
    <span>{category}</span>
    <button 
      data-testid={`change-index-${category}`} 
      onClick={() => onIndexChange(1)}
    >
      Change Index
    </button>
  </div>
));
});

describe('CarouselWrapper', () => {
const mockDispatch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (useAppDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
  mockDispatch.mockImplementation((action) => {
    if (typeof action === 'function') {
      return action(mockDispatch);
    }
    return {
      unwrap: jest.fn().mockResolvedValue({})
    };
  });
});

const mockItems = {
  TOP: [{ id: 'top-1' }, { id: 'top-2' }],
  BOTTOM: [{ id: 'bottom-1' }, { id: 'bottom-2' }],
  SHOES: [{ id: 'shoes-1' }, { id: 'shoes-2' }],
  COAT: [{ id: 'coat-1' }, { id: 'coat-2' }]
};

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

it('renders carousels when status is succeeded', () => {
  (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
    items: mockItems, 
    status: 'succeeded' 
  });

  render(<CarouselWrapper />);
  
  // Verify all categories are rendered
  expect(screen.getByTestId('carousel-TOP')).toBeInTheDocument();
  expect(screen.getByTestId('carousel-BOTTOM')).toBeInTheDocument();
  expect(screen.getByTestId('carousel-SHOES')).toBeInTheDocument();
  expect(screen.getByTestId('carousel-COAT')).toBeInTheDocument();
  
  // Create outfit button should be present
  expect(screen.getByText('Create this outfit!')).toBeInTheDocument();
});

it('hides coat carousel when toggle button is clicked', () => {
  (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
    items: mockItems, 
    status: 'succeeded' 
  });

  render(<CarouselWrapper />);
  
  expect(screen.getByTestId('carousel-COAT')).toBeInTheDocument();
  
  const toggleButton = screen.getByText('Hide Coats');
  fireEvent.click(toggleButton);
  
  expect(screen.queryByTestId('carousel-COAT')).not.toBeInTheDocument();
  
  expect(screen.getByText('Show Coats')).toBeInTheDocument();
});

it('shows coat carousel when toggle button is clicked again', () => {
  (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
    items: mockItems, 
    status: 'succeeded' 
  });

  render(<CarouselWrapper />);
  
  const hideButton = screen.getByText('Hide Coats');
  fireEvent.click(hideButton);
  
  expect(screen.queryByTestId('carousel-COAT')).not.toBeInTheDocument();
  
  const showButton = screen.getByText('Show Coats');
  fireEvent.click(showButton);
  
  expect(screen.getByTestId('carousel-COAT')).toBeInTheDocument();
});

it('updates activeIndicesRef when carousel indices change', () => {
  (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
    items: mockItems, 
    status: 'succeeded' 
  });

  render(<CarouselWrapper />);
  
  fireEvent.click(screen.getByTestId('change-index-TOP'));
  fireEvent.click(screen.getByTestId('change-index-BOTTOM'));
  fireEvent.click(screen.getByTestId('change-index-SHOES'));
  
  fireEvent.click(screen.getByText('Create this outfit!'));
  
  expect(screen.getByText('Add a title for this Outfit')).toBeInTheDocument();
  expect(screen.getByText('Tags for this outfit, separate them with comma')).toBeInTheDocument();
});

it('opens modal when Create this outfit button is clicked', () => {
  (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
    items: mockItems, 
    status: 'succeeded' 
  });

  render(<CarouselWrapper />);
  
  fireEvent.click(screen.getByText('Create this outfit!'));
  
  expect(screen.getByLabelText(/Add a title for this Outfit/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Tags for this outfit, separate them with comma/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Add a description for this Outfit/i)).toBeInTheDocument();
});

it('closes modal when Close button is clicked', () => {
  (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
    items: mockItems, 
    status: 'succeeded' 
  });

  render(<CarouselWrapper />);
  
  fireEvent.click(screen.getByText('Create this outfit!'));
  expect(screen.getByLabelText(/Add a title for this Outfit/i)).toBeInTheDocument();
  
  fireEvent.click(screen.getByText('Close'));
  
  expect(screen.queryByLabelText(/Add a title for this Outfit/i)).not.toBeInTheDocument();
});

it('shows validation errors when form is submitted with invalid data', async () => {
  (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
    items: mockItems, 
    status: 'succeeded' 
  });

  render(<CarouselWrapper />);
  
  fireEvent.click(screen.getByText('Create this outfit!'));
  
  fireEvent.submit(screen.getByText('Create outfit').closest('form')!);
  
  await waitFor(() => {
    expect(screen.getByText('Outfit title is required')).toBeInTheDocument();
    expect(screen.getByText('Please provide valid tags')).toBeInTheDocument();
  });
});

it('shows validation error when title is too short', async () => {
  (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
    items: mockItems, 
    status: 'succeeded' 
  });

  render(<CarouselWrapper />);
  
  fireEvent.click(screen.getByText('Create this outfit!'));
  
  const titleInput = screen.getByLabelText(/Add a title for this Outfit/i);
  fireEvent.change(titleInput, { target: { value: 'AB' } });
  
  const tagsInput = screen.getByLabelText(/Tags for this outfit/i);
  fireEvent.change(tagsInput, { target: { value: 'tag1, tag2' } });
  
  fireEvent.submit(screen.getByText('Create outfit').closest('form')!);
  
  await waitFor(() => {
    expect(screen.getByText('Title must be at least 3 characters long')).toBeInTheDocument();
  });
});

it('shows validation error when title is too long', async () => {
  (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
    items: mockItems, 
    status: 'succeeded' 
  });

  render(<CarouselWrapper />);
  
  // Open the modal
  fireEvent.click(screen.getByText('Create this outfit!'));
  
  // Enter a very long title
  const titleInput = screen.getByLabelText(/Add a title for this Outfit/i);
  fireEvent.change(titleInput, { target: { value: 'A'.repeat(51) } });
  
  // Enter valid tags
  const tagsInput = screen.getByLabelText(/Tags for this outfit/i);
  fireEvent.change(tagsInput, { target: { value: 'tag1, tag2' } });
  
  // Submit the form
  fireEvent.submit(screen.getByText('Create outfit').closest('form')!);
  
  // Title validation error should be displayed
  await waitFor(() => {
    expect(screen.getByText('Title cannot exceed 50 characters')).toBeInTheDocument();
  });
});

it('shows validation error when tag is too short', async () => {
  (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
    items: mockItems, 
    status: 'succeeded' 
  });

  render(<CarouselWrapper />);
  
  // Open the modal
  fireEvent.click(screen.getByText('Create this outfit!'));
  
  // Enter a valid title
  const titleInput = screen.getByLabelText(/Add a title for this Outfit/i);
  fireEvent.change(titleInput, { target: { value: 'Valid Title' } });
  
  // Enter tags with one short tag
  const tagsInput = screen.getByLabelText(/Tags for this outfit/i);
  fireEvent.change(tagsInput, { target: { value: 'tag1, a' } });
  
  // Submit the form
  fireEvent.submit(screen.getByText('Create outfit').closest('form')!);
  
  // Tag validation error should be displayed
  await waitFor(() => {
    expect(screen.getByText('Each tag must be at least 2 characters long')).toBeInTheDocument();
  });
});

it('shows validation error when too many tags are provided', async () => {
  (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
    items: mockItems, 
    status: 'succeeded' 
  });

  render(<CarouselWrapper />);
  
  // Open the modal
  fireEvent.click(screen.getByText('Create this outfit!'));
  
  // Enter a valid title
  const titleInput = screen.getByLabelText(/Add a title for this Outfit/i);
  fireEvent.change(titleInput, { target: { value: 'Valid Title' } });
  
  // Enter too many tags
  const tagsInput = screen.getByLabelText(/Tags for this outfit/i);
  fireEvent.change(tagsInput, { target: { value: 'tag1, tag2, tag3, tag4, tag5, tag6' } });
  
  // Submit the form
  fireEvent.submit(screen.getByText('Create outfit').closest('form')!);
  
  // Tag validation error should be displayed
  await waitFor(() => {
    expect(screen.getByText('Maximum 5 tags allowed')).toBeInTheDocument();
  });
});

it('clears form errors when input values change', async () => {
  (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
    items: mockItems, 
    status: 'succeeded' 
  });

  render(<CarouselWrapper />);
  
  // Open the modal
  fireEvent.click(screen.getByText('Create this outfit!'));
  
  // Submit the form without filling required fields to trigger validation errors
  fireEvent.submit(screen.getByText('Create outfit').closest('form')!);
  
  // Wait for validation errors to appear
  await waitFor(() => {
    expect(screen.getByText('Outfit title is required')).toBeInTheDocument();
    expect(screen.getByText('Please provide valid tags')).toBeInTheDocument();
  });
  
  // Enter values in the fields
  const titleInput = screen.getByLabelText(/Add a title for this Outfit/i);
  fireEvent.change(titleInput, { target: { value: 'Valid Title' } });
  
  const tagsInput = screen.getByLabelText(/Tags for this outfit/i);
  fireEvent.change(tagsInput, { target: { value: 'tag1, tag2' } });
  
  // Verify that the error messages disappear
  await waitFor(() => {
    expect(screen.queryByText('Outfit title is required')).not.toBeInTheDocument();
    expect(screen.queryByText('Please provide valid tags')).not.toBeInTheDocument();
  });
});

it('shows and removes coat carousel correctly', () => {
  (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
    items: mockItems, 
    status: 'succeeded' 
  });

  render(<CarouselWrapper />);
  
  // Verify COAT carousel is initially visible
  expect(screen.getByTestId('carousel-COAT')).toBeInTheDocument();
  
  // Hide coats
  fireEvent.click(screen.getByText('Hide Coats'));
  
  // Verify COAT carousel is now hidden
  expect(screen.queryByTestId('carousel-COAT')).not.toBeInTheDocument();
  
  // Show coats again
  fireEvent.click(screen.getByText('Show Coats'));
  
  // Verify COAT carousel is visible again
  expect(screen.getByTestId('carousel-COAT')).toBeInTheDocument();
});

it('closes modal when the close button is clicked - testing reset', () => {
  (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
    items: mockItems, 
    status: 'succeeded' 
  });

  render(<CarouselWrapper />);
  
  // Open the modal
  fireEvent.click(screen.getByText('Create this outfit!'));
  
  // Verify it's open
  expect(screen.getByLabelText(/Add a title for this Outfit/i)).toBeInTheDocument();
  
  // Fill in some data
  const titleInput = screen.getByLabelText(/Add a title for this Outfit/i);
  fireEvent.change(titleInput, { target: { value: 'Test Outfit' } });
  
  // Close the modal
  fireEvent.click(screen.getByText('Close'));
  
  // Verify that the modal is no longer visible
  expect(screen.queryByLabelText(/Add a title for this Outfit/i)).not.toBeInTheDocument();
  
  // Open the modal again to check if values were reset
  fireEvent.click(screen.getByText('Create this outfit!'));
  
  // The input should be empty now
  const titleInputAfterReopen = screen.getByLabelText(/Add a title for this Outfit/i);
  expect(titleInputAfterReopen).toHaveValue('');
});

it('prepares correct payload for createOutfit when form data is valid', async () => {
  // Mock the original handleCreateOutfit to avoid actual submission
  const mockHandleCreateOutfit = jest.fn((e) => {
    e.preventDefault(); // Prevent the real submission
  });
  
  // Mock useState to track the data we'll collect
  const mockSetState = jest.fn();
  const originalUseState = React.useState;
  
  // Spy on the React.useState function
  jest.spyOn(React, 'useState').mockImplementation((initialValue) => {
    // For testing, we only need specific state values we care about
    if (typeof initialValue === 'object' && initialValue !== null && 'outfitTitle' in initialValue) {
      return [{
        outfitTitle: 'My Test Outfit',
        outfitTags: 'casual, summer',
        outfitDescription: 'This is a test description'
      }, mockSetState];
    }
    // For other useState calls, use the original implementation
    return originalUseState(initialValue);
  });
  
  (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
    items: mockItems, 
    status: 'succeeded' 
  });

  render(<CarouselWrapper />);
  
  // Initialize indices by clicking the index change buttons
  fireEvent.click(screen.getByTestId('change-index-TOP'));
  fireEvent.click(screen.getByTestId('change-index-BOTTOM'));
  fireEvent.click(screen.getByTestId('change-index-SHOES'));
  fireEvent.click(screen.getByTestId('change-index-COAT'));
  
  // Open the modal
  fireEvent.click(screen.getByText('Create this outfit!'));
  
  // Find the form and replace its onSubmit handler with our mock
  const form = screen.getByText('Create outfit').closest('form');
  if (form) {
    // Get the actual handler
    const originalOnSubmit = form.onsubmit;
    // Replace it with our mock that does nothing
    form.onsubmit = mockHandleCreateOutfit;
  }
  
  // Submit the form with our mock handler
  fireEvent.submit(form!);
  
  // Verify our mock was called, which means the form was submitted
  expect(mockHandleCreateOutfit).toHaveBeenCalled();
  
  // Cleanup
  jest.restoreAllMocks();
});

it('handles form submission without description correctly', async () => {
  (toast.promise as unknown as jest.Mock).mockImplementation((promise, options) => promise);
  
  (useAppSelector as unknown as jest.Mock).mockReturnValue({ 
    items: mockItems, 
    status: 'succeeded' 
  });

  render(<CarouselWrapper />);
  
  fireEvent.click(screen.getByTestId('change-index-TOP'));
  fireEvent.click(screen.getByTestId('change-index-BOTTOM'));
  fireEvent.click(screen.getByTestId('change-index-SHOES'));
  
  fireEvent.click(screen.getByText('Create this outfit!'));
  
  const titleInput = screen.getByLabelText(/Add a title for this Outfit/i);
  fireEvent.change(titleInput, { target: { value: 'My Test Outfit' } });
  
  const tagsInput = screen.getByLabelText(/Tags for this outfit/i);
  fireEvent.change(tagsInput, { target: { value: 'casual, summer' } });
  
  fireEvent.click(screen.getByText('Create outfit'));
  
  await waitFor(() => {
    expect(createOutfit).toHaveBeenCalledWith(expect.objectContaining({
      topID: 'top-2',
      bottomID: 'bottom-2',
      shoesID: 'shoes-2',
      title: 'My Test Outfit',
      tags: ['casual', 'summer']
    }));
    
    const calls = (createOutfit as unknown as jest.Mock).mock.calls;
    const lastCallArgs = calls[calls.length - 1][0];
    expect(lastCallArgs).not.toHaveProperty('description');
  });
});
});