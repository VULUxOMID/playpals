import { getCurrentUser } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Search, Music, Play } from 'lucide-react';

export default async function FriendsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Friends</h1>
          <p className="text-gray-400 mt-2">
            Connect with friends and see what they&apos;re listening to
          </p>
        </div>
        <Button className="bg-green-500 hover:bg-green-600 text-white">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Friends
        </Button>
      </div>

      {/* Add Friends Section */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <UserPlus className="w-5 h-5 mr-2 text-green-500" />
            Find Friends
          </CardTitle>
          <CardDescription className="text-gray-400">
            Search for friends by Spotify username or email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search by username or email..."
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <Button className="bg-green-500 hover:bg-green-600 text-white">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Friends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Friends List */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-500" />
              Your Friends ({8})
            </CardTitle>
            <CardDescription className="text-gray-400">
              People you&apos;re connected with
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'John Doe', status: 'online', track: 'Bohemian Rhapsody - Queen' },
                { name: 'Alice Smith', status: 'listening', track: 'Shape of You - Ed Sheeran' },
                { name: 'Mike Johnson', status: 'offline', track: null },
                { name: 'Sarah Wilson', status: 'listening', track: 'Blinding Lights - The Weeknd' },
              ].map((friend, i) => (
                <div key={i} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{friend.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-white font-medium">{friend.name}</p>
                      <Badge 
                        variant={friend.status === 'online' ? 'default' : friend.status === 'listening' ? 'secondary' : 'outline'}
                        className={
                          friend.status === 'online' 
                            ? 'bg-green-500/20 text-green-400 border-green-500/20' 
                            : friend.status === 'listening'
                            ? 'bg-blue-500/20 text-blue-400 border-blue-500/20'
                            : 'bg-gray-500/20 text-gray-400 border-gray-500/20'
                        }
                      >
                        {friend.status === 'listening' ? 'Listening' : friend.status}
                      </Badge>
                    </div>
                    {friend.track && (
                      <p className="text-gray-400 text-sm flex items-center">
                        <Music className="w-3 h-3 mr-1" />
                        {friend.track}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {friend.status === 'listening' && (
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-green-400">
                        <Play className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Friend Requests */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Friend Requests</CardTitle>
            <CardDescription className="text-gray-400">
              Pending friend requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Emma Davis', mutualFriends: 3 },
                { name: 'Tom Brown', mutualFriends: 1 },
              ].map((request, i) => (
                <div key={i} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-700/30">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{request.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-white font-medium">{request.name}</p>
                    <p className="text-gray-400 text-sm">{request.mutualFriends} mutual friends</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
