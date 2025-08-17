import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken, invalidateSession } from '@/lib/session';

export async function POST() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;
  
  // Invalidate the session if it exists
  if (sessionToken) {
    try {
      const decoded = verifySessionToken(sessionToken);
      if (decoded) {
        await invalidateSession(decoded.sessionId);
      }
    } catch (error) {
      console.error('Error during session invalidation:', error);
    }
  }
  
  const response = NextResponse.json({ success: true });
  response.cookies.delete('session');
  
  return response;
}
