import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Only allow in development or with a secret key
  const debugKey = request.nextUrl.searchParams.get('key');
  if (process.env.NODE_ENV === 'production' && debugKey !== process.env.DEBUG_SECRET_KEY) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID ? 'SET' : 'NOT SET',
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET ? 'SET' : 'NOT SET',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
    FIELD_ENCRYPTION_KEY: process.env.FIELD_ENCRYPTION_KEY ? 'SET' : 'NOT SET',
  };

  return NextResponse.json(envVars);
}
