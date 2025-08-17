import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Never return actual secrets. Only indicate presence.
    const present = (v?: string) => (v && v.length > 0 ? 'SET' : 'UNSET');

    const envStatus = {
      SPOTIFY_CLIENT_ID: present(process.env.SPOTIFY_CLIENT_ID),   // server-only
      SPOTIFY_CLIENT_SECRET: present(process.env.SPOTIFY_CLIENT_SECRET), // server-only
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'UNSET',   // safe to expose
      NODE_ENV: process.env.NODE_ENV || 'UNSET',                           // helpful for context
    };

    console.log('Debug endpoint called, environment status:', envStatus);
    return NextResponse.json(envStatus);
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json(
      { error: 'Failed to read environment variables' },
      { status: 500 }
    );
  }
}
