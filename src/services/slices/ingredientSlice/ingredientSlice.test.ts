import ingredientSlice, {
  getIngredients,
  initialState
} from './ingredientSlice';

describe('Ingredient Slice Reducer', () => {
  // Setup common test data
  const mockIngredients = ['ingredient1', 'ingredient2'];
  const mockError = 'Failed to fetch ingredients';

  describe('getIngredients async action', () => {
    it('should set loading to true when pending', () => {
      // Arrange
      const action = { type: getIngredients.pending.type, payload: null };
      
      // Act
      const state = ingredientSlice(initialState, action);
      
      // Assert
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should handle rejected state with error message', () => {
      // Arrange
      const action = {
        type: getIngredients.rejected.type,
        error: { message: mockError }
      };
      
      // Act
      const state = ingredientSlice(initialState, action);
      
      // Assert
      expect(state.loading).toBe(false);
      expect(state.error).toBe(mockError);
    });

    it('should store ingredients data when fulfilled', () => {
      // Arrange
      const action = {
        type: getIngredients.fulfilled.type,
        payload: mockIngredients
      };
      
      // Act
      const state = ingredientSlice(initialState, action);
      
      // Assert
      expect(state.loading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.error).toBe(null);
    });
  });
});
