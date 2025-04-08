import { render, screen } from '@testing-library/react';
import Footer from '../Footer';
import '@testing-library/jest-dom';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...rest }: any) => (
    <a href={href} {...rest} data-testid="mock-link">
      {children}
    </a>
  ),
}));

describe('Footer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the developer credit text', () => {
    render(<Footer />);
    expect(screen.getByText(/Developed by Nicolás Rodríguez/)).toBeInTheDocument();
    expect(screen.getByText(/©\s+\d{4}/)).toBeInTheDocument();
  });

  it('renders all social links', () => {
    render(<Footer />);
    
    const links = screen.getAllByTestId('mock-link');
    expect(links).toHaveLength(4);
    
    const [github, linkedin, email, whatsapp] = links;
    
    expect(github).toHaveAttribute('href', 'https://github.com/Nicolas-Rodriguez-Ch');
    expect(github).toHaveAttribute('target', '_blank');
    expect(github).toHaveAttribute('rel', 'noopener noreferrer');
    
    expect(linkedin).toHaveAttribute('href', 'https://www.linkedin.com/in/nicolas-rodriguezc/');
    expect(linkedin).toHaveAttribute('target', '_blank');
    expect(linkedin).toHaveAttribute('rel', 'noopener noreferrer');
    
    expect(email).toHaveAttribute('href', 'mailto:nicolasrodriguezch@hotmail.com');
    
    expect(whatsapp).toHaveAttribute('href', 'https://wa.me/573002643270');
    expect(whatsapp).toHaveAttribute('target', '_blank');
    expect(whatsapp).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('has correct accessibility attributes', () => {
    render(<Footer />);
    
    expect(screen.getByLabelText('GitHub Profile')).toBeInTheDocument();
    expect(screen.getByLabelText('LinkedIn Profile')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Contact')).toBeInTheDocument();
    expect(screen.getByLabelText('WhatsApp Contact')).toBeInTheDocument();
  });

  it('has correct background color class', () => {
    render(<Footer />);
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('bg-palette-5');
    expect(footer).toHaveClass('text-palette-3');
  });

  it('has correct responsive layout classes', () => {
    render(<Footer />);
    
    const footer = screen.getByRole('contentinfo');
    const containerDiv = footer.firstChild;
    expect(containerDiv).toHaveClass('container');
    expect(containerDiv).toHaveClass('mx-auto');
    
    const flexContainer = containerDiv?.firstChild;
    expect(flexContainer).toHaveClass('flex');
    expect(flexContainer).toHaveClass('flex-col');
    expect(flexContainer).toHaveClass('md:flex-row');
  });
});