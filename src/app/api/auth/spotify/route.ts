import { NextRequest, NextResponse } from 'next/server';
import { spotifyApi, validateSpotifyConfig } from '@/lib/spotify';
import { generateSecureState } from '@/lib/session';

export async function GET(request: NextRequest) {
  // Validate Spotify configuration at runtime
  validateSpotifyConfig();
  
  const scopes = [
    'user-read-private',
    'user-read-email',
    'user-read-playback-state',
    'user-modify-playback-state',
    'playlist-read-private',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-read-recently-played',
    'user-top-read',
    'user-read-currently-playing',
    'streaming',
    'user-library-read',
    'user-library-modify',
  ];

  const state = generateSecureState();
  
  // Store state in session/cookie for security
  const response = NextResponse.redirect(spotifyApi.createAuthorizeURL(scopes, state));
  response.cookies.set('spotify_state', state, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10 // 10 minutes
  });
  
  return response;
}
