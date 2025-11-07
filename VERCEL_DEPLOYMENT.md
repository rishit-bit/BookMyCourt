# Vercel Deployment Guide for BookMyCourt

## Issue: Login Failed - Connection Error

The "Login failed. Please check your connection and try again." error occurs because the frontend is trying to connect to `localhost:5000`, which doesn't exist in production.

## Solution: Configure Environment Variables

### Step 1: Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following environment variable:

   **Variable Name:** `REACT_APP_API_URL`
   
   **Value:** Your backend API URL (e.g., `https://your-backend-api.railway.app/api` or `https://your-backend-api.render.com/api`)
   
   **Environment:** Select all (Production, Preview, Development)

### Step 2: Deploy Your Backend

Your backend needs to be deployed separately. Options:

#### Option A: Railway (Recommended)
1. Go to [Railway.app](https://railway.app)
2. Create a new project
3. Connect your GitHub repository
4. Set the root directory to the project root (not `client`)
5. Add environment variables from `env.example`
6. Deploy

#### Option B: Render
1. Go to [Render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables
7. Deploy

#### Option C: Heroku
1. Create a Heroku app
2. Connect your GitHub repository
3. Add environment variables
4. Deploy

### Step 3: Update CORS Settings

Make sure your backend allows requests from your Vercel domain:

```javascript
// In server/index.js
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://bookmycourt-green.vercel.app',
    'https://your-vercel-domain.vercel.app'
  ],
  credentials: true
};
```

### Step 4: Redeploy

After setting environment variables:
1. Go to Vercel dashboard
2. Click **Redeploy** on your latest deployment
3. Or push a new commit to trigger a redeploy

## Environment Variables Checklist

### Frontend (Vercel)
- ✅ `REACT_APP_API_URL` - Your backend API URL

### Backend (Railway/Render/etc.)
- ✅ `PORT` - Server port (usually 5000 or provided by hosting)
- ✅ `MONGODB_URI` - MongoDB connection string
- ✅ `JWT_SECRET` - Secret key for JWT tokens
- ✅ `GMAIL_USER` - Gmail address for sending emails
- ✅ `GMAIL_PASS` - Gmail app password
- ✅ `FROM_EMAIL` - Email address for "from" field
- ✅ `CLIENT_URL` - Your Vercel frontend URL

## Testing

After deployment:
1. Check browser console (F12) for any API errors
2. Verify the API URL is correct in network requests
3. Test login functionality

## Troubleshooting

### Still getting connection errors?
1. Check browser console for the actual error message
2. Verify `REACT_APP_API_URL` is set correctly in Vercel
3. Check if backend is accessible (try opening API URL in browser)
4. Verify CORS settings allow your Vercel domain
5. Check backend logs for any errors

### Backend not responding?
1. Verify backend is deployed and running
2. Check backend logs for errors
3. Verify MongoDB connection is working
4. Check environment variables are set correctly

