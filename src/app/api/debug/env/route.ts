import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // In production, require DEBUG_SECRET_KEY to be configured
    const debugSecretKey = process.env.DEBUG_SECRET_KEY;
    
    if (process.env.NODE_ENV === 'production' && !debugSecretKey) {
      return NextResponse.json(
        { error: 'Debug endpoint not configured for production' },
        { status: 401 }
      );
    }

    // Check Authorization header for Bearer token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid Authorization header. Use: Authorization: Bearer <token>' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // In production, verify the token matches DEBUG_SECRET_KEY
    if (process.env.NODE_ENV === 'production' && token !== debugSecretKey) {
      return NextResponse.json(
        { error: 'Invalid debug token' },
        { status: 403 }
      );
    }

    // In development, allow any non-empty token for convenience
    if (process.env.NODE_ENV === 'development' && !token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

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
