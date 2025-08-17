import { getCurrentUser } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Badge } from '@/components/ui/badge';
import { Play, Users, Plus, Music, Radio, Clock, Share } from 'lucide-react';

export default async function SessionsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Listening Sessions</h1>
          <p className="text-gray-400 mt-2">
            Join friends for synchronized music listening experiences
          </p>
        </div>
        <Button className="bg-green-500 hover:bg-green-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Start Session
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Radio className="w-5 h-5 mr-2 text-green-500" />
              Start New Session
            </CardTitle>
            <CardDescription className="text-gray-400">
              Create a new listening party for you and your friends
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Session Name
              </label>
              <Input
                placeholder="Friday Night Vibes"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Starting Playlist (Optional)
              </label>
              <Input
                placeholder="Select a playlist to start with..."
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
              <Play className="w-4 h-4 mr-2" />
              Start Session
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-500" />
              Join Session
            </CardTitle>
            <CardDescription className="text-gray-400">
              Enter a session code to join a friend&apos;s listening party
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Session Code
              </label>
              <Input
                placeholder="Enter 6-digit code..."
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 text-center text-lg tracking-widest"
                maxLength={6}
              />
            </div>
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              <Users className="w-4 h-4 mr-2" />
              Join Session
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Active Sessions */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Active Sessions</CardTitle>
          <CardDescription className="text-gray-400">
            Join ongoing listening parties from your friends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { 
                name: 'Friday Night Vibes', 
                host: 'John Doe', 
                participants: 5, 
                currentTrack: 'Bohemian Rhapsody - Queen',
                duration: '45 min'
              },
              { 
                name: 'Study Session', 
                host: 'Alice Smith', 
                participants: 3, 
                currentTrack: 'Lofi Hip Hop - Various Artists',
                duration: '2h 15min'
              },
              { 
                name: 'Workout Party', 
                host: 'Mike Johnson', 
                participants: 8, 
                currentTrack: 'Eye of the Tiger - Survivor',
                duration: '1h 20min'
              },
            ].map((session, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Radio className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-white font-medium">{session.name}</h3>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/20">
                      Live
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm">Hosted by {session.host}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1 text-gray-400 text-sm">
                      <Users className="w-4 h-4" />
                      <span>{session.participants} listening</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-400 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{session.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-green-400 text-sm mt-1">
                    <Music className="w-4 h-4" />
                    <span>{session.currentTrack}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                    <Share className="w-4 h-4" />
                  </Button>
                  <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                    Join
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Sessions */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Your Recent Sessions</CardTitle>
          <CardDescription className="text-gray-400">
            Sessions you&apos;ve hosted or joined recently
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Late Night Jazz', participants: 4, date: '2 hours ago' },
              { name: 'Throwback Thursday', participants: 7, date: 'Yesterday' },
              { name: 'New Music Discovery', participants: 3, date: '3 days ago' },
            ].map((session, i) => (
              <div key={i} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-700/20">
                <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                  <Radio className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{session.name}</p>
                  <p className="text-gray-400 text-sm">{session.participants} participants • {session.date}</p>
                </div>
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
