import { render, screen } from '@testing-library/react';
import StoreProvider from '../StoreProvider';
import { makeStore } from '@/lib/store';
import { Provider } from 'react-redux';

jest.mock('@/lib/store', () => ({
  makeStore: jest.fn(() => ({ mock: 'store' })),
}));

jest.mock('react-redux', () => ({
  Provider: jest.fn(({ children }) => (
    <div data-testid='provider'>{children}</div>
  )),
}));

describe('StoreProvider', () => {
  beforeEach(() => {
    (makeStore as jest.Mock).mockClear();
    (Provider as jest.Mock).mockClear();
  });

  it('calls makeStore once and wraps children', () => {
    render(
      <StoreProvider>
        <div data-testid='child' />
      </StoreProvider>
    );

    expect(makeStore).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('provider')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
