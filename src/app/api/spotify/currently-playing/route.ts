import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getCurrentlyPlaying } from '@/lib/spotify';

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!user.accessToken) {
      return NextResponse.json({ error: 'Spotify not connected' }, { status: 400 });
    }

    const currentTrack = await getCurrentlyPlaying(user.accessToken);
    
    if (!currentTrack || !currentTrack.item) {
      return NextResponse.json({ 
        is_playing: false,
        item: null 
      });
    }

    return NextResponse.json({
      is_playing: currentTrack.is_playing,
      progress_ms: currentTrack.progress_ms,
      item: {
        id: currentTrack.item.id,
        name: currentTrack.item.name,
        artists: currentTrack.item.artists?.map(artist => ({
          id: artist.id,
          name: artist.name
        })) || [],
        album: {
          id: currentTrack.item.album?.id,
          name: currentTrack.item.album?.name,
          images: currentTrack.item.album?.images || []
        },
        duration_ms: currentTrack.item.duration_ms,
        external_urls: currentTrack.item.external_urls
      }
    });
  } catch (error) {
    console.error('Error fetching currently playing:', error);
    return NextResponse.json(
      { error: 'Failed to fetch currently playing track' },
      { status: 500 }
    );
  }
}
