import { NextRequest, NextResponse } from 'next/server';
import { spotifyApi, validateSpotifyConfig } from '@/lib/spotify';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { createUserSession, createSessionToken } from '@/lib/session';

export async function GET(request: NextRequest) {
  console.log('=== Spotify OAuth Callback Route Called ===');
  console.log('Request URL:', request.url);
  console.log('User Agent:', request.headers.get('user-agent'));
  
  try {
    // Validate Spotify configuration at runtime
    console.log('Validating Spotify configuration...');
    validateSpotifyConfig();
    
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    
    console.log('OAuth callback parameters:');
    console.log('- code:', code ? 'PRESENT' : 'MISSING');
    console.log('- state:', state ? 'PRESENT' : 'MISSING');
    console.log('- error:', error || 'NONE');
    
    const cookieStore = await cookies();
    const storedState = cookieStore.get('spotify_state')?.value;
    console.log('- stored state:', storedState ? 'PRESENT' : 'MISSING');
    
    // Detailed state debugging
    if (storedState && state) {
      console.log('State comparison:');
      console.log('- received state:', state.substring(0, 10) + '...');
      console.log('- stored state:', storedState.substring(0, 10) + '...');
      console.log('- states match:', state === storedState);
    }

    if (error) {
      return NextResponse.redirect(new URL('/auth/error?error=access_denied', request.url));
    }

    if (!code || !state || !storedState) {
      console.log('Missing required parameters:', { code: !!code, state: !!state, storedState: !!storedState });
      return NextResponse.redirect(new URL('/auth/error?error=invalid_state', request.url));
    }

    if (state !== storedState) {
      console.log('State mismatch detected - this might be a cookie domain issue');
      return NextResponse.redirect(new URL('/auth/error?error=invalid_state', request.url));
    }

    // Exchange code for tokens
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token, expires_in } = data.body;

    // Get user profile
    spotifyApi.setAccessToken(access_token);
    const profile = await spotifyApi.getMe();
    const userData = profile.body;

    // Extract and validate required fields with safe fallbacks
    const email = userData.email ?? null;
    const displayName = userData.display_name ?? `spotify:${userData.id}`;
    const profileImage = Array.isArray(userData.images) && userData.images[0]?.url 
      ? userData.images[0].url 
      : null;
    const country = userData.country ?? null;
    const product = userData.product ?? null;
    const expiresIn = Number(expires_in) || 0;
    
    // Validate required fields
    if (!email) {
      return NextResponse.redirect(new URL('/auth/error?error=email_required', request.url));
    }

    // Create or update user
    const user = await prisma.user.upsert({
      where: { spotifyId: userData.id },
      update: {
        email,
        displayName,
        profileImage,
        country,
        product,
        accessToken: access_token, // Will be encrypted automatically
        refreshToken: refresh_token, // Will be encrypted automatically
        tokenExpiresAt: expiresIn > 0 ? new Date(Date.now() + expiresIn * 1000) : null,
      },
      create: {
        spotifyId: userData.id,
        email,
        displayName,
        profileImage,
        country,
        product,
        accessToken: access_token, // Will be encrypted automatically
        refreshToken: refresh_token, // Will be encrypted automatically
        tokenExpiresAt: expiresIn > 0 ? new Date(Date.now() + expiresIn * 1000) : null,
      },
    });

    // Create secure session
    const { sessionId } = await createUserSession(user.id);
    const jwtToken = createSessionToken(user.id, sessionId);

    // Clear state cookie
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    response.cookies.delete('spotify_state');
    
    // Set secure session cookie
    response.cookies.set('session', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Spotify OAuth error:', error);
    
    // Return a more user-friendly error response
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new NextResponse(
      JSON.stringify({ 
        error: 'Spotify authentication failed. Please try again or contact support.',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
