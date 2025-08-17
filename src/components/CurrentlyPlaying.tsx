'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Music } from 'lucide-react';
import Image from 'next/image';

interface CurrentTrack {
  is_playing: boolean;
  progress_ms: number;
  item: {
    id: string;
    name: string;
    artists: Array<{ id: string; name: string }>;
    album: {
      id: string;
      name: string;
      images: Array<{ url: string; height: number; width: number }>;
    };
    duration_ms: number;
    external_urls: { spotify: string };
  } | null;
}

export default function CurrentlyPlaying() {
  const [currentTrack, setCurrentTrack] = useState<CurrentTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentTrack = async () => {
      try {
        const response = await fetch('/api/spotify/currently-playing');
        if (response.ok) {
          const data = await response.json();
          setCurrentTrack(data);
        } else if (response.status === 401) {
          setError('Please log in to see your current track');
        } else {
          setError('Failed to fetch current track');
        }
      } catch {
        setError('Failed to connect to Spotify');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentTrack();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchCurrentTrack, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Currently Playing</CardTitle>
          <CardDescription className="text-gray-400">
            Loading your current track...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center animate-pulse">
              <Music className="w-8 h-8 text-gray-400" />
            </div>
            <div className="flex-1">
              <div className="h-4 bg-gray-600 rounded animate-pulse mb-2"></div>
              <div className="h-3 bg-gray-700 rounded animate-pulse w-2/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Currently Playing</CardTitle>
          <CardDescription className="text-gray-400">
            What you&apos;re listening to right now
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center">
              <Music className="w-8 h-8 text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Unable to connect</p>
              <p className="text-sm text-gray-400">{error}</p>
            </div>
            <a 
              href="https://open.spotify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              Open Spotify
            </a>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentTrack?.is_playing || !currentTrack?.item) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Currently Playing</CardTitle>
          <CardDescription className="text-gray-400">
            What you&apos;re listening to right now
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center">
              <Music className="w-8 h-8 text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Not currently playing</p>
              <p className="text-sm text-gray-400">Start playing music on Spotify to see it here</p>
            </div>
            <a 
              href="https://open.spotify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              Open Spotify
            </a>
          </div>
        </CardContent>
      </Card>
    );
  }

  const track = currentTrack.item;
  const progress = ((currentTrack.progress_ms || 0) / track.duration_ms) * 100;

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          Currently Playing
          <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </CardTitle>
        <CardDescription className="text-gray-400">
          What you&apos;re listening to right now
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-600 flex-shrink-0">
            {track.album.images[0] ? (
              <Image 
                src={track.album.images[0].url} 
                alt={track.album.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Music className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium truncate">{track.name}</h3>
            <p className="text-gray-400 text-sm truncate">
              {track.artists.map(artist => artist.name).join(', ')} • {track.album.name}
            </p>
            <div className="mt-2">
              <div className="w-full bg-gray-700 rounded-full h-1">
                <div 
                  className="bg-green-500 h-1 rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{Math.floor((currentTrack.progress_ms || 0) / 60000)}:{String(Math.floor(((currentTrack.progress_ms || 0) % 60000) / 1000)).padStart(2, '0')}</span>
                <span>{Math.floor(track.duration_ms / 60000)}:{String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <a 
              href={track.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
            >
              Open in Spotify
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
