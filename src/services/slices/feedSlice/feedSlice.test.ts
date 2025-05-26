import feedSlice, { getFeeds, initialState } from './feedSlice';

describe('Feed Slice Reducer', () => {
  // Setup common test data
  const mockOrders = ['order1', 'order2'];
  const mockError = 'Failed to fetch feed data';

  describe('getFeeds async action', () => {
    it('should set loading to true when pending', () => {
      // Arrange
      const action = { type: getFeeds.pending.type, payload: null };
      
      // Act
      const state = feedSlice(initialState, action);
      
      // Assert
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should handle rejected state with error message', () => {
      // Arrange
      const action = {
        type: getFeeds.rejected.type,
        error: { message: mockError }
      };
      
      // Act
      const state = feedSlice(initialState, action);
      
      // Assert
      expect(state.loading).toBe(false);
      expect(state.error).toBe(mockError);
    });

    it('should store orders data when fulfilled', () => {
      // Arrange
      const action = {
        type: getFeeds.fulfilled.type,
        payload: { orders: mockOrders }
      };
      
      // Act
      const state = feedSlice(initialState, action);
      
      // Assert
      expect(state.loading).toBe(false);
      expect(state.orders).toEqual(mockOrders);
      expect(state.error).toBe(null);
    });
  });
});
