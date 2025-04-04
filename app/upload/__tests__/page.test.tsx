import React from 'react';
import { render, screen } from '@testing-library/react';
import Upload from '../page';
import UploadForm from '../../components/UploadForm/UploadForm';

jest.mock('../../components/UploadForm/UploadForm', () => {
  return jest.fn(() => {
    return React.createElement('div', { 'data-testid': 'upload-form-mock' });
  });
});

describe('Upload Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the UploadForm component', () => {
    render(React.createElement(Upload));
    expect(screen.getByTestId('upload-form-mock')).toBeInTheDocument();
  });

  it('calls the UploadForm component', () => {
    render(React.createElement(Upload));
    expect(UploadForm).toHaveBeenCalled();
  });

  it('has the correct wrapper styling', () => {
    const { container } = render(React.createElement(Upload));
    const wrapperDiv = container.firstChild;
    expect(wrapperDiv).toHaveClass('flex');
    expect(wrapperDiv).toHaveClass('justify-center');
  });
});
