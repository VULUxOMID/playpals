import SpotifyWebApi from 'spotify-web-api-node';

// Get environment variables
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL;

// Initialize Spotify API client with fallbacks for build time
export const spotifyApi = new SpotifyWebApi({
  clientId: SPOTIFY_CLIENT_ID || 'placeholder-client-id',
  clientSecret: SPOTIFY_CLIENT_SECRET || 'placeholder-client-secret',
  redirectUri: NEXT_PUBLIC_APP_URL 
    ? `${NEXT_PUBLIC_APP_URL}/api/auth/callback/spotify`
    : 'http://localhost:3000/api/auth/callback/spotify',
});

// Track if credentials have been validated and set
let credentialsValidated = false;

// Validate environment variables and update spotifyApi with real credentials
export function validateSpotifyConfig() {
  if (process.env.NODE_ENV === 'development') {
    console.log('=== Spotify Configuration Validation ===');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('SPOTIFY_CLIENT_ID:', SPOTIFY_CLIENT_ID ? 'SET' : 'NOT SET');
    console.log('SPOTIFY_CLIENT_SECRET:', SPOTIFY_CLIENT_SECRET ? 'SET' : 'NOT SET');
    console.log('NEXT_PUBLIC_APP_URL:', NEXT_PUBLIC_APP_URL);
    
    // Runtime environment check for debugging
    console.log('Runtime env check:', {
      hasId: !!process.env.SPOTIFY_CLIENT_ID,
      hasSecret: !!process.env.SPOTIFY_CLIENT_SECRET,
      hasUrl: !!process.env.NEXT_PUBLIC_APP_URL,
      nodeEnv: process.env.NODE_ENV
    });
  }

  if (!SPOTIFY_CLIENT_ID) {
    throw new Error('SPOTIFY_CLIENT_ID environment variable is required. Please set it in your Vercel environment variables.');
  }

  if (!SPOTIFY_CLIENT_SECRET) {
    throw new Error('SPOTIFY_CLIENT_SECRET environment variable is required. Please set it in your Vercel environment variables.');
  }

  if (!NEXT_PUBLIC_APP_URL) {
    throw new Error('NEXT_PUBLIC_APP_URL environment variable is required. Please set it in your Vercel environment variables.');
  }

  // Update spotifyApi instance with real credentials
  spotifyApi.setClientId(SPOTIFY_CLIENT_ID);
  spotifyApi.setClientSecret(SPOTIFY_CLIENT_SECRET);
  spotifyApi.setRedirectURI(`${NEXT_PUBLIC_APP_URL}/api/auth/callback/spotify`);
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Spotify configuration validated successfully');
    console.log('Redirect URI set to:', `${NEXT_PUBLIC_APP_URL}/api/auth/callback/spotify`);
  }
  credentialsValidated = true;
}

// Ensure credentials are validated before any Spotify API calls
function ensureCredentialsValidated() {
  if (!credentialsValidated) {
    validateSpotifyConfig();
  }
}

// Set access token for authenticated requests
export function setSpotifyAccessToken(accessToken: string) {
  spotifyApi.setAccessToken(accessToken);
}

// Set refresh token for token refresh
export function setSpotifyRefreshToken(refreshToken: string) {
  spotifyApi.setRefreshToken(refreshToken);
}

// Get user profile from Spotify
export async function getSpotifyProfile(accessToken: string) {
  ensureCredentialsValidated();
  setSpotifyAccessToken(accessToken);
  
  try {
    const profile = await spotifyApi.getMe();
    return profile.body;
  } catch (error) {
    console.error('Error fetching Spotify profile:', error);
    throw error;
  }
}

// Get currently playing track
export async function getCurrentlyPlaying(accessToken: string) {
  ensureCredentialsValidated();
  setSpotifyAccessToken(accessToken);
  
  try {
    const response = await spotifyApi.getMyCurrentPlayingTrack();
    return response.body;
  } catch (error) {
    console.error('Error fetching currently playing:', error);
    return null;
  }
}

// Get user's playlists
export async function getUserPlaylists(accessToken: string, limit = 20, offset = 0) {
  ensureCredentialsValidated();
  setSpotifyAccessToken(accessToken);
  
  try {
    const playlists = await spotifyApi.getUserPlaylists({ limit, offset });
    return playlists.body;
  } catch (error) {
    console.error('Error fetching playlists:', error);
    throw error;
  }
}

// Search for tracks
export async function searchTracks(accessToken: string, query: string, limit = 20) {
  ensureCredentialsValidated();
  setSpotifyAccessToken(accessToken);
  
  try {
    const results = await spotifyApi.searchTracks(query, { limit });
    return results.body;
  } catch (error) {
    console.error('Error searching tracks:', error);
    throw error;
  }
}

// Get recently played tracks
export async function getRecentlyPlayed(accessToken: string, limit = 20) {
  ensureCredentialsValidated();
  setSpotifyAccessToken(accessToken);
  
  try {
    const recent = await spotifyApi.getMyRecentlyPlayedTracks({ limit });
    return recent.body;
  } catch (error) {
    console.error('Error fetching recently played:', error);
    throw error;
  }
}

// Create a new playlist
export async function createPlaylist(
  accessToken: string, 
  userId: string, 
  name: string, 
  description?: string,
  isPublic = false
) {
  ensureCredentialsValidated();
  setSpotifyAccessToken(accessToken);
  
  try {
    const playlist = await spotifyApi.createPlaylist(name, {
      description,
      public: isPublic,
    });
    return playlist.body;
  } catch (error) {
    console.error('Error creating playlist:', error);
    throw error;
  }
}

// Add tracks to playlist
export async function addTracksToPlaylist(
  accessToken: string,
  playlistId: string,
  trackUris: string[]
) {
  ensureCredentialsValidated();
  setSpotifyAccessToken(accessToken);
  
  try {
    const response = await spotifyApi.addTracksToPlaylist(playlistId, trackUris);
    return response.body;
  } catch (error) {
    console.error('Error adding tracks to playlist:', error);
    throw error;
  }
}

// Refresh access token
export async function refreshAccessToken(refreshToken: string) {
  ensureCredentialsValidated();
  setSpotifyRefreshToken(refreshToken);
  
  try {
    const response = await spotifyApi.refreshAccessToken();
    return response.body;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
}

// Initialize Spotify configuration during app startup
export function initializeSpotifyConfig() {
  // Only validate and set credentials if we're not in a build environment
  if (process.env.NODE_ENV !== 'production' || process.env.SPOTIFY_CLIENT_ID) {
    validateSpotifyConfig();
  }
}

// Auto-initialize in development
if (process.env.NODE_ENV === 'development') {
  try {
    initializeSpotifyConfig();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn('Spotify configuration not available in development:', errorMessage);
  }
}
