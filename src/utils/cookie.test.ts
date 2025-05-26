/**
 * @jest-environment jsdom
 */
import { getCookie, setCookie, deleteCookie } from './cookie';

describe('Cookie Utility Functions', () => {
  beforeEach(() => {
    // Clear cookies before each test
    document.cookie = '';
  });

  describe('setCookie function', () => {
    it('should set a cookie with default path', () => {
      setCookie('testCookie', 'testValue');
      expect(document.cookie).toBe('testCookie=testValue');
    });

    it('should set a cookie with expiration date', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      setCookie('testCookie', 'testValue', { expires: tomorrow });
      
      // Check that cookie was set with the value
      expect(document.cookie).toContain('testCookie=testValue');
    });

    it('should set a cookie with numeric expiration', () => {
      setCookie('testCookie', 'testValue', { expires: 3600 }); // 1 hour
      expect(document.cookie).toContain('testCookie=testValue');
    });

    it('should handle special characters in cookie value', () => {
      setCookie('testCookie', 'test=value with spaces');
      expect(document.cookie).toContain('testCookie=');
      
      // Value is encoded
      const decodedValue = getCookie('testCookie');
      expect(decodedValue).toBe('test=value with spaces');
    });
  });

  describe('getCookie function', () => {
    it('should return undefined for non-existent cookie', () => {
      expect(getCookie('nonExistentCookie')).toBeUndefined();
    });

    it('should return the cookie value when cookie exists', () => {
      document.cookie = 'testCookie=testValue';
      expect(getCookie('testCookie')).toBe('testValue');
    });

    it('should handle cookies with special characters in name', () => {
      // First set the cookie using our utility
      setCookie('test.cookie', 'specialValue');
      
      // Then check if we can retrieve it
      expect(getCookie('test.cookie')).toBe('specialValue');
    });
  });

  describe('deleteCookie function', () => {
    it('should delete an existing cookie', () => {
      // First set the cookie
      setCookie('testCookie', 'testValue');
      expect(getCookie('testCookie')).toBe('testValue');
      
      // Then delete it
      deleteCookie('testCookie');
      
      // Cookie should be undefined after deletion
      expect(getCookie('testCookie')).toBeUndefined();
    });

    it('should not throw error when deleting non-existent cookie', () => {
      expect(() => {
        deleteCookie('nonExistentCookie');
      }).not.toThrow();
    });
  });
}); 