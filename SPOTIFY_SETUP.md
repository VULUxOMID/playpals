# Spotify OAuth Setup Guide 🎵

## Environment Variables Required

Create a `.env.local` file in your project root with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/playpals"

# Spotify API
SPOTIFY_CLIENT_ID="your_spotify_client_id"
SPOTIFY_CLIENT_SECRET="your_spotify_client_secret"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Spotify Developer Setup

1. **Create a Spotify App**:
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Click "Create App"
   - Fill in the app details
   - Add your redirect URI: `http://localhost:3000/api/auth/callback/spotify`

2. **Get Your Credentials**:
   - Copy the Client ID and Client Secret
   - Add them to your `.env.local` file

## Database Setup

1. **Set up PostgreSQL database**
2. **Run migrations**:
   ```bash
   npx prisma migrate dev --name remove_clerk_add_spotify_tokens
   npx prisma generate
   ```

## Features

✅ **Direct Spotify OAuth** - No third-party auth provider needed
✅ **Full Spotify Access** - Users can access their entire Spotify catalog
✅ **Token Management** - Automatic token refresh
✅ **Session Management** - Secure cookie-based sessions
✅ **User Profile** - Automatic profile sync from Spotify

## Scopes Granted

The app requests these Spotify permissions:
- `user-read-private` - Read user profile
- `user-read-email` - Read user email
- `user-read-playback-state` - Read current playback
- `user-modify-playback-state` - Control playback
- `playlist-read-private` - Read private playlists
- `playlist-modify-public` - Modify public playlists
- `playlist-modify-private` - Modify private playlists
- `user-read-recently-played` - Read listening history
- `user-top-read` - Read top tracks/artists
- `user-read-currently-playing` - Read currently playing
- `streaming` - Control playback on devices
- `user-library-read` - Read saved tracks/albums
- `user-library-modify` - Modify saved tracks/albums

## Security Notes

- Tokens are stored in the database (consider encryption for production)
- Sessions use secure HTTP-only cookies
- OAuth state parameter prevents CSRF attacks
- Automatic token refresh handles expired tokens
