import { render, screen } from '@testing-library/react';
import Home from '../page';

jest.mock('../components/CarouselWrapper/CarouselWrapper', () => {
  const MockComponent = () => <div data-testid="carousel-wrapper" />;
  MockComponent.displayName = 'CarouselWrapper';
  return MockComponent;
});

describe('Home Page', () => {
  it('renders CarouselWrapper', () => {
    render(<Home />);
    expect(screen.getByTestId('carousel-wrapper')).toBeInTheDocument();
  });
});