// Test setup file
process.env.NODE_ENV = 'test';
process.env.FIELD_ENCRYPTION_KEY = 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456'; // 64 hex chars for testing
process.env.JWT_SECRET = 'b1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456'; // 128 hex chars for testing
process.env.SESSION_SECRET = 'c1c2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456'; // 64 hex chars for testing
