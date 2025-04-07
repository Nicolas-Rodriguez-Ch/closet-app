import { render, screen } from '@testing-library/react';
import Outfit from '../page';

jest.mock('../../components/OutfitWrapper/OutfitWrapper', () => {
  const MockComponent = () => <div data-testid='outfit-wrapper' />;
  MockComponent.dispalayName = 'OutfitWrapper';
  return MockComponent;
});

describe('Outfit Page', () => {
  it('renders OutfitWrapper', () => {
    render(<Outfit />);
    expect(screen.getByTestId('outfit-wrapper')).toBeInTheDocument();
  });
});
