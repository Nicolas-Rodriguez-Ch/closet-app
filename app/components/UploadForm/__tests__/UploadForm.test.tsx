import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UploadForm from '../UploadForm';
import { orchestrateApparelSubmit } from '../utils/submitHelper';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

jest.mock('../utils/submitHelper', () => ({
  orchestrateApparelSubmit: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    promise: jest.fn(),
  },
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

global.URL.createObjectURL = jest.fn(() => 'mocked-url');
global.URL.revokeObjectURL = jest.fn();

describe('UploadForm', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  test('renders form elements correctly', () => {
    render(<UploadForm />);

    expect(screen.getByText(/Add New Apparel/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Upload Apparel Image/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Apparel Item Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Apparel Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Apparel Type/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  test('displays validation errors when form submitted without required fields', async () => {
    render(<UploadForm />);

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/Please select an image/i)).toBeInTheDocument();
      expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
    });
  });

  test('handles image file too large', async () => {
    render(<UploadForm />);

    const largeFile = new File(
      ['x'.repeat(11 * 1024 * 1024)],
      'large-image.jpg',
      { type: 'image/jpeg' }
    );

    const input = screen.getByLabelText(/Upload Apparel Image/i);
    fireEvent.change(input, { target: { files: [largeFile] } });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Image size must be less than 10MB'
      );
    });
  });

  test('successfully submits form with valid data', async () => {
    render(<UploadForm />);

    (orchestrateApparelSubmit as jest.Mock).mockResolvedValue({
      success: true,
    });
    (toast.promise as jest.Mock).mockImplementation((promise) => promise);

    const file = new File(['test image content'], 'test-image.jpg', {
      type: 'image/jpeg',
    });
    const fileInput = screen.getByLabelText(/Upload Apparel Image/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    const titleInput = screen.getByLabelText(/Apparel Item Title/i);
    fireEvent.change(titleInput, { target: { value: 'Test Apparel' } });

    const descriptionInput = screen.getByLabelText(/Apparel Description/i);
    fireEvent.change(descriptionInput, {
      target: { value: 'Test Description' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(orchestrateApparelSubmit).toHaveBeenCalledWith(
        file,
        expect.objectContaining({
          apparelTitle: 'Test Apparel',
          apparelDescription: 'Test Description',
          apparelType: expect.any(String),
        })
      );

      expect(toast.promise).toHaveBeenCalled();

      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  test('handles form submission error', async () => {
    render(<UploadForm />);

    const errorMessage = 'Test error message';
    (orchestrateApparelSubmit as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );
    (toast.promise as jest.Mock).mockImplementation((promise) => promise);

    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByLabelText(/Upload Apparel Image/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    const titleInput = screen.getByLabelText(/Apparel Item Title/i);
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'An unexpected error occurred. Please try again.'
      );
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  test('disables form fields during submission', async () => {
    render(<UploadForm />);

    let resolvePromise: (value: unknown) => void;
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    (orchestrateApparelSubmit as jest.Mock).mockReturnValue(pendingPromise);
    (toast.promise as jest.Mock).mockImplementation((promise) => promise);

    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByLabelText(/Upload Apparel Image/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    const titleInput = screen.getByLabelText(/Apparel Item Title/i);
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/Upload Apparel Image/i)).toBeDisabled();
      expect(screen.getByLabelText(/Apparel Item Title/i)).toBeDisabled();
      expect(screen.getByLabelText(/Apparel Description/i)).toBeDisabled();
      expect(screen.getByLabelText(/Apparel Type/i)).toBeDisabled();
      expect(
        screen.getByRole('button', { name: /Uploading.../i })
      ).toBeDisabled();
    });

    resolvePromise!({});
  });

  test('clears form after successful submission', async () => {
    render(<UploadForm />);

    (orchestrateApparelSubmit as jest.Mock).mockResolvedValue({
      success: true,
    });
    (toast.promise as jest.Mock).mockImplementation((promise) => promise);

    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByLabelText(
      /Upload Apparel Image/i
    ) as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });

    const titleInput = screen.getByLabelText(
      /Apparel Item Title/i
    ) as HTMLInputElement;
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });

    const descriptionInput = screen.getByLabelText(
      /Apparel Description/i
    ) as HTMLInputElement;
    fireEvent.change(descriptionInput, {
      target: { value: 'Test Description' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(titleInput.value).toBe('');
      expect(descriptionInput.value).toBe('');
      expect(URL.revokeObjectURL).toHaveBeenCalled();
    });
  });

  test('clears validation errors when user corrects input', async () => {
    render(<UploadForm />);

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText(/Apparel Item Title/i);
    fireEvent.change(titleInput, { target: { value: 'New Title' } });

    await waitFor(() => {
      expect(screen.queryByText(/Title is required/i)).not.toBeInTheDocument();
    });
  });

  test('handles apparel type selection', async () => {
    render(<UploadForm />);

    const select = screen.getByLabelText(/Apparel Type/i);
    fireEvent.change(select, { target: { value: 'BOTTOM' } });

    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByLabelText(/Upload Apparel Image/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    const titleInput = screen.getByLabelText(/Apparel Item Title/i);
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(orchestrateApparelSubmit).toHaveBeenCalledWith(
        file,
        expect.objectContaining({
          apparelType: 'BOTTOM',
        })
      );
    });
  });

  test('clears file input and revokes object URL when selecting new file', async () => {
    render(<UploadForm />);

    const file1 = new File(['test content 1'], 'test1.jpg', {
      type: 'image/jpeg',
    });
    const fileInput = screen.getByLabelText(/Upload Apparel Image/i);
    fireEvent.change(fileInput, { target: { files: [file1] } });

    expect(URL.createObjectURL).toHaveBeenCalledWith(file1);

    const file2 = new File(['test content 2'], 'test2.jpg', {
      type: 'image/jpeg',
    });
    fireEvent.change(fileInput, { target: { files: [file2] } });

    expect(URL.revokeObjectURL).toHaveBeenCalled();
    expect(URL.createObjectURL).toHaveBeenCalledWith(file2);
  });

  test('handles null file selection', async () => {
    render(<UploadForm />);

    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByLabelText(/Upload Apparel Image/i);
    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.change(fileInput, { target: { files: [] } });
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/Please select an image/i)).toBeInTheDocument();
    });
  });

  test('renders correct error message from toast.promise error handler', async () => {
    render(<UploadForm />);

    const errorResponse = { error: 'Custom error message' };
    (orchestrateApparelSubmit as jest.Mock).mockRejectedValue(errorResponse);
    let capturedErrorRender: any;
    (toast.promise as jest.Mock).mockImplementation((promise, options) => {
      capturedErrorRender = options.error.render;
      return promise;
    });

    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByLabelText(/Upload Apparel Image/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    const titleInput = screen.getByLabelText(/Apparel Item Title/i);
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(toast.promise).toHaveBeenCalled();
    });

    const errorMessage = capturedErrorRender({ data: errorResponse });
    expect(errorMessage).toBe(
      'Error uploading apparel item: Custom error message'
    );
  });

  test('clears image validation error when selecting a valid file', async () => {
    render(<UploadForm />);

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
    await waitFor(() => {
      expect(screen.getByText(/Please select an image/i)).toBeInTheDocument();
    });

    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByLabelText(/Upload Apparel Image/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(
        screen.queryByText(/Please select an image/i)
      ).not.toBeInTheDocument();
    });
  });
});
