import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
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
          <h1 className="text-2xl font-bold text-white mb-2">Join Playpals</h1>
          <p className="text-gray-400">Start your musical journey with friends</p>
        </div>
        
        <SignUp 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-gray-800/50 border border-gray-700 shadow-xl",
              headerTitle: "text-white",
              headerSubtitle: "text-gray-400",
              formButtonPrimary: "bg-green-500 hover:bg-green-600 text-white",
              formFieldInput: "bg-gray-700 border-gray-600 text-white",
              formFieldLabel: "text-gray-300",
              footerActionLink: "text-green-400 hover:text-green-300",
              dividerLine: "bg-gray-600",
              dividerText: "text-gray-400",
            }
          }}
        />
      </div>
    </div>
  );
}
