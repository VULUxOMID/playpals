import { PrismaClient } from '../generated/prisma';
import { fieldEncryptionMiddleware } from 'prisma-field-encryption';
import crypto from 'crypto';

// Validate encryption key at startup
function validateAndGetEncryptionKey(): string {
  const key = process.env.FIELD_ENCRYPTION_KEY;
  
  if (!key) {
    if (process.env.NODE_ENV === 'production') {
      console.error('FIELD_ENCRYPTION_KEY is required in production');
      process.exit(1);
    } else {
      throw new Error('FIELD_ENCRYPTION_KEY environment variable is required. Generate one using: npm run generate-keys');
    }
  }
  
  if (!validateEncryptionKey(key)) {
    throw new Error('Invalid FIELD_ENCRYPTION_KEY format. Must be 64 hex characters (32 bytes)');
  }
  
  return key;
}

// Initialize Prisma client
const prisma = new PrismaClient();

// Configure field encryption middleware only if encryption key is available
if (process.env.NODE_ENV !== 'production' || process.env.FIELD_ENCRYPTION_KEY) {
  try {
    prisma.$use(
      fieldEncryptionMiddleware({
        // Fields to encrypt
        fields: ['accessToken', 'refreshToken'],
        // Encryption key from environment variable
        encryptionKey: validateAndGetEncryptionKey(),
      })
    );
  } catch (error) {
    console.warn('Field encryption middleware not configured:', error.message);
  }
}

export { prisma };

// Utility functions for encryption/decryption
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function validateEncryptionKey(key: string): boolean {
  // Check if key is a valid hex string with exactly 64 characters (32 bytes)
  if (!key || !/^[0-9a-fA-F]{64}$/.test(key)) {
    return false;
  }
  
  try {
    // Verify the hex decodes to exactly 32 bytes
    const buffer = Buffer.from(key, 'hex');
    return buffer.length === 32;
  } catch (error) {
    return false;
  }
}

// Database utility functions
export async function getUserBySpotifyId(spotifyId: string) {
  return await prisma.user.findUnique({
    where: { spotifyId },
    include: {
      playlists: true,
      friends: {
        include: {
          friend: true,
        },
      },
      friendsOf: {
        include: {
          user: true,
        },
      },
    },
  });
}

export async function createUser(data: {
  spotifyId: string;
  email: string;
  displayName: string;
  profileImage?: string;
  country?: string;
  product?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
}) {
  return await prisma.user.create({
    data,
    include: {
      playlists: true,
    },
  });
}

export async function updateUser(spotifyId: string, data: Partial<{
  email: string;
  displayName: string;
  profileImage: string;
  country: string;
  product: string;
  accessToken: string;
  refreshToken: string;
  tokenExpiresAt: Date;
}>) {
  return await prisma.user.update({
    where: { spotifyId },
    data,
    include: {
      playlists: true,
    },
  });
}

export async function getOrCreateUser(spotifyId: string, userData: {
  email: string;
  displayName: string;
  profileImage?: string;
  country?: string;
  product?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
}) {
  let user = await getUserBySpotifyId(spotifyId);
  
  if (!user) {
    user = await createUser({
      spotifyId,
      ...userData,
    });
  }
  
  return user;
}

export async function getPlaylistsByUserId(userId: string) {
  return await prisma.playlist.findMany({
    where: { ownerId: userId },
    include: {
      tracks: {
        include: {
          track: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function getFriendsByUserId(userId: string) {
  return await prisma.friend.findMany({
    where: {
      OR: [
        { userId },
        { friendId: userId },
      ],
      status: 'ACCEPTED',
    },
    include: {
      user: true,
      friend: true,
    },
  });
}

export async function createActivity(data: {
  userId: string;
  type: ActivityType;
  data: Record<string, unknown>;
}) {
  return await prisma.activity.create({
    data: {
      userId: data.userId,
      type: data.type,
      data: data.data,
    },
    include: {
      user: true,
    },
  });
}

export async function getRecentActivity(limit = 20) {
  return await prisma.activity.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
    },
  });
}
