import crypto from 'crypto';

// Core security functions without Prisma dependencies
function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function generateSecureState(): string {
  return crypto.randomBytes(16).toString('base64url');
}

function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString('hex');
}

function validateEncryptionKey(key: string): boolean {
  // Check if key is a valid hex string with exactly 64 characters (32 bytes)
  if (!key || !/^[0-9a-fA-F]{64}$/.test(key)) {
    return false;
  }
  
  try {
    // Verify the hex decodes to exactly 32 bytes
    const buffer = Buffer.from(key, 'hex');
    return buffer.length === 32;
  } catch {
    return false;
  }
}

function hashSessionToken(token: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(token).digest('hex');
}

describe('Core Security Functions', () => {
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

  describe('Secure State Generation', () => {
    test('should generate unique secure states', () => {
      const state1 = generateSecureState();
      const state2 = generateSecureState();
      
      expect(state1).toBeDefined();
      expect(state2).toBeDefined();
      expect(state1).not.toBe(state2);
      expect(state1).toMatch(/^[A-Za-z0-9_-]+$/); // base64url safe
    });
  });

  describe('Session Token Hashing', () => {
    test('should generate consistent hashes for same token', () => {
      const token = generateSessionToken();
      const secret = 'test-secret';
      const hash1 = hashSessionToken(token, secret);
      const hash2 = hashSessionToken(token, secret);
      
      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64); // SHA256 hash = 64 hex chars
    });

    test('should generate different hashes for different tokens', () => {
      const token1 = generateSessionToken();
      const token2 = generateSessionToken();
      const secret = 'test-secret';
      const hash1 = hashSessionToken(token1, secret);
      const hash2 = hashSessionToken(token2, secret);
      
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
