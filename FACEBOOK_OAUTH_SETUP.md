# Facebook OAuth Integration - Quick Setup Guide

## Overview

The Facebook OAuth integration allows users to connect their Facebook accounts to Campagent, enabling automatic invoice import and campaign management.

## Quick Start

### 1. Backend Setup

```bash
cd server
npm install
```

### 2. Create `.env` File

Create a `.env` file in the `server` directory:

```env
FACEBOOK_APP_ID=your_app_id_here
FACEBOOK_APP_SECRET=your_app_secret_here
FACEBOOK_REDIRECT_URI=http://localhost:3001/auth/facebook/callback
PORT=3001
SUPABASE_PROJECT_URL=https://ticvfvasxokumficxzal.supabase.co
SUPABASE_PUBLIC_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpY3ZmdmFzeG9rdW1maWN4emFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNjgyNjAsImV4cCI6MjA3Nzk0NDI2MH0.3ydRtCPv4XAxrxBBOYhA8k2sj8l5kPi5_FRi9ox7QEY
```

### 3. Get Facebook App Credentials

1. Visit [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select an existing one
3. Add "Facebook Login" product
4. In Settings → Basic, copy your App ID and App Secret
5. In Settings → Facebook Login → Settings, add redirect URI:
   - `http://localhost:3001/auth/facebook/callback` (for development)
   - `https://ticvfvasxokumficxzal.supabase.co/auth/v1/callback` (Supabase production)
6. (Optional) If you deploy to your own domain, add that domain's callback as well (e.g., `https://campagent.vercel.app/auth/callback`)
7. In App settings → Basic → *App Domains*, add:
   - `campagent.vercel.app`
   - `ticvfvasxokumficxzal.supabase.co`
   - `localhost`
6. In App Review, request permissions:
   - `ads_read`
   - `business_management`

### 4. Start the Server

```bash
cd server
npm start
# or for development with auto-reload:
npm run dev
```

### 5. Test the Integration

1. Open `index.html` in your browser
2. Click "התחבר עם פייסבוק" button
3. Complete Facebook OAuth flow
4. You should see: "החיבור לפייסבוק בוצע בהצלחה!"

## How It Works

1. User clicks "התחבר עם פייסבוק" button
2. Frontend redirects directly to the Supabase OAuth flow using the Supabase JS client (`supabase.auth.signInWithOAuth`)
3. Supabase handles the Facebook login flow and redirects to `/auth/callback`
4. The callback page stores the auth status and (if configured) sets the Supabase session
5. The user is returned to the homepage with success/error messaging

## Files Modified

- `index.html` - Added Facebook auth button and message display
- `script.js` - Added Supabase JS client integration for OAuth
- `auth-callback.html` - Handles Supabase redirect and session storage
- `styles.css` - Added message styling
- `server/server.js` - Backend OAuth implementation
- `server/package.json` - Server dependencies

## Production Checklist

- [ ] Expose `window.SUPABASE_PUBLIC_ANON_KEY` or update `script.js` with your Supabase anon key before deploying
- [ ] Use HTTPS for all OAuth redirects
- [ ] Replace SQLite with production database (PostgreSQL/MySQL)
- [ ] Implement proper user session management
- [ ] Encrypt stored tokens
- [ ] Add token refresh logic
- [ ] Set up proper error logging
- [ ] Configure CORS for production domain
- [ ] Add rate limiting
- [ ] Set up monitoring and alerts

## Support

For detailed API documentation, see `server/README.md`

Ensure your Supabase project URL and public anon key in `script.js` and `auth-callback.html` match your project (update if you rotate keys)

