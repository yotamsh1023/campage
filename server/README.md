# Campagent Backend Server

Backend server for Facebook OAuth integration in the Campagent SaaS application.

## Features

- Facebook OAuth 2.0 authentication
- Secure token storage in SQLite database
- RESTful API endpoints
- CORS enabled for frontend integration

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Facebook App ID and App Secret from [Facebook Developers](https://developers.facebook.com/)

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use an existing one
3. Add "Facebook Login" product to your app
4. In App Settings, add your redirect URI:
   - Development: `http://localhost:3001/auth/facebook/callback`
   - Production: `https://yourdomain.com/auth/facebook/callback`
5. Request the following permissions:
   - `ads_read`
   - `business_management`

### 3. Environment Configuration

Create a `.env` file in the `server` directory:

```env
# Facebook OAuth Configuration
FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_APP_SECRET=your_facebook_app_secret_here
FACEBOOK_REDIRECT_URI=http://localhost:3001/auth/facebook/callback

# Server Configuration
PORT=3001
```

### 4. Update Frontend API URL

In `script.js`, update the `API_BASE_URL` constant to match your server:

```javascript
const API_BASE_URL = 'http://localhost:3001'; // Change for production
```

### 5. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3001` (or the port specified in `.env`).

## API Endpoints

### GET `/api/auth/facebook`
Initiates Facebook OAuth flow. Returns OAuth URL.

**Query Parameters:**
- `userId` (optional): User identifier for token storage

**Response:**
```json
{
  "authUrl": "https://www.facebook.com/v18.0/dialog/oauth?..."
}
```

### GET `/auth/facebook/callback`
Facebook OAuth callback endpoint. Handles the OAuth response and stores tokens.

**Query Parameters:**
- `code`: Authorization code from Facebook
- `state`: State parameter (contains userId)

**Redirects:**
- Success: `/index.html?success=true&message=החיבור לפייסבוק בוצע בהצלחה!`
- Error: `/index.html?error=auth_failed&message=חיבור לפייסבוק נכשל. נסה שוב.`

### GET `/api/user/facebook-status`
Check if a user has connected their Facebook account.

**Query Parameters:**
- `userId`: User identifier

**Response:**
```json
{
  "connected": true,
  "facebookUserId": "123456789",
  "connectedAt": "2024-11-15 10:30:00"
}
```

### GET `/api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-11-15T10:30:00.000Z"
}
```

## Database

The server uses SQLite for token storage. The database file (`campagent.db`) is created automatically in the server directory.

**Schema:**
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT UNIQUE NOT NULL,
    facebook_token TEXT,
    facebook_user_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Security Notes

- **Token Storage**: In production, consider encrypting tokens before storing them
- **HTTPS**: Always use HTTPS in production
- **Session Management**: Implement proper session management for user authentication
- **Token Refresh**: Facebook tokens expire; implement token refresh logic
- **User ID**: Replace the temporary `userId` logic with proper user session management

## Troubleshooting

### CORS Errors
If you encounter CORS errors, ensure the frontend URL is allowed in the CORS configuration in `server.js`.

### Facebook OAuth Errors
- Verify your App ID and App Secret are correct
- Ensure the redirect URI matches exactly in Facebook App Settings
- Check that required permissions are approved in Facebook App Review

### Database Errors
- Ensure the server has write permissions in the directory
- Check that SQLite is properly installed

## Production Deployment

1. Set environment variables in your hosting platform
2. Update `FACEBOOK_REDIRECT_URI` to your production domain
3. Use a production database (PostgreSQL, MySQL, etc.) instead of SQLite
4. Enable HTTPS
5. Implement proper authentication and session management
6. Add rate limiting and security headers


