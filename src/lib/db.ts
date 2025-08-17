import { PrismaClient, ActivityType } from '../generated/prisma';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
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
