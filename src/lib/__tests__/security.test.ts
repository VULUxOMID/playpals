import { generateSecureState, generateSessionToken, createSessionToken, verifySessionToken, hashSessionToken } from '../session';
import { generateEncryptionKey, validateEncryptionKey } from '../db';

describe('Security Functions', () => {
  describe('Session Token Generation', () => {
    test('should generate unique session tokens', () => {
      const token1 = generateSessionToken();
      const token2 = generateSessionToken();
      
      expect(token1).toBeDefined();
      expect(token2).toBeDefined();
      expect(token1).not.toBe(token2);
      expect(token1).toHaveLength(64); // 32 bytes = 64 hex chars
      expect(token2).toHaveLength(64);
    });

    test('should generate valid hex strings', () => {
      const token = generateSessionToken();
      expect(token).toMatch(/^[0-9a-f]{64}$/);
    });
  });

  describe('JWT Token Functions', () => {
    test('should create and verify JWT tokens', () => {
      const userId = 'test-user-id';
      const sessionId = 'test-session-id';
      
      const token = createSessionToken(userId, sessionId);
      const decoded = verifySessionToken(token);
      
      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe(userId);
      expect(decoded?.sessionId).toBe(sessionId);
    });

    test('should reject invalid tokens', () => {
      const invalidToken = 'invalid.jwt.token';
      const decoded = verifySessionToken(invalidToken);
      
      expect(decoded).toBeNull();
    });
  });

  describe('Secure State Generation', () => {
    test('should generate unique secure states', () => {
      const state1 = generateSecureState();
      const state2 = generateSecureState();
      
      expect(state1).toBeDefined();
      expect(state2).toBeDefined();
      expect(state1).not.toBe(state2);
    });
  });

  describe('Session Token Hashing', () => {
    test('should generate consistent hashes for same token', () => {
      const token = generateSessionToken();
      const hash1 = hashSessionToken(token);
      const hash2 = hashSessionToken(token);
      
      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64); // SHA256 hash = 64 hex chars
    });

    test('should generate different hashes for different tokens', () => {
      const token1 = generateSessionToken();
      const token2 = generateSessionToken();
      const hash1 = hashSessionToken(token1);
      const hash2 = hashSessionToken(token2);
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('Encryption Key Functions', () => {
    test('should generate valid encryption keys', () => {
      const key = generateEncryptionKey();
      
      expect(key).toBeDefined();
      expect(key).toHaveLength(64); // 32 bytes = 64 hex chars
      expect(key).toMatch(/^[0-9a-f]{64}$/);
      expect(validateEncryptionKey(key)).toBe(true);
    });

    test('should validate encryption keys correctly', () => {
      // Valid key
      const validKey = 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456';
      expect(validateEncryptionKey(validKey)).toBe(true);
      
      // Invalid keys
      expect(validateEncryptionKey('')).toBe(false);
      expect(validateEncryptionKey('short')).toBe(false);
      expect(validateEncryptionKey('a'.repeat(63))).toBe(false); // Too short
      expect(validateEncryptionKey('a'.repeat(65))).toBe(false); // Too long
      expect(validateEncryptionKey('g'.repeat(64))).toBe(false); // Invalid hex chars
      expect(validateEncryptionKey('a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345g')).toBe(false); // Invalid hex chars
    });
  });
});
