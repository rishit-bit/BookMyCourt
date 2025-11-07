# Render Deployment Guide for BookMyCourt Backend

This guide will help you deploy your BookMyCourt backend to Render.

## Prerequisites

1. A GitHub account (you already have this - your code is on GitHub)
2. A Render account (sign up at [render.com](https://render.com) - it's free)
3. A MongoDB database (you can use MongoDB Atlas - free tier available)

## Step 1: Set Up MongoDB Atlas (If You Don't Have One)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (choose the free tier)
4. Create a database user:
   - Go to **Database Access** → **Add New Database User**
   - Choose **Password** authentication
   - Create a username and password (save these!)
   - Set privileges to **Read and write to any database**
5. Whitelist IP addresses:
   - Go to **Network Access** → **Add IP Address**
   - Click **Allow Access from Anywhere** (or add Render's IP ranges)
6. Get your connection string:
   - Go to **Database** → **Connect**
   - Choose **Connect your application**
   - Copy the connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/bookmycourt?retryWrites=true&w=majority`)
   - Replace `<password>` with your database user password

## Step 2: Deploy to Render

### 2.1 Create a New Web Service

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository:
   - Click **Connect GitHub**
   - Authorize Render to access your repositories
   - Select your `BookMyCourt` repository

### 2.2 Configure the Service

Fill in the following settings:

- **Name:** `bookmycourt-backend` (or any name you prefer)
- **Region:** Choose the closest region to your users
- **Branch:** `main`
- **Root Directory:** Leave empty (or set to `.` if needed)
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Plan:** `Free` (or choose a paid plan if needed)

### 2.3 Set Environment Variables

Click **Advanced** → **Add Environment Variable** and add these:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | |
| `PORT` | Leave empty (Render sets this automatically) | |
| `MONGODB_URI` | Your MongoDB Atlas connection string | From Step 1 |
| `JWT_SECRET` | A random secret string | Generate a strong random string |
| `GMAIL_USER` | Your Gmail address | For sending emails |
| `GMAIL_PASS` | Your Gmail app password | See email setup below |
| `FROM_EMAIL` | Your Gmail address | Usually same as GMAIL_USER |
| `CLIENT_URL` | `https://bookmycourt-green.vercel.app` | Your Vercel frontend URL |

**Important Notes:**
- **JWT_SECRET:** Generate a strong random string (you can use: `openssl rand -base64 32` or any online generator)
- **GMAIL_PASS:** This is NOT your regular Gmail password. You need to create an App Password:
  1. Go to your Google Account settings
  2. Security → 2-Step Verification (enable if not enabled)
  3. App passwords → Generate app password
  4. Use this 16-character password (not your regular password)

### 2.4 Deploy

1. Click **Create Web Service**
2. Render will start building and deploying your backend
3. Wait for the deployment to complete (usually 5-10 minutes)
4. Once deployed, you'll see a URL like: `https://bookmycourt-backend.onrender.com`

## Step 3: Update CORS Settings

After deployment, you need to update your backend CORS settings to allow your Vercel domain.

1. In Render, go to your service → **Environment**
2. Make sure `CLIENT_URL` is set to your Vercel URL
3. The server should automatically use this for CORS

If needed, you can also update `server/index.js` to include your Vercel domain in the CORS origin array.

## Step 4: Update Vercel Environment Variable

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add or update:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://your-backend-name.onrender.com/api` (replace with your actual Render URL)
   - **Environment:** All (Production, Preview, Development)
4. Click **Save**
5. **Redeploy** your Vercel project

## Step 5: Test the Deployment

1. Open your Vercel frontend URL
2. Try to log in
3. Check the browser console (F12) for any errors
4. Check Render logs if there are issues:
   - Go to Render dashboard → Your service → **Logs**

## Troubleshooting

### Backend won't start
- Check Render logs for errors
- Verify all environment variables are set correctly
- Make sure MongoDB connection string is correct

### CORS errors
- Verify `CLIENT_URL` is set correctly in Render
- Check that your Vercel URL is in the CORS origins

### Database connection errors
- Verify MongoDB Atlas IP whitelist includes Render's IPs
- Check MongoDB connection string format
- Verify database user credentials

### Email not working
- Verify Gmail app password is correct (not regular password)
- Check Gmail user has 2-step verification enabled
- Verify FROM_EMAIL matches GMAIL_USER

## Render Free Tier Limitations

- Services may spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- 750 hours/month free (enough for most projects)
- For production, consider upgrading to a paid plan

## Next Steps

After successful deployment:
1. Test all features (login, signup, booking, etc.)
2. Monitor Render logs for any errors
3. Set up MongoDB Atlas backups
4. Consider setting up a custom domain

## Support

If you encounter issues:
1. Check Render service logs
2. Check browser console for frontend errors
3. Verify all environment variables are correct
4. Test MongoDB connection separately

---

**Your backend URL will be:** `https://your-service-name.onrender.com`
**Your API base URL will be:** `https://your-service-name.onrender.com/api`

Make sure to use the `/api` suffix when setting `REACT_APP_API_URL` in Vercel!

