import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getSpotifyProfile } from '@/lib/spotify';

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!user.accessToken) {
      return NextResponse.json({ error: 'Spotify not connected' }, { status: 400 });
    }

    const profile = await getSpotifyProfile(user.accessToken);
    
    return NextResponse.json({
      id: profile.id,
      display_name: profile.display_name,
      email: profile.email,
      country: profile.country,
      product: profile.product,
      followers: profile.followers?.total || 0,
      images: profile.images,
    });
  } catch (error) {
    console.error('Error fetching Spotify profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Spotify profile' },
      { status: 500 }
    );
  }
}
