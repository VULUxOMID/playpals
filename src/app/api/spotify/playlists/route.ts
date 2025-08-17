import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getUserPlaylists } from '@/lib/spotify';

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
    
    // Parse and validate limit with safe defaults
    const limitParam = searchParams.get('limit');
    let limit = parseInt(limitParam || '20', 10);
    if (!Number.isFinite(limit) || limit < 1) {
      limit = 20;
    } else if (limit > 50) {
      limit = 50;
    }
    
    // Parse and validate offset with safe defaults
    const offsetParam = searchParams.get('offset');
    let offset = parseInt(offsetParam || '0', 10);
    if (!Number.isFinite(offset) || offset < 0) {
      offset = 0;
    }

    const playlists = await getUserPlaylists(user.accessToken, limit, offset);
    
    return NextResponse.json({
      items: playlists.items?.map(playlist => ({
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        public: playlist.public,
        collaborative: playlist.collaborative,
        tracks: {
          total: playlist.tracks?.total || 0
        },
        images: playlist.images || [],
        external_urls: playlist.external_urls,
        owner: {
          id: playlist.owner?.id,
          display_name: playlist.owner?.display_name
        }
      })) || [],
      total: playlists.total || 0,
      limit: playlists.limit || limit,
      offset: playlists.offset || offset
    });
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch playlists' },
      { status: 500 }
    );
  }
}
