import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from './db';
import crypto from 'crypto';

// Environment variable validation with production guards
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (process.env.NODE_ENV === 'production') {
    if (!secret) {
      console.error('JWT_SECRET is required in production');
      process.exit(1);
    }
    return secret;
  }
  return secret || 'default-jwt-secret-for-development-only';
}

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (process.env.NODE_ENV === 'production') {
    if (!secret) {
      console.error('SESSION_SECRET is required in production');
      process.exit(1);
    }
    return secret;
  }
  return secret || 'default-session-secret-for-development-only';
}

const JWT_SECRET = getJwtSecret();
const SESSION_SECRET = getSessionSecret();

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
  return crypto.createHmac('sha256', SESSION_SECRET).update(token).digest('hex');
}

// Generate a cryptographically secure state for OAuth
export function generateSecureState(): string {
  return crypto.randomBytes(16).toString('base64url');
}

// Create a JWT session token
export function createSessionToken(userId: string, sessionId: string): string {
  const payload: Omit<SessionPayload, 'iat' | 'exp'> = {
    userId,
    sessionId,
  };
  
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: '7d',
    issuer: 'playpals',
    audience: 'playpals-users',
    algorithm: 'HS256'
  });
}

// Verify and decode a JWT session token
export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
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
    
    await prisma.userSession.update({
      where: { sessionTokenHash },
      data: { isActive: false },
    });
    return true;
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
