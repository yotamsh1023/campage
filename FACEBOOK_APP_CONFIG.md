# Facebook App Configuration Checklist

Your Facebook App credentials have been configured:
- **App ID**: 4327227247510385
- **App Secret**: cc2d31776a23810bd297650af60cc24d

## Required Facebook App Settings

### 1. Add Redirect URI

Go to [Facebook Developers](https://developers.facebook.com/apps/4327227247510385/) → Settings → Facebook Login → Settings

Add this redirect URI:
```
http://localhost:3001/auth/facebook/callback
```

For production, also add:
```
https://ticvfvasxokumficxzal.supabase.co/auth/v1/callback
```

### 2. Request Required Permissions

Go to App Review → Permissions and Features

Request the following permissions:
- ✅ **ads_read** - Read ads data
- ✅ **business_management** - Manage business accounts

**Note**: These permissions may require App Review for production use. For development, you can test with your own account.

### 3. Add Test Users (Optional for Development)

In App Settings → Roles → Test Users, you can add test users to test the OAuth flow without affecting real users.

### 4. Development Mode

While in Development mode, the app can only be used by:
- App administrators
- Developers
- Test users

To make it available to all users, you'll need to submit for App Review.

## Next Steps

1. **Install server dependencies** (if not already done):
   ```bash
   cd server
   npm install
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

3. **Test the integration**:
   - Open `index.html` (or your deployed site) in your browser
   - Click "התחבר עם פייסבוק"
   - Complete the OAuth flow via Supabase
   - You should see: "החיבור לפייסבוק בוצע בהצלחה!"

## Troubleshooting

### "Invalid OAuth Redirect URI"
- Make sure the redirect URI in Facebook App Settings matches exactly: `https://ticvfvasxokumficxzal.supabase.co/auth/v1/callback`
- Keep `http://localhost:3001/auth/facebook/callback` for local development
- Check for trailing slashes or typos

### "Invalid App ID or App Secret"
- Verify the credentials in `server/.env` match your Facebook App
- Make sure there are no extra spaces in the `.env` file

### "Permissions Not Granted"
- Ensure you've requested `ads_read` and `business_management` permissions
- For development, you can test with your own account first

### CORS Errors
- When using Supabase, ensure the site you're testing from is listed as an authorized domain in Supabase Auth settings
- If you still run the local Express server, verify it's available on port 3001

## Security Reminders

⚠️ **Important**: 
- Never commit the `.env` file to version control (it's already in `.gitignore`)
- Keep your App Secret secure
- Use HTTPS in production
- Consider encrypting stored tokens in production


