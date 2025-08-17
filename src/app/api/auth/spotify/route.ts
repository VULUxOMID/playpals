import { NextRequest, NextResponse } from 'next/server';
import { spotifyApi, validateSpotifyConfig } from '@/lib/spotify';
import { generateSecureState } from '@/lib/session';

export async function GET(request: NextRequest) {
  console.log('=== Spotify OAuth Route Called ===');
  console.log('Request URL:', request.url);
  console.log('User Agent:', request.headers.get('user-agent'));
  
  try {
    // Validate Spotify configuration at runtime
    console.log('Validating Spotify configuration...');
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
  console.log('Generated state:', state);
  
  // Create authorize URL
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
  console.log('Spotify authorize URL:', authorizeURL);
  
  // Store state in session/cookie for security
  const response = NextResponse.redirect(authorizeURL);
  response.cookies.set('spotify_state', state, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10 // 10 minutes
  });
  
  console.log('Redirecting to Spotify OAuth...');
  return response;
  } catch (error) {
    console.error('Spotify OAuth initialization error:', error);
    
    // Return a more user-friendly error response
    return new NextResponse(
      JSON.stringify({ 
        error: 'Spotify authentication is not properly configured. Please contact support.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
