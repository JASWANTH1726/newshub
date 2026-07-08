# 🚀 NewsHub Deployment Guide

## Prerequisites
- GitHub account
- MongoDB Atlas account (free)
- Render account (free)
- Vercel account (free)
- NewsAPI key (free - 100 requests/day)

---

## 📦 Step 1: Prepare Your Code

1. **Push to GitHub**
```bash
cd newshub
git init
git add .
git commit -m "Initial commit - NewsHub app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/newshub.git
git push -u origin main
```

---

## 🗄️ Step 2: Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account and sign in
3. Create a **New Cluster** (M0 Free tier)
4. Wait for cluster to deploy (~3-5 minutes)
5. Click **Connect** → **Connect your application**
6. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/newshub?retryWrites=true&w=majority
   ```
7. Replace `<username>` and `<password>` with your credentials
8. Under **Network Access**, add `0.0.0.0/0` (allow from anywhere)

---

## 🖥️ Step 3: Deploy Backend to Render

1. Go to [Render](https://render.com) and sign up
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `newshub-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

5. Add **Environment Variables**:
   ```
   MONGO_URI = <your-mongodb-atlas-uri>
   JWT_SECRET = <random-secret-string-min-32-chars>
   NEWS_API_KEY = <your-newsapi-key>
   CLIENT_URL = https://newshub-frontend.vercel.app
   ```

6. Click **Create Web Service**
7. Wait for deployment (~5 minutes)
8. Copy your backend URL (e.g., `https://newshub-backend.onrender.com`)

**Note**: Free tier spins down after 15 min of inactivity. First request may take ~1 minute.

---

## 🌐 Step 4: Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com) and sign up
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add **Environment Variable**:
   ```
   VITE_API_URL = <your-render-backend-url>
   ```
   Example: `https://newshub-backend.onrender.com`

6. Click **Deploy**
7. Wait for deployment (~2 minutes)
8. Your app is live! (e.g., `https://newshub-frontend.vercel.app`)

---

## 🔑 Step 5: Get NewsAPI Key

1. Go to [NewsAPI](https://newsapi.org)
2. Click **Get API Key**
3. Register for free account
4. Copy your API key
5. Add to Render backend environment variables

---

## ✅ Step 6: Test Your Deployment

1. Open your Vercel frontend URL
2. Register a new account
3. Login and test the dashboard
4. Try searching for news
5. Update preferences in account settings

---

## 🔧 Troubleshooting

### Backend Issues

**"MongoDB connection error"**
- Check MongoDB URI is correct
- Ensure IP `0.0.0.0/0` is whitelisted in Atlas
- Verify database user exists with correct password

**"JWT token error"**
- Ensure JWT_SECRET is set in Render env vars
- Try logging out and back in

**"NewsAPI rate limit"**
- Free tier = 100 requests/day
- Consider caching or upgrading to paid tier

### Frontend Issues

**"Network error"**
- Check VITE_API_URL points to correct Render backend
- Verify backend is running (check Render logs)
- Check CORS settings in backend

**"Can't login"**
- Open browser console (F12) to see errors
- Check backend logs in Render dashboard
- Verify MongoDB connection is working

---

## 📊 Monitoring

### Render Dashboard
- View backend logs
- Check response times
- Monitor memory/CPU usage

### Vercel Dashboard
- View deployment history
- Check build logs
- Monitor bandwidth usage

### MongoDB Atlas
- View database metrics
- Check connection count
- Monitor storage usage

---

## 🔄 Making Updates

### Backend Updates
1. Push changes to GitHub
2. Render auto-deploys from `main` branch
3. Check logs for deployment status

### Frontend Updates
1. Push changes to GitHub
2. Vercel auto-deploys from `main` branch
3. Preview builds available for PRs

---

## 💰 Cost Breakdown

- **MongoDB Atlas**: FREE (512MB storage)
- **Render**: FREE (750 hours/month, sleeps after 15min inactivity)
- **Vercel**: FREE (100GB bandwidth/month)
- **NewsAPI**: FREE (100 requests/day)

**Total Monthly Cost: $0** 🎉

---

## 🚀 Upgrade Options

When you need more:

1. **MongoDB Atlas** → $9/month (2GB RAM, 10GB storage)
2. **Render** → $7/month (always-on, 512MB RAM)
3. **NewsAPI** → $449/month (250,000 requests)
4. **Vercel Pro** → $20/month (unlimited bandwidth)

---

## 🎯 Production Checklist

- [ ] Environment variables set correctly
- [ ] MongoDB Atlas IP whitelist configured
- [ ] CORS origins restricted to production URLs
- [ ] JWT secret is strong (32+ characters)
- [ ] Error monitoring setup (e.g., Sentry)
- [ ] Analytics added (e.g., Google Analytics)
- [ ] Custom domain configured
- [ ] SSL/HTTPS enabled (automatic on Vercel/Render)

---

**Need help?** Open an issue on GitHub or check the logs in Render/Vercel dashboards.
