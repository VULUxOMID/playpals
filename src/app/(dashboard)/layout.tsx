import { requireAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Music, Users, Heart, Home, Search, Plus, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  const handleLogout = async () => {
    'use server';
    // This will be handled by the logout API route
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Playpals</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.profileImage || undefined} />
                  <AvatarFallback>
                    {user.displayName?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-white text-sm font-medium">{user.displayName}</span>
              </div>
              
              <form action="/api/auth/logout" method="POST">
                <Button 
                  type="submit"
                  variant="ghost" 
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-gray-700/50"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800/30 border-r border-gray-700 min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/dashboard" 
                  className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard/search" 
                  className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard/friends" 
                  className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <Users className="w-5 h-5" />
                  <span>Friends</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard/playlists" 
                  className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  <span>Playlists</span>
                </Link>
              </li>
            </ul>
            
            <div className="mt-8 pt-4 border-t border-gray-700">
              <Link 
                href="/dashboard/create-playlist" 
                className="flex items-center space-x-3 px-3 py-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Create Playlist</span>
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
