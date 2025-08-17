import { getCurrentUser } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Music, Play, Plus } from 'lucide-react';

export default async function SearchPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Discover Music</h1>
          <p className="text-gray-400 mt-2">
            Search for tracks, artists, and albums on Spotify
          </p>
        </div>
      </div>

      {/* Search Section */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Search className="w-5 h-5 mr-2 text-green-500" />
            Search Music
          </CardTitle>
          <CardDescription className="text-gray-400">
            Find your favorite tracks and discover new music
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search for songs, artists, or albums..."
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                id="search-input"
              />
            </div>
            <Button className="bg-green-500 hover:bg-green-600 text-white">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results Placeholder */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Search Results</CardTitle>
          <CardDescription className="text-gray-400">
            Your search results will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Music className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">Start searching to discover music</p>
            <p className="text-gray-500 text-sm">
              Search for any song, artist, or album to get started
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Popular Tracks Placeholder */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Popular Right Now</CardTitle>
          <CardDescription className="text-gray-400">
            Trending tracks on Spotify
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors">
                <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                  <Music className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Track Name {i}</p>
                  <p className="text-gray-400 text-sm">Artist Name • Album Name</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-gray-400 hover:text-green-400">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
