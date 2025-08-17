import { getCurrentUser } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Lock, Globe, Music, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function CreatePlaylistPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" asChild>
          <Link href="/dashboard/playlists">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Playlists
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">Create New Playlist</h1>
          <p className="text-gray-400 mt-2">
            Start a new playlist and invite friends to collaborate
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Playlist Details */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Playlist Details</CardTitle>
            <CardDescription className="text-gray-400">
              Set up your new playlist
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Playlist Name *
              </label>
              <Input
                placeholder="My Awesome Playlist"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <Input
                placeholder="A collection of my favorite songs..."
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Privacy Settings
              </label>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/30 border border-gray-600 cursor-pointer hover:bg-gray-700/50 transition-colors">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">Public</p>
                    <p className="text-gray-400 text-sm">Anyone can find and listen to this playlist</p>
                  </div>
                  <input type="radio" name="privacy" value="public" className="text-green-500" defaultChecked />
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/30 border border-gray-600 cursor-pointer hover:bg-gray-700/50 transition-colors">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">Collaborative</p>
                    <p className="text-gray-400 text-sm">Friends can add and remove tracks</p>
                  </div>
                  <input type="radio" name="privacy" value="collaborative" className="text-blue-500" />
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/30 border border-gray-600 cursor-pointer hover:bg-gray-700/50 transition-colors">
                  <div className="w-10 h-10 bg-gray-500/20 rounded-lg flex items-center justify-center">
                    <Lock className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">Private</p>
                    <p className="text-gray-400 text-sm">Only you can access this playlist</p>
                  </div>
                  <input type="radio" name="privacy" value="private" className="text-gray-500" />
                </div>
              </div>
            </div>

            <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Playlist
            </Button>
          </CardContent>
        </Card>

        {/* Playlist Preview */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Preview</CardTitle>
            <CardDescription className="text-gray-400">
              How your playlist will look
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Music className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">My Awesome Playlist</h3>
                  <p className="text-gray-400">Created by {user.displayName}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/20">
                      Public
                    </Badge>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/20">
                      0 tracks
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <div className="text-center py-8">
                  <Music className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">No tracks yet</p>
                  <p className="text-gray-500 text-sm">Start adding music to your playlist</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Template Playlists */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Quick Start Templates</CardTitle>
          <CardDescription className="text-gray-400">
            Create a playlist from popular templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Workout Mix', icon: '💪', description: 'High-energy tracks for exercise' },
              { name: 'Chill Vibes', icon: '🌊', description: 'Relaxing music for downtime' },
              { name: 'Road Trip', icon: '🚗', description: 'Perfect songs for long drives' },
              { name: 'Focus Mode', icon: '🎯', description: 'Instrumental tracks for productivity' },
            ].map((template, i) => (
              <div key={i} className="p-4 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors cursor-pointer border border-gray-600">
                <div className="text-center">
                  <div className="text-3xl mb-2">{template.icon}</div>
                  <h4 className="text-white font-medium mb-1">{template.name}</h4>
                  <p className="text-gray-400 text-xs">{template.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
