import React from 'react';
import { render } from '@testing-library/react';
import ToastNotifier from '../ToastNotifier';
import * as ReactToastify from 'react-toastify';

jest.mock('react-toastify', () => ({
  Bounce: 'mock-bounce',
  ToastContainer: jest.fn(() => null)
}));

describe('ToastNotifier', () => {
  it('renders ToastContainer with correct props', () => {
    render(React.createElement(ToastNotifier));
    expect(ReactToastify.ToastContainer).toHaveBeenCalledWith(
      expect.objectContaining({
        position: 'top-right',
        autoClose: 5000,
        transition: 'mock-bounce',
        theme: 'colored'
      }),
      undefined
    );
  });
});