import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const params = await searchParams;
  const error = params.error;
  
  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'access_denied':
        return 'You denied access to your Spotify account. Please try again and grant the necessary permissions.';
      case 'invalid_state':
        return 'Authentication session expired. Please try logging in again.';
      case 'oauth_error':
        return 'There was an error connecting to Spotify. Please try again.';
      default:
        return 'An unexpected error occurred during authentication. Please try again.';
    }
  };

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
        </div>
        
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 shadow-xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Authentication Error</h2>
            <p className="text-gray-400 text-sm">
              {getErrorMessage(error || 'unknown')}
            </p>
          </div>
          
          <div className="space-y-3">
            <Link 
              href="/auth/login"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
            >
              Try Again
            </Link>
            
            <Link 
              href="/"
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
