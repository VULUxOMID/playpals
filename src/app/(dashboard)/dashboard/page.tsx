import { currentUser } from '@clerk/nextjs/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Music, Users, Heart, TrendingUp, Play, Clock, Plus, Search } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {user.firstName || user.username || 'Music Lover'}! 🎵
          </h1>
          <p className="text-gray-400 mt-2">
            Ready to discover some amazing music with your friends?
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
            <Play className="w-4 h-4 mr-2" />
            Ready to Listen
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Playlists</CardTitle>
            <Heart className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12</div>
            <p className="text-xs text-gray-400">+2 this week</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Friends</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">8</div>
            <p className="text-xs text-gray-400">+1 this month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Tracks Played</CardTitle>
            <Music className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1,247</div>
            <p className="text-xs text-gray-400">+89 this week</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Listening Time</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">42h</div>
            <p className="text-xs text-gray-400">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <CardDescription className="text-gray-400">
              What's happening in your music world
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm text-white">
                  <span className="font-medium">John Doe</span> started listening to{' '}
                  <span className="text-green-400">"Bohemian Rhapsody"</span>
                </p>
                <p className="text-xs text-gray-400">2 minutes ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback>AS</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm text-white">
                  <span className="font-medium">Alice Smith</span> added{' '}
                  <span className="text-green-400">"Shape of You"</span> to your playlist
                </p>
                <p className="text-xs text-gray-400">15 minutes ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback>MJ</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm text-white">
                  <span className="font-medium">Mike Johnson</span> joined your listening session
                </p>
                <p className="text-xs text-gray-400">1 hour ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-gray-400">
              Get started with these quick actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link 
              href="/dashboard/create-playlist"
              className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
            >
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-white font-medium">Create New Playlist</p>
                <p className="text-sm text-gray-400">Start a collaborative playlist</p>
              </div>
            </Link>

            <Link 
              href="/dashboard/search"
              className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-white font-medium">Discover Music</p>
                <p className="text-sm text-gray-400">Find new tracks and artists</p>
              </div>
            </Link>

            <Link 
              href="/dashboard/friends"
              className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
            >
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-white font-medium">Find Friends</p>
                <p className="text-sm text-gray-400">Connect with music lovers</p>
              </div>
            </Link>

            <Link 
              href="/dashboard/sessions"
              className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
            >
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-white font-medium">Start Listening Session</p>
                <p className="text-sm text-gray-400">Listen together with friends</p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Currently Playing */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Currently Playing</CardTitle>
          <CardDescription className="text-gray-400">
            What you're listening to right now
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center">
              <Music className="w-8 h-8 text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Not currently playing</p>
              <p className="text-sm text-gray-400">Connect your Spotify account to see what you're listening to</p>
            </div>
            <Link 
              href="/connect-spotify"
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              Connect Spotify
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
