import { render, screen } from '@testing-library/react';
import NotFound from '../not-found';
import '@testing-library/jest-dom';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img data-testid="error-image" {...props} />;
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
    <a href={href} data-testid="home-link">
      {children}
    </a>
  ),
}));

describe('NotFound Page', () => {
  it('renders the page title', () => {
    render(<NotFound />);
    
    const pageTitle = screen.getByText('Page Not Found');
    expect(pageTitle).toBeInTheDocument();
    expect(pageTitle).toHaveClass('text-3xl');
    expect(pageTitle).toHaveClass('font-bold');
    expect(pageTitle).toHaveClass('text-palette-2');
  });

  it('renders the error message', () => {
    render(<NotFound />);
    
    const errorMessage = screen.getByText('The page you are looking for does not exist or has been moved.');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-palette-2');
    expect(errorMessage).toHaveClass('text-lg');
  });

  it('renders the error image', () => {
    render(<NotFound />);
    
    const errorImage = screen.getByTestId('error-image');
    expect(errorImage).toBeInTheDocument();
    expect(errorImage).toHaveAttribute('alt', 'Page Not Found');
    expect(errorImage).toHaveAttribute('width', '300');
    expect(errorImage).toHaveAttribute('height', '300');
  });

  it('renders the home page link button', () => {
    render(<NotFound />);
    
    const homeLink = screen.getByTestId('home-link');
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveTextContent('Go back to the home page');
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders with correct layout and styling', () => {
    render(<NotFound />);
    
    const container = screen.getByText('Page Not Found').closest('div')?.parentElement;
    
    expect(container).toHaveClass('flex');
    expect(container).toHaveClass('flex-col');
    expect(container).toHaveClass('items-center');
    expect(container).toHaveClass('justify-center');
    expect(container).toHaveClass('min-h-screen');
    expect(container).toHaveClass('bg-palette-3');
  });

  it('button has correct styling and classes', () => {
    render(<NotFound />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');
    expect(button).toHaveClass('bg-palette-1');
    expect(button).toHaveClass('text-palette-3');
    expect(button).toHaveClass('hover:bg-palette-5');
    expect(button).toHaveClass('rounded-3xl');
  });
});