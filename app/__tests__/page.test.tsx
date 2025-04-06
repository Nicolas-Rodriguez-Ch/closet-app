import { render, screen } from '@testing-library/react';
import Home from '../page';

jest.mock('../components/CarouselWrapper/CarouselWrapper', () => {
  const MockComponent = () => <div data-testid="carousel-wrapper" />;
  MockComponent.displayName = 'CarouselWrapper';
  return MockComponent;
});

describe('Home Page', () => {
  it('renders the home page with correct content', () => {
    render(<Home />);

    expect(screen.getByText('Esto es home')).toBeInTheDocument();

    const article = screen.getByRole('article');
    expect(article).toBeInTheDocument();
  });

  it('has the correct styling', () => {
    render(<Home />);

    const heading = screen.getByText('Esto es home');
    expect(heading).toHaveClass('bg-palette-1');
    expect(heading).toHaveClass('text-palette-3');
  });

  it('renders CarouselWrapper', () => {
    render(<Home />);
    expect(screen.getByTestId('carousel-wrapper')).toBeInTheDocument();
  });
});