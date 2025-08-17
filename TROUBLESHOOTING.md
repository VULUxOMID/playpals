# Troubleshooting Guide 🔧

## Spotify OAuth Not Working

If the Spotify login button doesn't work or you get a 500 error, follow these steps:

### 1. Check Environment Variables

Visit this URL in your browser to check if environment variables are set correctly:
```
https://www.playpals.online/api/debug/env
```

You should see something like:
```json
{
  "NODE_ENV": "production",
  "SPOTIFY_CLIENT_ID": "SET",
  "SPOTIFY_CLIENT_SECRET": "SET", 
  "NEXT_PUBLIC_APP_URL": "https://www.playpals.online",
  "DATABASE_URL": "SET",
  "FIELD_ENCRYPTION_KEY": "SET"
}
```

### 2. If Environment Variables Are Missing

If any show "NOT SET", you need to add them in Vercel:

1. Go to your Vercel project dashboard
2. Go to Settings → Environment Variables
3. Add the missing variables:

```
NEXT_PUBLIC_APP_URL=https://www.playpals.online
SPOTIFY_CLIENT_ID=cf1cd05ee8794f2fb17aa61d80e074aa
SPOTIFY_CLIENT_SECRET=b0d28ffbc8674a3ebdaa10322d56df99
DATABASE_URL=your_postgresql_database_url
```

### 3. Check Spotify App Configuration

Make sure your Spotify app redirect URI is set to:
```
https://www.playpals.online/api/auth/callback/spotify
```

### 4. Check Vercel Function Logs

1. Go to your Vercel project dashboard
2. Go to Functions tab
3. Look for errors in the `/api/auth/spotify` function

### 5. Test the OAuth Flow

1. Click the "Continue with Spotify" button
2. Check the browser's Network tab for any failed requests
3. Look for any error messages in the console

### Common Issues

**500 Error**: Usually means environment variables are missing
**404 Error**: Check if the API routes are deployed correctly
**Redirect Loop**: Check if the Spotify redirect URI is correct

### Quick Fix

If you're still having issues, try:
1. Redeploy the application in Vercel
2. Clear your browser cache
3. Try in an incognito/private window
