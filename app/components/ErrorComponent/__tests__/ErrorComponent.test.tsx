import { render, screen } from '@testing-library/react';
import ErrorComponent from '../ErrorComponent';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} data-testid='error-image' />;
  },
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} data-testid='home-link'>
      {children}
    </a>
  ),
}));

describe('ErrorComponent', () => {
  it('renders the error message', () => {
    render(<ErrorComponent />);

    const errorMessage = screen.getByText(
      'Error getting the information, please try again later'
    );
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-palette-2');
    expect(errorMessage).toHaveClass('text-lg');
    expect(errorMessage).toHaveClass('font-semibold');
  });

  it('renders the error image', () => {
    render(<ErrorComponent />);

    const errorImage = screen.getByTestId('error-image');
    expect(errorImage).toBeInTheDocument();
    expect(errorImage).toHaveAttribute('alt', 'Error');
  });

  it('renders the home page link button', () => {
    render(<ErrorComponent />);

    const homeLink = screen.getByTestId('home-link');
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveTextContent('Go back to the home page');
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('has correct accessibility attributes', () => {
    render(<ErrorComponent />);

    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toBeInTheDocument();
  });

  it('renders with correct layout and styling', () => {
    render(<ErrorComponent />);

    const container = screen
      .getByText('Error getting the information, please try again later')
      .closest('div')?.parentElement;

    expect(container).toHaveClass('flex');
    expect(container).toHaveClass('flex-col');
    expect(container).toHaveClass('items-center');
    expect(container).toHaveClass('justify-center');
    expect(container).toHaveClass('min-h-screen');
    expect(container).toHaveClass('bg-palette-3');
  });

  it('button has correct styling and hover states', () => {
    render(<ErrorComponent />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');
    expect(button).toHaveClass('bg-palette-1');
    expect(button).toHaveClass('text-palette-3');
    expect(button).toHaveClass('hover:bg-palette-5');
  });
});
