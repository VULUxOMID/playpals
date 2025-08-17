
import jwt from 'jsonwebtoken';
import { prisma } from './db';
import crypto from 'crypto';

// Lazy secret resolution to ensure checks run at call time
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  
  // In production, require the secret unless explicitly allowed for build
  if (process.env.NODE_ENV === 'production') {
    if (!secret && process.env.ALLOW_BUILD_PLACEHOLDER_JWT !== 'true') {
      throw new Error('JWT_SECRET is required in production. Set ALLOW_BUILD_PLACEHOLDER_JWT=true only for build processes.');
    }
    return secret || 'placeholder-jwt-secret-for-build-only';
  }
  
  // In development, provide a default if missing
  return secret || 'default-jwt-secret-for-development-only';
}

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  
  // In production, require the secret unless explicitly allowed for build
  if (process.env.NODE_ENV === 'production') {
    if (!secret && process.env.ALLOW_BUILD_PLACEHOLDER_JWT !== 'true') {
      throw new Error('SESSION_SECRET is required in production. Set ALLOW_BUILD_PLACEHOLDER_JWT=true only for build processes.');
    }
    return secret || 'placeholder-session-secret-for-build-only';
  }
  
  // In development, provide a default if missing
  return secret || 'default-session-secret-for-development-only';
}

export interface SessionPayload {
  userId: string;
  sessionId: string;
  iat: number;
  exp: number;
}

// Generate a cryptographically secure session token
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Generate HMAC hash of session token
export function hashSessionToken(token: string): string {
  const sessionSecret = getSessionSecret();
  return crypto.createHmac('sha256', sessionSecret).update(token).digest('hex');
}

// Generate a cryptographically secure state for OAuth
export function generateSecureState(): string {
  return crypto.randomBytes(16).toString('base64url');
}

// Create a JWT session token
export function createSessionToken(userId: string, sessionId: string): string {
  const jwtSecret = getJwtSecret();
  const payload: Omit<SessionPayload, 'iat' | 'exp'> = {
    userId,
    sessionId,
  };
  
  return jwt.sign(payload, jwtSecret, { 
    expiresIn: '7d',
    issuer: 'playpals',
    audience: 'playpals-users',
    algorithm: 'HS256'
  });
}

// Verify and decode a JWT session token
export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const jwtSecret = getJwtSecret();
    const decoded = jwt.verify(token, jwtSecret, {
      issuer: 'playpals',
      audience: 'playpals-users',
      algorithms: ['HS256']
    }) as SessionPayload;
    
    return decoded;
  } catch (error) {
    console.error('Session token verification failed:', error);
    return null;
  }
}

// Create a new session in the database
export async function createUserSession(userId: string): Promise<{ sessionToken: string; sessionId: string }> {
  const sessionToken = generateSessionToken();
  const sessionTokenHash = hashSessionToken(sessionToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  const session = await prisma.userSession.create({
    data: {
      userId,
      sessionTokenHash,
      expiresAt,
    },
  });
  
  return { sessionToken, sessionId: session.id };
}

// Validate a session token and return user info
export async function validateSession(sessionToken: string): Promise<{ userId: string; sessionId: string } | null> {
  try {
    const sessionTokenHash = hashSessionToken(sessionToken);
    
    const session = await prisma.userSession.findUnique({
      where: { sessionTokenHash },
      include: { user: true },
    });
    
    if (!session || !session.isActive || session.expiresAt < new Date()) {
      return null;
    }
    
    // Update last used timestamp
    await prisma.userSession.update({
      where: { id: session.id },
      data: { lastUsedAt: new Date() },
    });
    
    return { userId: session.userId, sessionId: session.id };
  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
}

// Invalidate a session
export async function invalidateSession(sessionToken: string): Promise<boolean> {
  try {
    const sessionTokenHash = hashSessionToken(sessionToken);
    
    const result = await prisma.userSession.updateMany({
      where: { sessionTokenHash },
      data: { isActive: false },
    });
    return result.count > 0;
  } catch (error) {
    console.error('Session invalidation error:', error);
    return false;
  }
}

// Clean up expired sessions
export async function cleanupExpiredSessions(): Promise<number> {
  try {
    const result = await prisma.userSession.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
    return result.count;
  } catch (error) {
    console.error('Session cleanup error:', error);
    return 0;
  }
}
