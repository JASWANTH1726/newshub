# ✅ NewsHub Setup & Deployment Checklist

## 📋 Local Development Setup

### Prerequisites
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Code editor (VS Code recommended)
- [ ] Terminal/Command Prompt

### Get Credentials
- [ ] Create MongoDB Atlas account
  - [ ] Create free cluster
  - [ ] Create database user
  - [ ] Whitelist IP (0.0.0.0/0 for dev)
  - [ ] Copy connection string
- [ ] Get NewsAPI key from https://newsapi.org
  - [ ] Sign up for free account
  - [ ] Copy API key (100 requests/day)
- [ ] Generate JWT secret
  - [ ] Create random string (min 32 characters)

### Backend Setup
- [ ] Navigate to `newshub/backend`
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Edit `.env` file:
  - [ ] Add `MONGO_URI=<your-mongodb-uri>`
  - [ ] Add `JWT_SECRET=<your-random-secret>`
  - [ ] Add `NEWS_API_KEY=<your-newsapi-key>`
  - [ ] Set `CLIENT_URL=http://localhost:3000`
- [ ] Run `npm run dev`
- [ ] Verify server starts on port 5000
- [ ] Test health endpoint: http://localhost:5000/api/health

### Frontend Setup
- [ ] Navigate to `newshub/frontend`
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Edit `.env`:
  - [ ] Set `VITE_API_URL=http://localhost:5000`
- [ ] Run `npm run dev`
- [ ] Verify app opens on port 3000
- [ ] Open http://localhost:3000 in browser

### Local Testing
- [ ] Register new account
- [ ] Login successfully
- [ ] Dashboard loads with news articles
- [ ] Search for news works
- [ ] Filter panel works
- [ ] Update preferences in account page
- [ ] Change password works
- [ ] Logout works
- [ ] Check browser console for errors
- [ ] Check backend terminal for errors

---

## 🚀 Production Deployment

### Pre-Deployment
- [ ] All local testing passed
- [ ] Code committed to Git
- [ ] GitHub repository created
- [ ] Code pushed to GitHub

### MongoDB Atlas Production
- [ ] Create production cluster (can use same as dev)
- [ ] Create new database user for production
- [ ] Update Network Access rules
- [ ] Copy production connection string
- [ ] Test connection locally

### Deploy Backend to Render
- [ ] Sign up/login to Render.com
- [ ] Click "New" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Configure service:
  - [ ] Name: `newshub-backend`
  - [ ] Root Directory: `backend`
  - [ ] Environment: `Node`
  - [ ] Build Command: `npm install`
  - [ ] Start Command: `npm start`
