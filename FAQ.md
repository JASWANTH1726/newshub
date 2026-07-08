# ❓ NewsHub - Frequently Asked Questions

## 🚀 Getting Started

### Q: What do I need to run this project locally?
**A:** You need:
1. Node.js 18+ installed
2. MongoDB Atlas account (free)
3. NewsAPI key (free - 100 requests/day)
4. A random string for JWT secret (32+ characters)

### Q: How long does setup take?
**A:** About 10-15 minutes:
- 2 min: Create MongoDB Atlas cluster
- 2 min: Get NewsAPI key
- 5 min: Install dependencies
- 2 min: Configure .env files
- 3 min: Start servers and test

### Q: Can I use a different database?
**A:** Yes, but you'll need to modify the Mongoose connection code. MongoDB is recommended because the schema is already set up for it.

---

## 🔐 Authentication

### Q: How does JWT authentication work?
**A:** 
1. User logs in with username/password
2. Backend verifies credentials
3. Backend generates JWT token
4. Token sent to frontend
5. Frontend stores token in localStorage
6. Token included in all API requests
7. Backend verifies token on each request

### Q: How long do JWT tokens last?
**A:** Default is 7 days (configurable in backend .env via `JWT_EXPIRES_IN`). You can set it to any value like `1d`, `12h`, `30m`, etc.

### Q: What happens when token expires?
**A:** User is automatically redirected to login page. They'll need to login again to get a new token.

### Q: Can I implement "Remember Me"?
**A:** Yes! Just set a longer `JWT_EXPIRES_IN` value (e.g., `30d`) for users who check "Remember Me".

---

## 🗄️ Database

### Q: Why MongoDB Atlas instead of local MongoDB?
**A:** 
- Free tier available (512MB)
- No installation needed
- Auto-scaling
- Backups included
- Works from anywhere
- Production-ready

### Q: Can I use local MongoDB for development?
**A:** Yes! Just change MONGO_URI to `mongodb://localhost:27017/newshub` and ensure MongoDB is running locally.

### Q: How do I view my database?
**A:**
1. **MongoDB Atlas UI**: Browse collections in Atlas dashboard
2. **MongoDB Compass**: Free GUI tool from MongoDB
3. **Mongoose queries**: Add console.log in backend

### Q: How is data structured?
**A:** Single `users` collection with embedded preferences:
```javascript
{
  username: "john",
  email: "john@example.com",
  password: "hashed...",
  preferences: {
    uiLanguage: "en",
    newsLanguage: "en",
    // ... more fields
  }
}
```

---

## 📰 News Integration

### Q: Where does news data come from?
**A:** Two sources:
1. **NewsAPI.org**: Global news from 80,000+ sources
2. **RSS Feeds**: Direct from 50+ newspapers

### Q: NewsAPI gives me old articles. Why?
**A:** Free tier only returns articles from last 30 days. For real-time breaking news, upgrade to paid plan or rely more on RSS feeds.

### Q: Can I add more newspapers?
**A:** Yes! Edit `backend/src/services/newsService.js`:
1. Add RSS feed URL to `NEWSPAPER_RSS` object
2. Add display name to `NEWSPAPER_NAME_MAP` object
3. Restart backend

### Q: What's the difference between NewsAPI and RSS?
**A:**
- **NewsAPI**: Aggregates from many sources, searchable, rate limited
- **RSS**: Direct from newspaper, real-time, unlimited, but newspaper-specific

### Q: Can I cache news articles?
**A:** Yes! Implement Redis caching:
1. Install `redis` npm package
2. Cache responses in newsService
3. Set TTL (e.g., 30 minutes)
4. Reduces API calls

---

## 🎨 Frontend

### Q: Can I customize the UI colors?
**A:** Yes! Edit `frontend/src/index.css`:
```css
:root {
  --bg: #0f172a;        /* Background */
  --accent: #e11d48;     /* Accent color */
  --text: #f1f5f9;       /* Text color */
  /* ... customize all colors */
}
```

### Q: How do I add a new page?
**A:**
1. Create `frontend/src/pages/NewPage.jsx`
2. Add route in `frontend/src/App.jsx`
3. Add navigation link in `Navbar.jsx`

### Q: Can I use TypeScript?
**A:** Yes! 
1. Rename files to `.tsx`
2. Install types: `npm i -D @types/react @types/node`
3. Add `tsconfig.json`
4. Vite supports TypeScript out of the box

### Q: How do I add authentication to a new page?
**A:** Wrap route with `<PrivateRoute>` in `App.jsx`:
```jsx
<Route path="/newpage" element={
  <PrivateRoute><NewPage /></PrivateRoute>
} />
```

---

## 🔧 Backend

### Q: How do I add a new API endpoint?
**A:**
1. Add route in appropriate file in `backend/src/routes/`
2. Add handler function
3. Use `auth` middleware if protected
4. Test with Postman or browser

### Q: Can I add email functionality?
**A:** Yes! Install `nodemailer`:
```bash
npm install nodemailer
```
Then add email service in `backend/src/services/emailService.js`

### Q: How do I handle file uploads?
**A:** Install `multer`:
```bash
npm install multer
```
Add middleware for file handling (e.g., profile pictures)

### Q: Can I add real-time features?
**A:** Yes! Install `socket.io`:
```bash
npm install socket.io socket.io-client
```
Implement WebSocket connection for real-time notifications

---

## 🚀 Deployment

### Q: Why use Vercel and Render instead of one service?
**A:**
- **Vercel**: Optimized for React (instant deploys, CDN, serverless)
- **Render**: Better for Node backends (persistent servers, cron jobs)
- **Separation**: Frontend and backend can scale independently

