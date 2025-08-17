import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { searchTracks } from '@/lib/spotify';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!user.accessToken) {
      return NextResponse.json({ error: 'Spotify not connected' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    const results = await searchTracks(user.accessToken, query, limit);
    
    return NextResponse.json({
      tracks: {
        items: results.tracks?.items?.map(track => ({
          id: track.id,
          name: track.name,
          artists: track.artists?.map(artist => ({
            id: artist.id,
            name: artist.name
          })) || [],
          album: {
            id: track.album?.id,
            name: track.album?.name,
            images: track.album?.images || []
          },
          duration_ms: track.duration_ms,
          popularity: track.popularity,
          preview_url: track.preview_url,
          external_urls: track.external_urls,
          uri: track.uri
        })) || [],
        total: results.tracks?.total || 0,
        limit: results.tracks?.limit || limit,
        offset: results.tracks?.offset || 0
      }
    });
  } catch (error) {
    console.error('Error searching tracks:', error);
    return NextResponse.json(
      { error: 'Failed to search tracks' },
      { status: 500 }
    );
  }
}
