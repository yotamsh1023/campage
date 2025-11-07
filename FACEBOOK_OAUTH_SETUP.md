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
```

### 3. Get Facebook App Credentials

1. Visit [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select an existing one
3. Add "Facebook Login" product
4. In Settings → Basic, copy your App ID and App Secret
5. In Settings → Facebook Login → Settings, add redirect URI:
   - `http://localhost:3001/auth/facebook/callback` (for development)
   - `https://ticvfvasxokumficxzal.supabase.co/auth/v1/callback` (Supabase production)
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
2. Frontend redirects directly to the configured Facebook OAuth callback (`https://ticvfvasxokumficxzal.supabase.co/auth/v1/callback` in production)
3. Supabase handles the Facebook login flow and processes the OAuth callback
4. After authorization, Supabase receives the code from Facebook and stores the session/token
5. Your Supabase auth hooks can then notify the frontend of success or failure

## Files Modified

- `index.html` - Added Facebook auth button and message display
- `script.js` - Added OAuth flow handling
- `styles.css` - Added message styling
- `server/server.js` - Backend OAuth implementation
- `server/package.json` - Server dependencies

## Production Checklist

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

