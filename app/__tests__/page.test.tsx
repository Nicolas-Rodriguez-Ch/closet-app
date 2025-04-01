import { render, screen } from '@testing-library/react';
import Home from '../page';

jest.spyOn(console, 'log').mockImplementation(() => {});

describe('Home Page', () => {
  it('renders the home page with correct content', () => {
    render(<Home />);
    
    expect(screen.getByText('Esto es home')).toBeInTheDocument();
    
    const article = screen.getByRole('article');
    expect(article).toBeInTheDocument();
    
    expect(console.log).toHaveBeenCalledWith('im i in the client or the server?');
  });
  
  it('has the correct styling', () => {
    render(<Home />);
    
    const heading = screen.getByText('Esto es home');
    expect(heading).toHaveClass('bg-palette-1');
    expect(heading).toHaveClass('text-palette-3');
  });
});