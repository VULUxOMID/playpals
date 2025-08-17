# Vercel Deployment Guide 🚀

## Required Environment Variables

Set these environment variables in your Vercel project settings:

### Database
```
DATABASE_URL=postgresql://username:password@host:port/database
```

### Spotify API
```
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

### App Configuration
```
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### Security (Optional but recommended)
```
FIELD_ENCRYPTION_KEY=your_64_character_hex_encryption_key
```

## Setup Steps

1. **Create a Vercel project** from your GitHub repository
2. **Set environment variables** in Vercel project settings
3. **Deploy** - The build process will automatically:
   - Generate Prisma client
   - Build the Next.js application
   - Deploy to Vercel

## Spotify App Configuration

1. **Update your Spotify app redirect URI** to include your production domain:
   ```
   https://your-domain.vercel.app/api/auth/callback/spotify
   ```

2. **Add localhost for development**:
   ```
   http://localhost:3000/api/auth/callback/spotify
   ```

## Database Setup

1. **Set up a PostgreSQL database** (e.g., using Vercel Postgres, Supabase, or Railway)
2. **Run migrations** on your production database:
   ```bash
   npx prisma migrate deploy
   ```

## Troubleshooting

### Build Errors
- Ensure all required environment variables are set
- Check that `DATABASE_URL` points to a valid PostgreSQL database
- Verify Spotify API credentials are correct

### Runtime Errors
- Check Vercel function logs for detailed error messages
- Ensure database is accessible from Vercel's servers
- Verify Spotify redirect URI matches exactly

## Security Notes

- Environment variables are encrypted in Vercel
- Database connections use SSL by default
- Spotify tokens are encrypted in the database
- Sessions use secure HTTP-only cookies
