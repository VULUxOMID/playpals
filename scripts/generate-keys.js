#!/usr/bin/env node

const crypto = require('crypto');

console.log('🔐 Generating secure keys for Playpals...\n');

// Generate field encryption key (32 bytes = 256 bits)
const fieldEncryptionKey = crypto.randomBytes(32).toString('hex');
console.log('FIELD_ENCRYPTION_KEY=' + fieldEncryptionKey);

// Generate JWT secret (64 bytes = 512 bits)
const jwtSecret = crypto.randomBytes(64).toString('hex');
console.log('JWT_SECRET=' + jwtSecret);

// Generate session secret (32 bytes = 256 bits)
const sessionSecret = crypto.randomBytes(32).toString('hex');
console.log('SESSION_SECRET=' + sessionSecret);

console.log('\n📝 Copy these values to your .env file');
console.log('⚠️  Keep these keys secure and never commit them to version control');
console.log('🔄 For production, generate new keys and rotate existing ones');
