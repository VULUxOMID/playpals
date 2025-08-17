'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Music, Users, Heart, Play, Clock } from 'lucide-react';

interface Activity {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  type: 'now_playing' | 'playlist_created' | 'friend_added' | 'session_joined';
  content: string;
  timestamp: string;
  track?: {
    name: string;
    artist: string;
  };
}

export default function ActivityFeed() {
  const [activities] = useState<Activity[]>([
    {
      id: '1',
      user: { name: 'John Doe' },
      type: 'now_playing',
      content: 'started listening to',
      timestamp: '2 minutes ago',
      track: { name: 'Bohemian Rhapsody', artist: 'Queen' }
    },
    {
      id: '2',
      user: { name: 'Alice Smith' },
      type: 'playlist_created',
      content: 'created a new playlist "Chill Vibes"',
      timestamp: '15 minutes ago'
    },
    {
      id: '3',
      user: { name: 'Mike Johnson' },
      type: 'session_joined',
      content: 'joined your listening session',
      timestamp: '1 hour ago'
    },
    {
      id: '4',
      user: { name: 'Sarah Wilson' },
      type: 'friend_added',
      content: 'added you as a friend',
      timestamp: '2 hours ago'
    }
  ]);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'now_playing':
        return <Play className="w-4 h-4 text-green-500" />;
      case 'playlist_created':
        return <Heart className="w-4 h-4 text-purple-500" />;
      case 'session_joined':
        return <Users className="w-4 h-4 text-blue-500" />;
      case 'friend_added':
        return <Users className="w-4 h-4 text-orange-500" />;
      default:
        return <Music className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'now_playing':
        return 'text-green-400';
      case 'playlist_created':
        return 'text-purple-400';
      case 'session_joined':
        return 'text-blue-400';
      case 'friend_added':
        return 'text-orange-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          Recent Activity
          <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-500/20">
            Live
          </Badge>
        </CardTitle>
        <CardDescription className="text-gray-400">
          What&apos;s happening in your music world
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarFallback className="text-xs">
                {activity.user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                {getActivityIcon(activity.type)}
                <p className="text-sm text-white">
                  <span className="font-medium">{activity.user.name}</span>{' '}
                  <span className="text-gray-300">{activity.content}</span>
                  {activity.track && (
                    <span className={getActivityColor(activity.type)}>
                      {' '}&quot;{activity.track.name}&quot; by {activity.track.artist}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <Clock className="w-3 h-3 text-gray-500" />
                <p className="text-xs text-gray-500">{activity.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
        
        <div className="text-center pt-4 border-t border-gray-700">
          <button className="text-sm text-green-400 hover:text-green-300 transition-colors">
            View all activity
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