- [ ] Add environment variables:
  - [ ] `MONGO_URI` = production MongoDB URI
  - [ ] `JWT_SECRET` = strong random string (different from dev)
  - [ ] `NEWS_API_KEY` = your NewsAPI key
  - [ ] `CLIENT_URL` = (leave empty for now, will update)
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (~5 minutes)
- [ ] Copy backend URL (e.g., https://newshub-backend.onrender.com)
- [ ] Test: Visit https://your-backend.onrender.com/api/health

### Deploy Frontend to Vercel
- [ ] Sign up/login to Vercel.com
- [ ] Click "Add New" → "Project"
- [ ] Import GitHub repository
- [ ] Configure project:
  - [ ] Framework: `Vite`
  - [ ] Root Directory: `frontend`
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `dist`
- [ ] Add environment variable:
  - [ ] `VITE_API_URL` = your Render backend URL
- [ ] Click "Deploy"
- [ ] Wait for deployment (~2 minutes)
- [ ] Copy frontend URL (e.g., https://newshub-frontend.vercel.app)
- [ ] Visit frontend URL and test

### Update CORS Settings
- [ ] Go back to Render dashboard
- [ ] Open backend service settings
- [ ] Update environment variable:
  - [ ] `CLIENT_URL` = your Vercel frontend URL
- [ ] Trigger manual deploy
- [ ] Wait for redeploy
- [ ] Test frontend again

### Production Testing
- [ ] Open production frontend URL
- [ ] Register new account
- [ ] Login works
- [ ] News feed loads
- [ ] Search works
- [ ] Filters work
- [ ] Account settings work
- [ ] Password change works
- [ ] Logout works
- [ ] Test on mobile device
- [ ] Test on different browsers
- [ ] Check Render backend logs for errors
- [ ] Check Vercel deployment logs

---

## 🔒 Security Checklist

### Development
- [ ] .env files NOT committed to Git
- [ ] .gitignore includes .env
- [ ] Passwords never in code
- [ ] API keys not exposed

### Production
- [ ] Strong JWT secret used (32+ characters)
- [ ] MongoDB password is strong
- [ ] MongoDB IP whitelist restricted (or 0.0.0.0/0 for flexibility)
- [ ] CORS configured for production URLs only
- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] Environment variables set correctly

---

## 🎯 Post-Deployment

### Monitoring
- [ ] Bookmark Render dashboard
- [ ] Bookmark Vercel dashboard
- [ ] Bookmark MongoDB Atlas dashboard
- [ ] Check backend logs regularly
- [ ] Monitor API request count (NewsAPI limit)
- [ ] Monitor MongoDB storage usage

### Optional Enhancements
- [ ] Add custom domain
- [ ] Configure DNS records
- [ ] Add Google Analytics
- [ ] Add error monitoring (Sentry)
- [ ] Add performance monitoring
- [ ] Set up email notifications
- [ ] Add more newspapers to RSS list
- [ ] Implement caching (Redis)
- [ ] Add rate limiting
- [ ] Add API documentation (Swagger)

---

## 🐛 Troubleshooting Checklist

### Backend Issues
- [ ] Check Render logs for errors
- [ ] Verify MongoDB URI is correct
- [ ] Verify JWT_SECRET is set
- [ ] Verify NEWS_API_KEY is valid
- [ ] Test health endpoint
- [ ] Check MongoDB Atlas connection metrics
- [ ] Verify environment variables are set

### Frontend Issues
- [ ] Check browser console for errors
- [ ] Verify VITE_API_URL points to backend
- [ ] Test backend health endpoint directly
- [ ] Clear browser cache and cookies
- [ ] Clear localStorage
- [ ] Try incognito/private window
- [ ] Check Vercel deployment logs

### Database Issues
- [ ] Verify MongoDB cluster is running
- [ ] Check IP whitelist in Atlas
- [ ] Verify database user exists
- [ ] Check connection string format
- [ ] Test connection with MongoDB Compass

### API Issues
- [ ] Check NewsAPI request count (100/day limit)
- [ ] Verify API key is valid
- [ ] Check if API is down (status.newsapi.org)
- [ ] Test RSS feeds individually
- [ ] Check network tab in browser dev tools

---

## 📊 Performance Checklist

### Frontend
- [ ] Images lazy loading
- [ ] Code splitting enabled
- [ ] Bundle size optimized
- [ ] CSS properly scoped
- [ ] No console errors

### Backend
- [ ] Database queries optimized
- [ ] Indexes created on username/email
- [ ] Connection pooling enabled
- [ ] API timeouts configured
- [ ] Error handling in place

### General
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] No memory leaks
- [ ] Mobile performance good
- [ ] Lighthouse score > 80

---

## 🎓 Learning Checklist

### Understand the Stack
- [ ] Know what MERN stands for
- [ ] Understand JWT authentication
- [ ] Understand REST API principles
- [ ] Know how React hooks work
- [ ] Know MongoDB document model
- [ ] Understand Express middleware
- [ ] Know how CORS works

### Code Understanding
- [ ] Read through backend routes
- [ ] Understand User model schema
- [ ] Know how news service works
- [ ] Understand React context
- [ ] Know component structure
- [ ] Understand API service
- [ ] Know routing setup

---

## ✅ Final Checklist

- [ ] Local development working perfectly
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] MongoDB Atlas configured
- [ ] All credentials secured
- [ ] Production testing completed
- [ ] Documentation reviewed
- [ ] Git repository clean
- [ ] Ready to show/present
- [ ] Ready for users

---

**Congratulations! Your NewsHub app is live! 🎉**

**Share your deployed URL:** ___________________________________
