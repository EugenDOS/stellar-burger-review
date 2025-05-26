import orderSlice, { initialState, getOrderByNumber } from './orderSlice';

describe('Order Slice Reducer', () => {
  // Setup common test data
  const mockOrder = { name: 'Test Order', number: 12345 };
  const mockError = 'Failed to fetch order';

  describe('getOrderByNumber async action', () => {
    it('should set request flag to true when pending', () => {
      // Arrange
      const action = { type: getOrderByNumber.pending.type, payload: null };
      
      // Act
      const state = orderSlice(initialState, action);
      
      // Assert
      expect(state.request).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should handle rejected state with error message', () => {
      // Arrange
      const action = {
        type: getOrderByNumber.rejected.type,
        error: { message: mockError }
      };
      
      // Act
      const state = orderSlice(initialState, action);
      
      // Assert
      expect(state.request).toBe(false);
      expect(state.error).toBe(mockError);
    });

    it('should store order data when fulfilled', () => {
      // Arrange
      const action = {
        type: getOrderByNumber.fulfilled.type,
        payload: { orders: [mockOrder] }
      };
      
      // Act
      const state = orderSlice(initialState, action);
      
      // Assert
      expect(state.request).toBe(false);
      expect(state.error).toBe(null);
      expect(state.orderByNumberResponse).toBe(mockOrder);
    });
  });
});
