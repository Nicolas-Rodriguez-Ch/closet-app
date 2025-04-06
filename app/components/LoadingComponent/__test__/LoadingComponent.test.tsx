import { render, screen } from '@testing-library/react';
import LoadingComponent from '../LoadingComponent';

describe('Loading Component', () => {
  it('Renders loading component', () => {
    render(<LoadingComponent />);

    expect(screen.getByText('Loading, please wait'));
  });
  it('Has correct accessibility attributes', () => {
    render(<LoadingComponent />);

    const loadingContainer = screen.getByRole('alert');
    expect(loadingContainer).toBeInTheDocument();
  });
  it('Renders loading gif', () => {
    render(<LoadingComponent />);

    const loadingImage = screen.getByRole('img', { name: 'Loading Gif' });
    expect(loadingImage).toBeInTheDocument();
    expect(loadingImage).toHaveAttribute('src');
  });
  it('Renders text with correct styling', () => {
    render(<LoadingComponent />);

    const loadingText = screen.getByText('Loading, please wait');
    expect(loadingText).toHaveClass('text-palette-2');
    expect(loadingText).toHaveClass('font-bold');
    expect(loadingText).toHaveClass('text-xl');
  });
});
