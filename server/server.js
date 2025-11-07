const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// Initialize SQLite database
const db = new sqlite3.Database('./campagent.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        // Create users table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT UNIQUE NOT NULL,
            facebook_token TEXT,
            facebook_user_id TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// Facebook OAuth configuration
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const FACEBOOK_REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI || 'http://localhost:3001/auth/facebook/callback';

// Facebook OAuth scopes
const FACEBOOK_SCOPES = 'ads_read,business_management';

// Generate Facebook OAuth URL
app.get('/api/auth/facebook', (req, res) => {
    const state = req.query.userId || 'default'; // In production, use proper session/user ID
    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
        `client_id=${FACEBOOK_APP_ID}` +
        `&redirect_uri=${encodeURIComponent(FACEBOOK_REDIRECT_URI)}` +
        `&scope=${FACEBOOK_SCOPES}` +
        `&state=${state}` +
        `&response_type=code`;
    
    res.json({ authUrl });
});

// Facebook OAuth callback
app.get('/auth/facebook/callback', async (req, res) => {
    const { code, state } = req.query;
    const userId = state || 'default'; // In production, get from session

    if (!code) {
        return res.redirect(`/index.html?error=auth_failed&message=${encodeURIComponent('חיבור לפייסבוק נכשל. נסה שוב.')}`);
    }

    try {
        // Exchange code for access token
        const tokenResponse = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
            params: {
                client_id: FACEBOOK_APP_ID,
                client_secret: FACEBOOK_APP_SECRET,
                redirect_uri: FACEBOOK_REDIRECT_URI,
                code: code
            }
        });

        const accessToken = tokenResponse.data.access_token;

        // Get user info from Facebook
        const userInfoResponse = await axios.get('https://graph.facebook.com/v18.0/me', {
            params: {
                access_token: accessToken,
                fields: 'id,name'
            }
        });

        const facebookUserId = userInfoResponse.data.id;

        // Save token to database
        db.run(
            `INSERT INTO users (user_id, facebook_token, facebook_user_id, updated_at)
             VALUES (?, ?, ?, CURRENT_TIMESTAMP)
             ON CONFLICT(user_id) DO UPDATE SET
             facebook_token = excluded.facebook_token,
             facebook_user_id = excluded.facebook_user_id,
             updated_at = CURRENT_TIMESTAMP`,
            [userId, accessToken, facebookUserId],
            function(err) {
                if (err) {
                    console.error('Database error:', err);
                    return res.redirect(`/index.html?error=db_error&message=${encodeURIComponent('חיבור לפייסבוק נכשל. נסה שוב.')}`);
                }
                
                // Success - redirect with success message
                res.redirect(`/index.html?success=true&message=${encodeURIComponent('החיבור לפייסבוק בוצע בהצלחה!')}`);
            }
        );
    } catch (error) {
        console.error('Facebook OAuth error:', error.response?.data || error.message);
        res.redirect(`/index.html?error=auth_failed&message=${encodeURIComponent('חיבור לפייסבוק נכשל. נסה שוב.')}`);
    }
});

// Get user's Facebook connection status
app.get('/api/user/facebook-status', (req, res) => {
    const userId = req.query.userId || 'default'; // In production, get from session
    
    db.get(
        'SELECT facebook_token, facebook_user_id, updated_at FROM users WHERE user_id = ?',
        [userId],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ 
                connected: !!row?.facebook_token,
                facebookUserId: row?.facebook_user_id || null,
                connectedAt: row?.updated_at || null
            });
        }
    );
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Facebook OAuth redirect URI: ${FACEBOOK_REDIRECT_URI}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});


