import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import IndividualOutfitPage from '../page';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
  deleteOutfit,
  fetchAllOutfits,
} from '@/lib/features/outfit/outfitSlice';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { IOutfit } from '@/lib/types';

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    promise: jest.fn(),
  },
}));

jest.mock('@/lib/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock('@/lib/features/outfit/outfitSlice', () => ({
  fetchAllOutfits: jest.fn(),
  deleteOutfit: jest.fn(),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img src={props.src} alt={props.alt} data-testid='mock-image' />;
  },
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} data-testid='mock-link'>
      {children}
    </a>
  ),
}));

describe('IndividualOutfitPage', () => {
  const mockPush = jest.fn();
  const mockDispatch = jest.fn();
  const mockUnwrap = jest.fn().mockResolvedValue({});
  const mockOutfitId = 'test-outfit-123';

  const mockOutfit: IOutfit = {
    id: mockOutfitId,
    title: 'Test Outfit',
    description: 'This is a test outfit',
    tags: ['casual', 'summer'],
    topID: {
      id: 'top-1',
      title: 'Test Top',
      pictureURL: '/test-top.jpg',
      type: 'TOP' as any,
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
    },
    bottomID: {
      id: 'bottom-1',
      title: 'Test Bottom',
      pictureURL: '/test-bottom.jpg',
      type: 'BOTTOM' as any,
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
    },
    shoesID: {
      id: 'shoes-1',
      title: 'Test Shoes',
      pictureURL: '/test-shoes.jpg',
      type: 'SHOES' as any,
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
    },
    coatID: {
      id: 'coat-1',
      title: 'Test Coat',
      pictureURL: '/test-coat.jpg',
      type: 'COAT' as any,
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
    },
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  };

  const mockOutfitNoCoat = {
    ...mockOutfit,
    coatID: undefined,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useParams as unknown as jest.Mock).mockReturnValue({
      outfitsId: mockOutfitId,
    });
    (useRouter as unknown as jest.Mock).mockReturnValue({ push: mockPush });
    (useAppDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (mockDispatch as jest.Mock).mockReturnValue({ unwrap: mockUnwrap });
    (deleteOutfit as unknown as jest.Mock).mockReturnValue({
      type: 'outfit/delete',
    });
    (fetchAllOutfits as unknown as jest.Mock).mockReturnValue({
      type: 'outfit/fetchAll',
    });
    (toast.promise as unknown as jest.Mock).mockImplementation(
      (promise) => promise
    );

    window.confirm = jest.fn();
  });

  it('dispatches fetchAllOutfits when status is idle', () => {
    (useAppSelector as unknown as jest.Mock).mockReturnValue({
      items: [],
      status: 'idle',
    });

    render(<IndividualOutfitPage />);

    expect(mockDispatch).toHaveBeenCalledWith(fetchAllOutfits());
  });

  it('dispatches fetchAllOutfits when status is succeeded but items array is empty', () => {
    (useAppSelector as unknown as jest.Mock).mockImplementationOnce(() => {
      return {
        items: [],
        status: 'succeeded',
      };
    });

    (useAppSelector as unknown as jest.Mock).mockImplementationOnce(() => {
      return null;
    });

    render(<IndividualOutfitPage />);

    expect(mockDispatch).toHaveBeenCalledWith(fetchAllOutfits());
  });
  it('shows loading component when status is idle', () => {
    (useAppSelector as unknown as jest.Mock).mockImplementation(() => {
      return {
        items: [],
        status: 'idle',
      };
    });

    render(<IndividualOutfitPage />);

    expect(screen.getByText('Loading, please wait')).toBeInTheDocument();
  });

  it('shows loading component when status is loading', () => {
    (useAppSelector as unknown as jest.Mock).mockImplementation(() => {
      return {
        items: [],
        status: 'loading',
      };
    });

    render(<IndividualOutfitPage />);

    expect(screen.getByText('Loading, please wait')).toBeInTheDocument();
  });

  it('shows error component when status is failed', () => {
    (useAppSelector as unknown as jest.Mock).mockImplementation(() => {
      return {
        items: [],
        status: 'failed',
      };
    });

    render(<IndividualOutfitPage />);

    expect(
      screen.getByText('Error getting the information, please try again later')
    ).toBeInTheDocument();
  });

  it('shows not found message when status is succeeded but outfit is not found', () => {
    (useAppSelector as unknown as jest.Mock).mockImplementation((selector) => {
      if (selector.toString().includes('find')) {
        return null;
      }
      return {
        items: [{ id: 'different-id' }],
        status: 'succeeded',
      };
    });

    render(<IndividualOutfitPage />);

    expect(screen.getByText('Outfit Not Found')).toBeInTheDocument();
    expect(
      screen.getByText(
        'The outfit you are looking for does not exist or has been removed.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Return to Outfits')).toBeInTheDocument();
  });

  it('displays outfit details when outfit is found', () => {
    (useAppSelector as unknown as jest.Mock).mockImplementation((selector) => {
      if (selector.toString().includes('find')) {
        return mockOutfit;
      }
      return {
        items: [mockOutfit],
        status: 'succeeded',
      };
    });

    render(<IndividualOutfitPage />);

    expect(screen.getByText('Test Outfit')).toBeInTheDocument();
    expect(screen.getByText('This is a test outfit')).toBeInTheDocument();

    expect(screen.getByText('casual')).toBeInTheDocument();
    expect(screen.getByText('summer')).toBeInTheDocument();

    expect(screen.getByText('Top')).toBeInTheDocument();
    expect(screen.getByText('Bottom')).toBeInTheDocument();
    expect(screen.getByText('Shoes')).toBeInTheDocument();
    expect(screen.getByText('Coat')).toBeInTheDocument();

    expect(screen.getByText('Test Top')).toBeInTheDocument();
    expect(screen.getByText('Test Bottom')).toBeInTheDocument();
    expect(screen.getByText('Test Shoes')).toBeInTheDocument();
    expect(screen.getByText('Test Coat')).toBeInTheDocument();

    expect(screen.getByText('Delete outfit')).toBeInTheDocument();
    expect(screen.getByText('Back to Outfits')).toBeInTheDocument();
  });

  it('displays outfit without coat when coatID is not present', () => {
    (useAppSelector as unknown as jest.Mock).mockImplementation((selector) => {
      if (selector.toString().includes('find')) {
        return mockOutfitNoCoat;
      }
      return {
        items: [mockOutfitNoCoat],
        status: 'succeeded',
      };
    });

    render(<IndividualOutfitPage />);

    expect(screen.queryByText('Coat')).not.toBeInTheDocument();

    expect(screen.getByText('Top')).toBeInTheDocument();
    expect(screen.getByText('Bottom')).toBeInTheDocument();
    expect(screen.getByText('Shoes')).toBeInTheDocument();
  });

  it('navigates back to outfits when the back button is clicked', () => {
    (useAppSelector as unknown as jest.Mock).mockImplementation((selector) => {
      if (selector.toString().includes('find')) {
        return mockOutfit;
      }
      return {
        items: [mockOutfit],
        status: 'succeeded',
      };
    });

    render(<IndividualOutfitPage />);

    fireEvent.click(screen.getByText('Back to Outfits'));
    expect(mockPush).toHaveBeenCalledWith('/outfits');
  });

  it('deletes the outfit when delete button is clicked and confirmed', async () => {
    (useAppSelector as unknown as jest.Mock).mockImplementation((selector) => {
      if (selector.toString().includes('find')) {
        return mockOutfit;
      }
      return {
        items: [mockOutfit],
        status: 'succeeded',
      };
    });

    (window.confirm as jest.Mock).mockReturnValue(true);

    render(<IndividualOutfitPage />);

    fireEvent.click(screen.getByText('Delete outfit'));

    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to delete this outfit? This action can't be undone."
    );

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'outfit/delete' });
    expect(toast.promise).toHaveBeenCalled();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('does not delete the outfit when delete is canceled', () => {
    (useAppSelector as unknown as jest.Mock).mockImplementation((selector) => {
      if (selector.toString().includes('find')) {
        return mockOutfit;
      }
      return {
        items: [mockOutfit],
        status: 'succeeded',
      };
    });

    (window.confirm as jest.Mock).mockReturnValue(false);

    render(<IndividualOutfitPage />);

    fireEvent.click(screen.getByText('Delete outfit'));

    expect(window.confirm).toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalledWith(deleteOutfit(mockOutfitId));
    expect(toast.promise).not.toHaveBeenCalled();
  });

  it('renders the correct number of apparel items with appropriate links', () => {
    (useAppSelector as unknown as jest.Mock).mockImplementation((selector) => {
      if (selector.toString().includes('find')) {
        return mockOutfit;
      }
      return {
        items: [mockOutfit],
        status: 'succeeded',
      };
    });

    render(<IndividualOutfitPage />);

    const links = screen.getAllByTestId('mock-link');
    expect(links).toHaveLength(4);

    expect(links[0]).toHaveAttribute('href', '/apparel/coat-1');
    expect(links[1]).toHaveAttribute('href', '/apparel/top-1');
    expect(links[2]).toHaveAttribute('href', '/apparel/bottom-1');
    expect(links[3]).toHaveAttribute('href', '/apparel/shoes-1');
  });

  it('handles delete error correctly', async () => {
    (useAppSelector as unknown as jest.Mock).mockImplementation((selector) => {
      if (selector.toString().includes('find')) {
        return mockOutfit;
      }
      return {
        items: [mockOutfit],
        status: 'succeeded',
      };
    });

    (window.confirm as jest.Mock).mockReturnValue(true);

    mockUnwrap.mockImplementation(() => Promise.reject('Delete failed'));

    let capturedErrorRender: any;
    (toast.promise as unknown as jest.Mock).mockImplementation(
      (promise, options) => {
        capturedErrorRender = options.error.render;
        return promise.catch(() => {});
      }
    );

    render(<IndividualOutfitPage />);

    fireEvent.click(screen.getByText('Delete outfit'));

    await waitFor(() => {
      expect(mockUnwrap).toHaveBeenCalled();
    });

    if (capturedErrorRender) {
      const errorMessage = capturedErrorRender({ data: 'Delete failed' });
      expect(errorMessage).toBe('Error deleting outfit: Delete failed');
    }
  });
 
});