### Q: Can I deploy everything to Heroku?
**A:** Yes, but Heroku removed free tier. Vercel + Render combo is free and better optimized.

### Q: How do automatic deploys work?
**A:** 
1. Push code to GitHub
2. Vercel/Render detect changes
3. Auto-build and deploy
4. Live in ~2 minutes

### Q: Can I deploy to AWS/Azure/GCP?
**A:** Yes, but more complex:
- Frontend: S3 + CloudFront or App Service
- Backend: EC2/Lambda or App Service
- More configuration needed

### Q: My Render backend is slow on first request. Why?
**A:** Free tier "spins down" after 15 min inactivity. First request "wakes it up" (~30-60 seconds). Upgrade to paid tier ($7/mo) for always-on.

---

## 💰 Costs & Limits

### Q: Is this really free to run?
**A:** Yes! Free tiers:
- Vercel: 100GB bandwidth/month
- Render: 750 hours/month
- MongoDB Atlas: 512MB storage
- NewsAPI: 100 requests/day

### Q: What happens if I exceed free limits?
**A:**
- **Vercel**: $20/month for Pro
- **Render**: $7/month per service
- **MongoDB**: $9/month for 2GB RAM
- **NewsAPI**: $449/month for 250k requests

### Q: How many users can I support for free?
**A:** Depends on usage, but roughly:
- 100-200 active users/month
- NewsAPI = bottleneck (100 requests/day)
- Use RSS feeds to reduce NewsAPI calls

### Q: How do I reduce NewsAPI usage?
**A:**
1. Implement caching (Redis)
2. Use RSS feeds primarily
3. Only use NewsAPI for search
4. Set longer cache TTL

---

## 🔒 Security

### Q: Is JWT secure?
**A:** Yes, if implemented correctly:
- ✅ Use HTTPS (automatic on Vercel/Render)
- ✅ Strong secret (32+ characters)
- ✅ Short expiration (7 days max)
- ✅ Stored in localStorage (not cookies for SPA)

### Q: Should I use cookies instead of localStorage?
**A:** For SPAs, localStorage is fine. For SSR, use httpOnly cookies.

### Q: How do I prevent XSS attacks?
**A:** React prevents XSS by default (escapes values). Don't use `dangerouslySetInnerHTML` unless necessary.

### Q: What about SQL injection?
**A:** Not possible with MongoDB + Mongoose. Mongoose sanitizes inputs automatically.

### Q: Should I add rate limiting?
**A:** Yes, for production! Install `express-rate-limit`:
```bash
npm install express-rate-limit
```

---

## 🐛 Common Issues

### Q: "Cannot connect to MongoDB"
**A:** Check:
1. MONGO_URI format is correct
2. Username/password have no special chars (or URL encode them)
3. IP whitelist includes your IP (or 0.0.0.0/0)
4. Cluster is running (check Atlas dashboard)

### Q: "JWT token invalid"
**A:** Try:
1. Clear localStorage in browser (F12 → Application → Clear)
2. Logout and login again
3. Check JWT_SECRET matches between environments
4. Check token hasn't expired

### Q: "CORS error"
**A:** Fix:
1. Check CLIENT_URL in backend .env matches frontend URL
2. Restart backend after changing .env
3. Check CORS origin in backend index.js

### Q: "NewsAPI rate limit exceeded"
**A:** Solutions:
1. Wait 24 hours (resets daily)
2. Use RSS feeds instead
3. Implement caching
4. Upgrade to paid plan

### Q: Backend works locally but not on Render
**A:** Check:
1. Environment variables set in Render dashboard
2. Build logs for errors
3. Runtime logs for crashes
4. MongoDB URI is production URI (not localhost)

### Q: Frontend works locally but not on Vercel
**A:** Check:
1. VITE_API_URL points to Render backend
2. Build logs for errors
3. Console for runtime errors
4. Backend CORS allows Vercel URL

---

## 🎓 Learning & Customization

### Q: I'm new to React. Where should I start?
**A:** Learn in this order:
1. JavaScript ES6+ basics
2. React fundamentals (components, props, state)
3. React Hooks (useState, useEffect, useContext)
4. React Router
5. API calls with Axios

Resources: react.dev, youtube.com/c/TraversyMedia

### Q: I'm new to Node/Express. Where should I start?
**A:** Learn:
1. Node.js basics (modules, async/await)
2. Express routing and middleware
3. MongoDB and Mongoose
4. JWT authentication
5. REST API design

Resources: nodejs.org, expressjs.com

### Q: How do I add a new feature?
**A:**
1. Plan feature requirements
2. Design API endpoints (if needed)
3. Create backend routes
4. Create frontend components
5. Test locally
6. Deploy

### Q: Can I use this for my portfolio?
**A:** Absolutely! It demonstrates:
- Full-stack development
- Modern tech stack (MERN)
- Authentication & authorization
- External API integration
- Production deployment
- Clean code organization

---

## 📞 Getting Help

### Q: Where can I get help if stuck?
**A:**
1. Check documentation files (README, QUICKSTART, etc.)
2. Check this FAQ
3. Review code comments
4. Search Stack Overflow
5. Check GitHub issues
6. Ask in relevant Discord/Slack communities

### Q: How do I report a bug?
**A:**
1. Check if already reported
2. Create GitHub issue
3. Include:
   - Steps to reproduce
   - Expected vs actual behavior
   - Error messages
   - Environment (OS, Node version, browser)

### Q: Can I contribute improvements?
**A:** Yes!
1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

---

**Still have questions? Check the code comments or documentation!** 📚
