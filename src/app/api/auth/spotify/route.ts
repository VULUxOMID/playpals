import { NextRequest, NextResponse } from 'next/server';
import { spotifyApi } from '@/lib/spotify';

export async function GET(request: NextRequest) {
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

  const state = Math.random().toString(36).substring(7);
  
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
