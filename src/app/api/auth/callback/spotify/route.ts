import { NextRequest, NextResponse } from 'next/server';
import { spotifyApi } from '@/lib/spotify';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  
  const cookieStore = await cookies();
  const storedState = cookieStore.get('spotify_state')?.value;

  if (error) {
    return NextResponse.redirect(new URL('/auth/error?error=access_denied', request.url));
  }

  if (!code || !state || !storedState || state !== storedState) {
    return NextResponse.redirect(new URL('/auth/error?error=invalid_state', request.url));
  }

  try {
    // Exchange code for tokens
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token, expires_in } = data.body;

    // Get user profile
    spotifyApi.setAccessToken(access_token);
    const profile = await spotifyApi.getMe();
    const userData = profile.body;

    // Create or update user
    const user = await prisma.user.upsert({
      where: { spotifyId: userData.id },
      update: {
        email: userData.email,
        displayName: userData.display_name,
        profileImage: userData.images?.[0]?.url,
        country: userData.country,
        product: userData.product,
        accessToken: access_token, // In production, encrypt this
        refreshToken: refresh_token, // In production, encrypt this
        tokenExpiresAt: new Date(Date.now() + expires_in * 1000),
      },
      create: {
        spotifyId: userData.id,
        email: userData.email,
        displayName: userData.display_name,
        profileImage: userData.images?.[0]?.url,
        country: userData.country,
        product: userData.product,
        accessToken: access_token, // In production, encrypt this
        refreshToken: refresh_token, // In production, encrypt this
        tokenExpiresAt: new Date(Date.now() + expires_in * 1000),
      },
    });

    // Clear state cookie
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    response.cookies.delete('spotify_state');
    
    // Set session cookie
    response.cookies.set('session', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Spotify OAuth error:', error);
    return NextResponse.redirect(new URL('/auth/error?error=oauth_error', request.url));
  }
}
