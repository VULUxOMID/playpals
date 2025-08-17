import { getCurrentUser } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, Plus, Users, Music, Play, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

export default async function PlaylistsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Your Playlists</h1>
          <p className="text-gray-400 mt-2">
            Manage your playlists and create new collaborative ones
          </p>
        </div>
        <Link href="/dashboard/create-playlist">
          <Button className="bg-green-500 hover:bg-green-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Playlist
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">12</p>
                <p className="text-gray-400 text-sm">Total Playlists</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">5</p>
                <p className="text-gray-400 text-sm">Collaborative</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Music className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">247</p>
                <p className="text-gray-400 text-sm">Total Tracks</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Playlists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Chill Vibes', tracks: 23, collaborative: true, collaborators: ['JD', 'AS'] },
          { name: 'Workout Mix', tracks: 45, collaborative: false, collaborators: [] },
          { name: 'Road Trip Hits', tracks: 67, collaborative: true, collaborators: ['MJ', 'SW', 'ED'] },
          { name: 'Study Focus', tracks: 34, collaborative: false, collaborators: [] },
          { name: 'Party Anthems', tracks: 89, collaborative: true, collaborators: ['AS', 'TM'] },
          { name: 'Late Night Jazz', tracks: 28, collaborative: false, collaborators: [] },
        ].map((playlist, i) => (
          <Card key={i} className="bg-gray-800/50 border-gray-700 hover:border-green-500/50 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <Music className="w-8 h-8 text-white" />
                </div>
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
              <CardTitle className="text-white">{playlist.name}</CardTitle>
              <CardDescription className="text-gray-400">
                {playlist.tracks} tracks
                {playlist.collaborative && (
                  <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-500/20">
                    Collaborative
                  </Badge>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {playlist.collaborators.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <div className="flex -space-x-2">
                        {playlist.collaborators.slice(0, 3).map((collab, j) => (
                          <Avatar key={j} className="h-6 w-6 border-2 border-gray-800">
                            <AvatarFallback className="text-xs">{collab}</AvatarFallback>
                          </Avatar>
                        ))}
                        {playlist.collaborators.length > 3 && (
                          <div className="h-6 w-6 bg-gray-600 rounded-full border-2 border-gray-800 flex items-center justify-center">
                            <span className="text-xs text-gray-300">+{playlist.collaborators.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-green-400">
                  <Play className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
