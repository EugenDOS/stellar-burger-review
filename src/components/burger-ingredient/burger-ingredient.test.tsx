/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { TIngredient } from '@utils-types';

// Mock nanoid to return a consistent ID for testing
jest.mock('@reduxjs/toolkit', () => {
  const actual = jest.requireActual('@reduxjs/toolkit');
  return {
    ...actual,
    nanoid: jest.fn().mockReturnValue('test-nanoid-123')
  };
});

// Import the addIngredient action after mocking nanoid
import { addIngredient } from '../../services/slices/constructorSlice/constructorSlice';

// Create the mocks before importing the component
jest.mock('@ui', () => ({
  BurgerIngredientUI: ({ ingredient, count, handleAdd }: { 
    ingredient: TIngredient; 
    count: number; 
    handleAdd: () => void;
    locationState: any;
  }) => (
    <div data-testid="burger-ingredient-ui">
      <div data-testid="ingredient-name">{ingredient.name}</div>
      <div data-testid="ingredient-count">{count}</div>
      <button data-testid="add-button" onClick={handleAdd}>
        Add
      </button>
    </div>
  )
}));

// Import the component after mocking its dependencies
import { BurgerIngredient } from './burger-ingredient';

// Mock the useDispatch hook
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn().mockReturnValue(jest.fn())
}));

describe('BurgerIngredient Component', () => {
  const mockStore = configureStore([]);
  const store = mockStore({});
  
  const mockIngredient: TIngredient = {
    _id: 'ingredient-1',
    name: 'Test Ingredient',
    type: 'main',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    price: 150,
    image: 'test-image.png',
    image_mobile: 'test-image-mobile.png',
    image_large: 'test-image-large.png'
  };

  const renderComponent = (ingredient = mockIngredient, count = 1) => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <BurgerIngredient ingredient={ingredient} count={count} />
        </BrowserRouter>
      </Provider>
    );
  };

  beforeEach(() => {
    // Clear store actions before each test
    store.clearActions();
    // Reset nanoid mock to ensure it returns the expected value
    jest.spyOn(require('@reduxjs/toolkit'), 'nanoid').mockReturnValue('test-nanoid-123');
  });

  it('should render the component with provided props', () => {
    renderComponent();
    expect(screen.getByTestId('burger-ingredient-ui')).toBeInTheDocument();
    expect(screen.getByTestId('ingredient-name')).toHaveTextContent('Test Ingredient');
    expect(screen.getByTestId('ingredient-count')).toHaveTextContent('1');
  });

  it('should render with correct count', () => {
    renderComponent(mockIngredient, 3);
    expect(screen.getByTestId('ingredient-count')).toHaveTextContent('3');
  });

  it('should dispatch addIngredient action when Add button is clicked', () => {
    const useDispatchSpy = jest.spyOn(require('react-redux'), 'useDispatch');
    const mockDispatch = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatch);

    renderComponent();
    
    fireEvent.click(screen.getByTestId('add-button'));
    
    // Create the expected ingredient with the consistent ID
    const expectedIngredient = {
      ...mockIngredient,
      id: 'test-nanoid-123'
    };
    
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(addIngredient(mockIngredient));
    
    useDispatchSpy.mockRestore();
  });
}); 