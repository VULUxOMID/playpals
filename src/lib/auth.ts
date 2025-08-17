import { auth, signIn, signOut, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function requireAuth() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }
  
  return userId;
}

export async function getCurrentUser() {
  const user = await currentUser();
  return user;
}

export async function requireSpotifyAuth() {
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in');
  }
  
  // Check if user has connected Spotify
  const spotifyConnected = user.externalAccounts?.some(
    account => account.provider === 'spotify'
  );
  
  if (!spotifyConnected) {
    redirect('/connect-spotify');
  }
  
  return user;
}
