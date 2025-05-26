import userSlice, {
  getUser,
  getOrdersAll,
  initialState,
  registerUser,
  loginUser,
  updateUser,
  logoutUser
} from './userSlice';

describe('User Slice Reducer', () => {
  // Setup common test data
  const mockUser = { name: 'Test User', email: 'test@example.com' };
  const mockOrders = ['order1', 'order2'];
  const mockError = 'Authentication failed';

  describe('getUser async action', () => {
    it('should handle pending state', () => {
      // Arrange
      const action = { type: getUser.pending.type, payload: null };
      
      // Act
      const state = userSlice(initialState, action);
      
      // Assert
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
      expect(state.loginUserRequest).toBe(true);
    });

    it('should handle rejected state', () => {
      // Arrange
      const action = { 
        type: getUser.rejected.type, 
        error: { message: mockError }
      };
      
      // Act
      const state = userSlice(initialState, action);
      
      // Assert
      expect(state.isAuthenticated).toBe(false);
      expect(state.isAuthChecked).toBe(false);
      expect(state.loginUserRequest).toBe(false);
      // The error property is not set in the reducer for getUser.rejected
    });

    it('should store user data when fulfilled', () => {
      // Arrange
      const action = {
        type: getUser.fulfilled.type,
        payload: { user: mockUser }
      };
      
      // Act
      const state = userSlice(initialState, action);
      
      // Assert
      expect(state.isAuthenticated).toBe(true);
      expect(state.loginUserRequest).toBe(false);
      expect(state.userData).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(false);
    });
  });

  describe('getOrdersAll async action', () => {
    it('should set request flag to true when pending', () => {
      // Arrange
      const action = { type: getOrdersAll.pending.type, payload: null };
      
      // Act
      const state = userSlice(initialState, action);
      
      // Assert
      expect(state.request).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should handle rejected state with error message', () => {
      // Arrange
      const action = {
        type: getOrdersAll.rejected.type,
        error: { message: mockError }
      };
      
      // Act
      const state = userSlice(initialState, action);
      
      // Assert
      expect(state.request).toBe(false);
      expect(state.error).toBe(mockError);
    });

    it('should store orders data when fulfilled', () => {
      // Arrange
      const action = {
        type: getOrdersAll.fulfilled.type,
        payload: mockOrders
      };
      
      // Act
      const state = userSlice(initialState, action);
      
      // Assert
      expect(state.request).toBe(false);
      expect(state.userOrders).toEqual(mockOrders);
      expect(state.error).toBe(null);
    });
  });

  describe('registerUser async action', () => {
    it('should set request flag to true when pending', () => {
      // Arrange
      const action = { type: registerUser.pending.type, payload: null };
      
      // Act
      const state = userSlice(initialState, action);
      
      // Assert
      expect(state.request).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should handle rejected state with error message', () => {
      // Arrange
      const action = {
        type: registerUser.rejected.type,
        error: { message: mockError }
      };
      
      // Act
      const state = userSlice(initialState, action);
      
      // Assert
      expect(state.request).toBe(false);
      expect(state.error).toBe(mockError);
    });

    it('should store user data when fulfilled', () => {
      // Arrange
      const action = {
        type: registerUser.fulfilled.type,
        payload: { user: mockUser }
      };
      
      // Act
      const state = userSlice(initialState, action);
      
      // Assert
      expect(state.request).toBe(false);
      expect(state.error).toBe(null);
      expect(state.userData).toBe(mockUser);
    });
  });

  describe('loginUser async action', () => {
    it('should set loginUserRequest flag to true when pending', () => {
      // Arrange
      const action = { type: loginUser.pending.type, payload: null };
      
      // Act
      const state = userSlice(initialState, action);
      
      // Assert
      expect(state.loginUserRequest).toBe(true);
      expect(state.isAuthChecked).toBe(true);
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe(null);
    });

    it('should handle rejected state with error message', () => {
      // Arrange
      const action = {
        type: loginUser.rejected.type,
        error: { message: mockError }
      };
      
      // Act
      const state = userSlice(initialState, action);
      
      // Assert
      expect(state.isAuthChecked).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.loginUserRequest).toBe(false);
      expect(state.error).toBe(mockError);
    });

    it('should authenticate user when fulfilled', () => {
      // Arrange
      const action = {
        type: loginUser.fulfilled.type,
        payload: { user: mockUser }
      };
      
      // Act
      const state = userSlice(initialState, action);
      
      // Assert
      expect(state.isAuthChecked).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.loginUserRequest).toBe(false);
      expect(state.error).toBe(null);
      expect(state.userData).toBe(mockUser);
    });
  });

  describe('updateUser async action', () => {
    it('should set request flag to true when pending', () => {
      // Arrange
      const action = { type: updateUser.pending.type, payload: null };
      
      // Act
      const state = userSlice(initialState, action);
      
      // Assert
      expect(state.request).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should handle rejected state with error message', () => {
      // Arrange
      const action = {
        type: updateUser.rejected.type,
        error: { message: mockError }
      };
      
      // Act
      const state = userSlice(initialState, action);
      
      // Assert
      expect(state.request).toBe(false);
      expect(state.error).toBe(mockError);
    });

    it('should update user data when fulfilled', () => {
      // Arrange
      const action = {
        type: updateUser.fulfilled.type,
        payload: { user: mockUser }
      };
      
      // Act
      const state = userSlice(initialState, action);
      
      // Assert
      expect(state.request).toBe(false);
      expect(state.error).toBe(null);
      expect(state.response).toBe(mockUser);
    });
  });

  describe('logoutUser async action', () => {
    it('should set request and auth flags when pending', () => {
      // Arrange
      const action = { type: logoutUser.pending.type, payload: null };
      
      // Act
      const state = userSlice(initialState, action);
      
      // Assert
      expect(state.request).toBe(true);
      expect(state.isAuthChecked).toBe(true);
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should handle rejected state with error message', () => {
      // Arrange
      const action = {
        type: logoutUser.rejected.type,
        error: { message: mockError }
      };
      
      // Act
      const state = userSlice(initialState, action);
      
      // Assert
      expect(state.isAuthChecked).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.request).toBe(false);
      expect(state.error).toBe(mockError);
    });

    it('should clear user data when fulfilled', () => {
      // Arrange
      const action = {
        type: logoutUser.fulfilled.type,
        payload: null
      };
      
      // Act
      const state = userSlice(initialState, action);
      
      // Assert
      expect(state.isAuthChecked).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.request).toBe(false);
      expect(state.error).toBe(null);
      expect(state.userData).toBe(null);
    });
  });
});
