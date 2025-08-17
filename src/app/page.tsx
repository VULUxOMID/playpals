import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, Users, Heart, TrendingUp, Play, Sparkles } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const user = await getCurrentUser();
  
  // Redirect authenticated users to dashboard
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Playpals</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">
              About
            </a>
            <Link href="/auth/login">
              <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white">
                Sign In
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6 bg-green-500/10 text-green-400 border-green-500/20">
            <Sparkles className="w-4 h-4 mr-2" />
            Beta Release
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Listen Together,
            <span className="text-green-500"> Discover Together</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Create collaborative playlists, see what your friends are listening to in real-time, 
            and discover new music through your social network.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white px-8 py-3">
                <Play className="w-5 h-5 mr-2" />
                Start Listening Together
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3">
                Sign In with Spotify
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Why Choose Playpals?</h2>
          <p className="text-xl text-gray-300">Everything you need for a social music experience</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-gray-800/50 border-gray-700 hover:border-green-500/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <CardTitle className="text-white">Real-time Sharing</CardTitle>
              <CardDescription className="text-gray-400">
                See what your friends are playing right now and join their listening sessions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:border-green-500/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-green-500" />
              </div>
              <CardTitle className="text-white">Collaborative Playlists</CardTitle>
              <CardDescription className="text-gray-400">
                Create and edit playlists together with friends in real-time
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:border-green-500/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <CardTitle className="text-white">Music Discovery</CardTitle>
              <CardDescription className="text-gray-400">
                Discover new tracks and artists through your friends' listening habits
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:border-green-500/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <Play className="w-6 h-6 text-green-500" />
              </div>
              <CardTitle className="text-white">Listening Parties</CardTitle>
              <CardDescription className="text-gray-400">
                Host virtual listening sessions and enjoy music together with friends
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:border-green-500/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <Music className="w-6 h-6 text-green-500" />
              </div>
              <CardTitle className="text-white">Spotify Integration</CardTitle>
              <CardDescription className="text-gray-400">
                Seamlessly connect with your Spotify account and sync your music library
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:border-green-500/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <CardTitle className="text-white">Music Analytics</CardTitle>
              <CardDescription className="text-gray-400">
                Track your listening habits and discover your music taste patterns
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Musical Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of music lovers who are already discovering and sharing music together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white px-8 py-3">
                Get Started Free
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3">
                Already have an account? Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <Music className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Playpals</span>
          </div>
          <p className="text-gray-400">
            © 2024 Playpals. Made with ❤️ for music lovers everywhere.
          </p>
        </div>
      </footer>
    </div>
  );
}
