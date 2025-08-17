import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from './db';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session')?.value;
  
  if (!sessionId) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: sessionId },
    });
    
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth/login');
  }
  
  return user;
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

export async function refreshUserToken(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user?.refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const { spotifyApi } = await import('./spotify');
    spotifyApi.setRefreshToken(user.refreshToken);
    
    const data = await spotifyApi.refreshAccessToken();
    const { access_token, expires_in } = data.body;

    // Update user with new token
    await prisma.user.update({
      where: { id: userId },
      data: {
        accessToken: access_token,
        tokenExpiresAt: new Date(Date.now() + expires_in * 1000),
      },
    });

    return access_token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
}

export async function getValidAccessToken(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user?.accessToken) {
    throw new Error('No access token available');
  }

  // Check if token is expired (with 5 minute buffer)
  if (user.tokenExpiresAt && user.tokenExpiresAt.getTime() - 5 * 60 * 1000 < Date.now()) {
    return await refreshUserToken(userId);
  }

  return user.accessToken;
}
