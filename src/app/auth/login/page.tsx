import Link from 'next/link';

export default function LoginPage() {
  // Client-side environment check (only for NEXT_PUBLIC_* variables)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  
  if (!appUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-red-400 mb-4">Configuration Error</h2>
            <p className="text-red-300 text-sm mb-4">
              NEXT_PUBLIC_APP_URL environment variable is not set. Please check your Vercel environment variables.
            </p>
            <div className="text-red-200 text-xs">
              <p>Required environment variables:</p>
              <ul className="list-disc list-inside mt-2">
                <li>SPOTIFY_CLIENT_ID</li>
                <li>SPOTIFY_CLIENT_SECRET</li>
                <li>NEXT_PUBLIC_APP_URL</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.369 4.369 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white">Playpals</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to Playpals</h1>
          <p className="text-gray-400">Connect with friends through music</p>
        </div>
        
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">Sign in with Spotify</h2>
            <p className="text-gray-400 text-sm">
              Connect your Spotify account to start sharing music with friends
            </p>
          </div>
          
          <Link 
            href="/api/auth/spotify"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            onClick={() => {
              console.log('Spotify login button clicked');
              console.log('Redirecting to:', '/api/auth/spotify');
            }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <span>Continue with Spotify</span>
          </Link>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              By continuing, you agree to our{' '}
              <Link href="/terms" className="text-green-400 hover:text-green-300">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-green-400 hover:text-green-300">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
