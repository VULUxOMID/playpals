# Security Setup Guide

## Environment Variables Required

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/playpals"

# Spotify API
SPOTIFY_CLIENT_ID="your_spotify_client_id"
SPOTIFY_CLIENT_SECRET="your_spotify_client_secret"
SPOTIFY_REDIRECT_URI="http://localhost:3000/api/auth/callback/spotify"

# Security Keys (Generate these securely)
FIELD_ENCRYPTION_KEY="your-32-character-encryption-key-here"
JWT_SECRET="your-jwt-secret-key-here"
SESSION_SECRET="your-session-secret-key-here"

# Environment
NODE_ENV="development"
```

## Generating Secure Keys

### Field Encryption Key
Generate a 32-byte (256-bit) encryption key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### JWT Secret
Generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Session Secret
Generate a session secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Security Features Implemented

### 1. Field-Level Encryption
- Spotify access and refresh tokens are encrypted at rest using `prisma-field-encryption`
- Encryption key is stored in environment variables
- Automatic encryption/decryption on database operations

### 2. Secure Session Management
- JWT tokens for session authentication
- Database-backed session storage with expiration
- Secure session token generation using crypto.randomBytes()
- Session invalidation on logout

### 3. OAuth Security
- Cryptographically secure state generation for OAuth flows
- State validation to prevent CSRF attacks
- Secure cookie settings (httpOnly, secure, sameSite)

### 4. Input Validation
- Safe fallbacks for optional Spotify profile fields
- Email validation before user creation
- Proper error handling without information leakage

## Key Rotation

### Field Encryption Key Rotation
1. Generate new encryption key
2. Update environment variable
3. Re-encrypt existing data (migration script needed)
4. Deploy with new key

### JWT Secret Rotation
1. Generate new JWT secret
2. Update environment variable
3. Deploy - existing sessions will be invalidated

## Production Deployment Checklist

- [ ] Set all environment variables with secure values
- [ ] Use HTTPS in production
- [ ] Set NODE_ENV=production
- [ ] Configure secure cookie settings
- [ ] Set up database with proper access controls
- [ ] Implement rate limiting
- [ ] Set up monitoring and logging
- [ ] Regular security audits

## Testing Security Features

### Test Field Encryption
```typescript
// Verify tokens are encrypted in database
const user = await prisma.user.findFirst();
console.log('Raw access token:', user?.accessToken); // Should be encrypted
```

### Test Session Security
```typescript
// Verify session validation
const session = await validateSession(sessionToken);
console.log('Session valid:', !!session);
```

### Test OAuth State
```typescript
// Verify secure state generation
const state = generateSecureState();
console.log('State length:', state.length); // Should be 22 characters
```
