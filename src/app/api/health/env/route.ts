import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variable presence without exposing values
    const envHealth = {
      SPOTIFY_CLIENT_ID: !!process.env.SPOTIFY_CLIENT_ID,
      SPOTIFY_CLIENT_SECRET: !!process.env.SPOTIFY_CLIENT_SECRET,
      NEXT_PUBLIC_APP_URL: !!process.env.NEXT_PUBLIC_APP_URL,
      DATABASE_URL: !!process.env.DATABASE_URL,
      NODE_ENV: process.env.NODE_ENV || 'UNSET',
      // NextAuth variables (not used in current implementation)
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    };

    console.log('Health check - Environment variables:', envHealth);

    // Check if all required variables are present
    const requiredVars = ['SPOTIFY_CLIENT_ID', 'SPOTIFY_CLIENT_SECRET', 'NEXT_PUBLIC_APP_URL'];
    const missingVars = requiredVars.filter(varName => !envHealth[varName as keyof typeof envHealth]);

    const status = missingVars.length === 0 ? 'healthy' : 'unhealthy';
    const statusCode = missingVars.length === 0 ? 200 : 500;

    return NextResponse.json({
      status,
      environment: envHealth,
      missing: missingVars,
      timestamp: new Date().toISOString(),
    }, { status: statusCode });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'error',
      error: 'Failed to check environment variables',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
