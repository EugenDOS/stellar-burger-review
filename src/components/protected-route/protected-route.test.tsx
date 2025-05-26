/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

// Define types for mock data
type TUserData = {
  name: string;
  email: string;
} | null;

// Mock the react-router-dom module completely to avoid infinite redirects
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  
  return {
    ...originalModule,
    useLocation: jest.fn(() => ({ pathname: '/', state: { from: { pathname: '/' } } })),
    Navigate: jest.fn(({ to }) => (
      <div data-testid="navigate" data-to={typeof to === 'string' ? to : JSON.stringify(to)}>
        Navigate to: {typeof to === 'string' ? to : '/'}
      </div>
    )),
    Outlet: jest.fn(() => <div data-testid="outlet">Outlet Content</div>)
  };
});

// Mock the Preloader component
jest.mock('../ui/preloader', () => ({
  Preloader: () => <div data-testid="preloader">Loading...</div>
}));

// Import the getUserState after mocking
import { getUserState } from '../../services/slices/userSlice/userSlice';

// Mock the getUserState function
jest.mock('../../services/slices/userSlice/userSlice', () => ({
  getUserState: jest.fn((state) => state.user)
}));

// Import the component after all mocks are set up
import { ProtectedRoute } from './protected-route';

describe('ProtectedRoute Component', () => {
  const mockStore = configureStore([]);
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should redirect to login when not authenticated and onlyUnAuth is false', () => {
    // Create store with unauthenticated state
    const store = mockStore({
      user: {
        userData: null,
        isAuthChecked: false,
        isAuthenticated: false
      }
    });
    
    // Act
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProtectedRoute onlyUnAuth={false} />
        </BrowserRouter>
      </Provider>
    );

    // Assert - should find the Navigate component with path to login
    const navigateElement = screen.getByTestId('navigate');
    expect(navigateElement).toBeInTheDocument();
    expect(navigateElement).toHaveAttribute('data-to', '/login');
  });
  
  it('should redirect to home when authenticated and onlyUnAuth is true', () => {
    // Create store with authenticated state
    const store = mockStore({
      user: {
        userData: { name: 'Test User', email: 'test@example.com' },
        isAuthChecked: false,
        isAuthenticated: true
      }
    });
    
    // Act
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProtectedRoute onlyUnAuth={true} />
        </BrowserRouter>
      </Provider>
    );

    // Assert - should find the Navigate component with path to home
    const navigateElement = screen.getByTestId('navigate');
    expect(navigateElement).toBeInTheDocument();
    expect(navigateElement).toHaveAttribute('data-to', JSON.stringify({ pathname: '/' }));
  });
  
  it('should show preloader when auth is being checked', () => {
    // Create store with auth checking state - change isAuthChecked to true
    const store = mockStore({
      user: {
        userData: null,
        isAuthChecked: true,
        isAuthenticated: true // This needs to be true to prevent redirect
      }
    });
    
    // Act
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProtectedRoute onlyUnAuth={false} />
        </BrowserRouter>
      </Provider>
    );

    // Assert - should show preloader
    expect(screen.getByTestId('preloader')).toBeInTheDocument();
  });
  
  it('should render outlet when authenticated and onlyUnAuth is false', () => {
    // Create store with authenticated state
    const store = mockStore({
      user: {
        userData: { name: 'Test User', email: 'test@example.com' },
        isAuthChecked: false,
        isAuthenticated: true
      }
    });
    
    // Act
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProtectedRoute onlyUnAuth={false} />
        </BrowserRouter>
      </Provider>
    );

    // Assert - should render outlet content instead of navigating
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });
}); 