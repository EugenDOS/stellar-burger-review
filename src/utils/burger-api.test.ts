/**
 * @jest-environment jsdom
 */
import { refreshToken, fetchWithRefresh } from './burger-api';
import * as cookieModule from './cookie';

// Mock the fetch API
global.fetch = jest.fn();

// Mock the cookie functions
jest.mock('./cookie', () => ({
  setCookie: jest.fn(),
  getCookie: jest.fn(),
}));

describe('Burger API Utilities', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Setup localStorage mock
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key) => {
          if (key === 'refreshToken') return 'mock-refresh-token';
          return null;
        }),
        setItem: jest.fn(),
        clear: jest.fn()
      },
      writable: true
    });
  });

  describe('refreshToken function', () => {
    it('should refresh the token and update storage', async () => {
      // Mock a successful response
      const mockResponse = {
        success: true,
        refreshToken: 'new-refresh-token',
        accessToken: 'new-access-token'
      };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse)
      });

      const result = await refreshToken();

      // Check that fetch was called correctly
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/token'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.any(Object),
          body: JSON.stringify({
            token: 'mock-refresh-token'
          })
        })
      );

      // Check that token was stored
      expect(localStorage.setItem).toHaveBeenCalledWith('refreshToken', 'new-refresh-token');
      expect(cookieModule.setCookie).toHaveBeenCalledWith('accessToken', 'new-access-token');
      
      // Check returned data
      expect(result).toEqual(mockResponse);
    });

    it('should reject when API returns an unsuccessful response', async () => {
      // Mock an unsuccessful response
      const mockResponse = {
        success: false,
        message: 'Token expired'
      };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse)
      });

      await expect(refreshToken()).rejects.toEqual(mockResponse);
    });
  });

  describe('fetchWithRefresh function', () => {
    it('should fetch data without refreshing token if first request succeeds', async () => {
      const mockResponse = { success: true, data: 'test data' };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse)
      });

      const result = await fetchWithRefresh('https://example.com/api', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
    });

    it('should refresh token and retry if first request fails with jwt expired', async () => {
      // First request fails with JWT expired
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({
          message: 'jwt expired'
        })
      });

      // Token refresh succeeds
      const mockRefreshResponse = {
        success: true,
        refreshToken: 'new-refresh-token',
        accessToken: 'Bearer new-access-token'
      };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockRefreshResponse)
      });

      // Second API call succeeds
      const mockFinalResponse = { success: true, data: 'refreshed data' };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockFinalResponse)
      });

      const result = await fetchWithRefresh('https://example.com/api', {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          authorization: 'Bearer old-token'
        }
      });

      // Check that fetch was called 3 times (initial, refresh, retry)
      expect(global.fetch).toHaveBeenCalledTimes(3);
      
      // Check final result
      expect(result).toEqual(mockFinalResponse);
      
      // Check that the authorization header was updated in the retry
      expect(global.fetch).toHaveBeenLastCalledWith(
        'https://example.com/api',
        expect.objectContaining({
          headers: expect.objectContaining({
            authorization: 'Bearer new-access-token'
          })
        })
      );
    });

    it('should propagate other errors if not related to JWT expiration', async () => {
      const mockError = { message: 'Network error' };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce(mockError)
      });

      await expect(fetchWithRefresh('https://example.com/api', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })).rejects.toEqual(mockError);
      
      // Should not attempt to refresh token
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });
}); 