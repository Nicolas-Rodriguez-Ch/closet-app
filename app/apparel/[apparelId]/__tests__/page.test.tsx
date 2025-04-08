import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ApparelItemPage from '../page';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
  deleteApparel,
  fetchAllApparel,
} from '@/lib/features/apparel/apparelSlice';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { IApparel } from '@/lib/types';
import { ApparelTypeEnum } from '@/services/types';

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

jest.mock('@/lib/features/apparel/apparelSlice', () => ({
  fetchAllApparel: jest.fn(),
  deleteApparel: jest.fn(),
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

describe('ApparelItemPage', () => {
  const mockPush = jest.fn();
  const mockDispatch = jest.fn();
  const mockUnwrap = jest.fn().mockResolvedValue({});
  const mockApparelId = 'test-apparel-123';

  const mockApparelItem: IApparel = {
    id: mockApparelId,
    title: 'Test Apparel',
    description: 'This is a test apparel item',
    pictureURL: '/test-apparel.jpg',
    type: ApparelTypeEnum.TOP,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useParams as unknown as jest.Mock).mockReturnValue({
      apparelId: mockApparelId,
    });
    (useRouter as unknown as jest.Mock).mockReturnValue({ push: mockPush });
    (useAppDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (mockDispatch as jest.Mock).mockReturnValue({ unwrap: mockUnwrap });
    (deleteApparel as unknown as jest.Mock).mockReturnValue({
      type: 'apparel/delete',
    });
    (fetchAllApparel as unknown as jest.Mock).mockReturnValue({
      type: 'apparel/fetchAll',
    });
    (toast.promise as unknown as jest.Mock).mockImplementation(
      (promise) => promise
    );

    window.confirm = jest.fn();

    (useAppSelector as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        apparel: {
          items: {
            TOP: [mockApparelItem],
            BOTTOM: [],
            SHOES: [],
            COAT: []
          },
          status: 'succeeded'
        }
      };
      return selector(state);
    });
  });

  it('dispatches fetchAllApparel when status is idle', () => {
    (useAppSelector as unknown as jest.Mock).mockReturnValueOnce({
      items: {},
      status: 'idle',
    });

    render(<ApparelItemPage />);

    expect(mockDispatch).toHaveBeenCalledWith(fetchAllApparel());
  });

  it('dispatches fetchAllApparel when status is succeeded but items are empty', () => {
    (useAppSelector as unknown as jest.Mock).mockImplementationOnce(() => ({
      items: { TOP: [], BOTTOM: [], SHOES: [], COAT: [] },
      status: 'succeeded',
    }));

    render(<ApparelItemPage />);

    expect(mockDispatch).toHaveBeenCalledWith(fetchAllApparel());
  });

  it('shows loading component when status is idle', () => {
    (useAppSelector as unknown as jest.Mock).mockReturnValueOnce({
      items: {},
      status: 'idle',
    });

    render(<ApparelItemPage />);

    expect(screen.getByText('Loading, please wait')).toBeInTheDocument();
  });

  it('shows loading component when status is loading', () => {
    (useAppSelector as unknown as jest.Mock).mockReturnValueOnce({
      items: {},
      status: 'loading',
    });

    render(<ApparelItemPage />);

    expect(screen.getByText('Loading, please wait')).toBeInTheDocument();
  });

  it('shows error component when status is failed', () => {
    (useAppSelector as unknown as jest.Mock).mockReturnValueOnce({
      items: {},
      status: 'failed',
    });

    render(<ApparelItemPage />);

    expect(
      screen.getByText('Error getting the information, please try again later')
    ).toBeInTheDocument();
  });

  it('shows not found message when status is succeeded but apparel item is not found', () => {
    (useAppSelector as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        apparel: {
          items: {
            TOP: [{ id: 'different-id' }],
            BOTTOM: [],
            SHOES: [],
            COAT: []
          },
          status: 'succeeded'
        }
      };
      
      if (selector.toString().includes('find')) {
        return null;
      }
      
      return state.apparel;
    });

    render(<ApparelItemPage />);

    expect(screen.getByText('Apparel Item Not Found')).toBeInTheDocument();
    expect(
      screen.getByText(
        'The apparel item you are looking for does not exist or has been removed.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Return to Apparel')).toBeInTheDocument();
  });

  it('displays apparel item details when item is found', () => {
    render(<ApparelItemPage />);

    const titleElements = screen.getAllByText('Test Apparel');
    expect(titleElements.length).toBeGreaterThan(0);
    
    const descriptionElements = screen.getAllByText('This is a test apparel item');
    expect(descriptionElements.length).toBeGreaterThan(0);

    expect(screen.getByText('TOP')).toBeInTheDocument();
    expect(screen.getByText('Delete Apparel Item')).toBeInTheDocument();
    expect(screen.getByText('Back to home')).toBeInTheDocument();
  });

  it('deletes the apparel item when delete button is clicked and confirmed', async () => {
    (window.confirm as jest.Mock).mockReturnValue(true);

    render(<ApparelItemPage />);

    fireEvent.click(screen.getByText('Delete Apparel Item'));

    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to delete this apparel item? This action can't be undone."
    );

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'apparel/delete' });
    expect(toast.promise).toHaveBeenCalled();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('does not delete the apparel item when delete is canceled', () => {
    (window.confirm as jest.Mock).mockReturnValue(false);

    render(<ApparelItemPage />);

    fireEvent.click(screen.getByText('Delete Apparel Item'));

    expect(window.confirm).toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalledWith(deleteApparel(mockApparelId));
    expect(toast.promise).not.toHaveBeenCalled();
  });

  it('navigates back to home when back to home button is clicked', () => {
    render(<ApparelItemPage />);

    fireEvent.click(screen.getByText('Back to home'));
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('handles delete error correctly', async () => {
    (window.confirm as jest.Mock).mockReturnValue(true);

    mockUnwrap.mockImplementation(() => Promise.reject('Delete failed'));

    let capturedErrorRender: any;
    (toast.promise as unknown as jest.Mock).mockImplementation(
      (promise, options) => {
        capturedErrorRender = options.error.render;
        return promise.catch(() => {});
      }
    );

    render(<ApparelItemPage />);

    fireEvent.click(screen.getByText('Delete Apparel Item'));

    await waitFor(() => {
      expect(mockUnwrap).toHaveBeenCalled();
    });

    if (capturedErrorRender) {
      const errorMessage = capturedErrorRender({ data: 'Delete failed' });
      expect(errorMessage).toBe('Error deleting apparel: Delete failed');
    }
  });
});