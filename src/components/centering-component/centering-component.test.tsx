/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CenteringComponent } from './centering-component';
import { BrowserRouter } from 'react-router-dom';
import { ReactNode } from 'react';

// Mock the UI component
jest.mock('../ui/centering-component', () => ({
  CenteringComponentUI: ({ 
    title, 
    titleStyle, 
    children 
  }: { 
    title: string; 
    titleStyle: string; 
    children: ReactNode 
  }) => (
    <div data-testid="centering-component">
      <h1 data-testid="title" className={titleStyle}>{title}</h1>
      <div data-testid="content">{children}</div>
    </div>
  )
}));

describe('CenteringComponent', () => {
  const renderWithRouter = (component: ReactNode, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(
      <BrowserRouter>{component}</BrowserRouter>
    );
  };

  it('should render with default title style for non-feed/profile routes', () => {
    // Arrange and Act
    renderWithRouter(
      <CenteringComponent title="Test Title">
        <div>Test Content</div>
      </CenteringComponent>,
      { route: '/ingredients/123' }
    );
    
    // Assert
    expect(screen.getByTestId('title')).toHaveClass('text_type_main-large');
    expect(screen.getByTestId('title')).toHaveTextContent('Test Title');
    expect(screen.getByTestId('content')).toHaveTextContent('Test Content');
  });
  
  it('should render with digits title style for feed routes', () => {
    // Arrange and Act
    renderWithRouter(
      <CenteringComponent title="12345">
        <div>Feed Content</div>
      </CenteringComponent>,
      { route: '/feed/12345' }
    );
    
    // Assert
    expect(screen.getByTestId('title')).toHaveClass('text_type_digits-default');
    expect(screen.getByTestId('title')).toHaveTextContent('12345');
  });
  
  it('should render with digits title style for profile routes', () => {
    // Arrange and Act
    renderWithRouter(
      <CenteringComponent title="12345">
        <div>Profile Content</div>
      </CenteringComponent>,
      { route: '/profile/orders/12345' }
    );
    
    // Assert
    expect(screen.getByTestId('title')).toHaveClass('text_type_digits-default');
    expect(screen.getByTestId('title')).toHaveTextContent('12345');
  });
  
  it('should render children correctly', () => {
    // Arrange and Act
    renderWithRouter(
      <CenteringComponent title="Test">
        <div>Child 1</div>
        <div>Child 2</div>
      </CenteringComponent>
    );
    
    // Assert
    expect(screen.getByTestId('content')).toHaveTextContent('Child 1');
    expect(screen.getByTestId('content')).toHaveTextContent('Child 2');
  });
}); 