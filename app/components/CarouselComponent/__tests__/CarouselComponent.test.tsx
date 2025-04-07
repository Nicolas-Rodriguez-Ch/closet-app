import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CarouselComponent from '../CarouselComponent';
import ApparelSlide from '../ApparrelSlide/ApparelSlide';
import { IApparel } from '@/lib/types';
import { ApparelTypeEnum } from '@/services/types';

jest.mock('../ApparrelSlide/ApparelSlide');

describe('CarouselComponent', () => {
  const mockItems: IApparel[] = [
    { 
      id: '1', 
      title: 'Item 1', 
      pictureURL: 'url1',
      type: ApparelTypeEnum.COAT,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    },
    { 
      id: '2', 
      title: 'Item 2', 
      pictureURL: 'url2',
      type: ApparelTypeEnum.TOP,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    },
    { 
      id: '3', 
      title: 'Item 3', 
      pictureURL: 'url3',
      type: ApparelTypeEnum.BOTTOM,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    }
  ];

  const mockCategory = 'TEST_CATEGORY';
  const mockOnIndexChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (ApparelSlide as jest.Mock).mockImplementation(props => (
      <div data-testid="apparel-slide">
        <p data-testid="slide-title">{props.title}</p>
        <img data-testid="slide-image" src={props.imgSrc} alt={props.title} />
      </div>
    ));
  });

  test('renders the component with category title', () => {
    render(
      <CarouselComponent 
        item={mockItems} 
        category={mockCategory} 
        onIndexChange={mockOnIndexChange}
      />
    );

    expect(screen.getByText(mockCategory)).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  test('calls onIndexChange with initial activeIndex on mount', () => {
    render(
      <CarouselComponent 
        item={mockItems} 
        category={mockCategory} 
        onIndexChange={mockOnIndexChange}
      />
    );

    expect(mockOnIndexChange).toHaveBeenCalledWith(0, mockCategory);
  });

  test('shows next item when Next button is clicked', () => {
    render(
      <CarouselComponent 
        item={mockItems} 
        category={mockCategory} 
        onIndexChange={mockOnIndexChange}
      />
    );

    expect(screen.getByTestId('slide-title')).toHaveTextContent('Item 1');
    
    fireEvent.click(screen.getByText('Next'));

    expect(screen.getByTestId('slide-title')).toHaveTextContent('Item 2');
    
    expect(mockOnIndexChange).toHaveBeenCalledWith(1, mockCategory);
  });

  test('shows previous item when Previous button is clicked', () => {
    render(
      <CarouselComponent 
        item={mockItems} 
        category={mockCategory} 
        onIndexChange={mockOnIndexChange}
      />
    );

    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByText('Next'));

    expect(screen.getByTestId('slide-title')).toHaveTextContent('Item 3');
    
    mockOnIndexChange.mockClear();

    fireEvent.click(screen.getByText('Previous'));

    expect(screen.getByTestId('slide-title')).toHaveTextContent('Item 2');

    expect(mockOnIndexChange).toHaveBeenCalledWith(1, mockCategory);
  });

  test('wraps around to last item when Previous is clicked on first item', () => {
    render(
      <CarouselComponent 
        item={mockItems} 
        category={mockCategory} 
        onIndexChange={mockOnIndexChange}
      />
    );

    expect(screen.getByTestId('slide-title')).toHaveTextContent('Item 1');
    
    mockOnIndexChange.mockClear();

    fireEvent.click(screen.getByText('Previous'));

    expect(screen.getByTestId('slide-title')).toHaveTextContent('Item 3');

    expect(mockOnIndexChange).toHaveBeenCalledWith(2, mockCategory);
  });

  test('wraps around to first item when Next is clicked on last item', () => {
    render(
      <CarouselComponent 
        item={mockItems} 
        category={mockCategory} 
        onIndexChange={mockOnIndexChange}
      />
    );

    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByText('Next'));

    expect(screen.getByTestId('slide-title')).toHaveTextContent('Item 3');
    
    mockOnIndexChange.mockClear();

    fireEvent.click(screen.getByText('Next'));

    expect(screen.getByTestId('slide-title')).toHaveTextContent('Item 1');

    expect(mockOnIndexChange).toHaveBeenCalledWith(0, mockCategory);
  });

  test('works correctly when onIndexChange is not provided', () => {
    render(
      <CarouselComponent 
        item={mockItems} 
        category={mockCategory}
      />
    );

    expect(screen.getByText(mockCategory)).toBeInTheDocument();
    expect(screen.getByTestId('slide-title')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByTestId('slide-title')).toHaveTextContent('Item 2');
  });
});