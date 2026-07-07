# ⚡ NewsHub - Quick Start Guide

## 🎯 What You Have

A complete **MERN stack** news aggregator replacing your Django project with:
- ✅ React.js frontend (Vite)
- ✅ Node.js + Express backend
- ✅ MongoDB Atlas database
- ✅ JWT authentication
- ✅ NewsAPI + RSS integration
- ✅ Ready for Vercel + Render deployment

---

## 🏃 Get Running in 5 Minutes

### Option 1: Automated Setup (Windows)

```bash
cd "C:\Users\jaswa\Downloads\ML project\newshub"
setup.bat
```

Then edit `backend\.env` with your credentials and start both servers.

### Option 2: Manual Setup

**Backend:**
```bash
cd newshub/backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and NewsAPI key
npm run dev
```

**Frontend (in new terminal):**
```bash
cd newshub/frontend
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:3000` 🎉

---

## 🔑 Required Credentials

You need these **3 things**:

1. **MongoDB Atlas URI**
   - Sign up at https://www.mongodb.com/atlas
   - Create free cluster
   - Get connection string

2. **JWT Secret**
   - Any random string (min 32 characters)
   - Example: `my_super_secret_jwt_key_12345678`

3. **NewsAPI Key**
   - Get free key at https://newsapi.org
   - 100 requests/day on free tier

---

## 📂 Project Structure

```
newshub/
├── backend/              # Express API server
│   ├── src/
│   │   ├── models/      # User schema with preferences
│   │   ├── routes/      # auth, user, news endpoints
│   │   ├── middleware/  # JWT verification
│   │   ├── services/    # NewsAPI + RSS logic
│   │   └── index.js     # Server entry
│   └── package.json
│
├── frontend/             # React app
│   ├── src/
│   │   ├── components/  # Navbar, NewsCard, FilterPanel
│   │   ├── pages/       # Login, Register, Dashboard, Account
│   │   ├── context/     # Auth context
│   │   └── services/    # Axios API client
│   └── package.json
│
├── README.md            # Full documentation
├── DEPLOYMENT.md        # Deploy to production guide
└── setup.bat            # Automated setup script
```

---

## 🎨 Features Included

### User Features
- ✅ Register & Login with JWT
- ✅ Personalized news feed
- ✅ Multi-language support (10+ languages)
- ✅ Advanced filtering (area, newspaper, date)
- ✅ Keyword-based recommendations
- ✅ User preferences management
- ✅ Password change
- ✅ Responsive dark theme UI

### Technical Features
- ✅ JWT authentication with auto-refresh
- ✅ Protected routes
- ✅ MongoDB with Mongoose ODM
- ✅ NewsAPI + RSS aggregation
- ✅ bcrypt password hashing
- ✅ CORS configuration
- ✅ Environment-based config
- ✅ Production-ready error handling

---

## 🚀 Deployment

See `DEPLOYMENT.md` for detailed instructions.

**TL;DR:**
1. Push to GitHub
2. Deploy backend to Render (free)
3. Deploy frontend to Vercel (free)
4. Add environment variables
5. Done! 🎉

---

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Sign in
- `GET /api/auth/me` - Get current user

### User
- `GET /api/user/preferences` - Get prefs
- `PUT /api/user/preferences` - Update prefs
- `PUT /api/user/profile` - Update email
- `PUT /api/user/password` - Change password

### News
- `GET /api/news/feed?query=...` - Get articles
- `GET /api/news/recommendations` - Get recommended
- `GET /api/news/meta` - Get metadata

---

## 🔧 Development Workflow

1. **Make changes** to code
2. **Test locally** with `npm run dev`
3. **Commit** to Git
4. **Push** to GitHub
5. **Auto-deploys** to Vercel/Render

---

## 📦 Tech Stack Comparison

| Old (Django) | New (MERN) |
|-------------|-----------|
| Django | Express.js |
| SQLite | MongoDB Atlas |
| Django Templates | React.js |
| Session Auth | JWT |
| Jinja2 | JSX |
| pip | npm |
| Python | JavaScript |

---

## 🆘 Common Issues

**"Cannot connect to MongoDB"**
→ Check MONGO_URI in .env and whitelist IP in Atlas

**"JWT token invalid"**
→ Clear localStorage and login again

**"NewsAPI rate limit"**
→ Free tier = 100 requests/day, wait or upgrade

**"Backend not responding"**
→ Check if backend server is running on port 5000

**"CORS error"**
→ Verify CLIENT_URL in backend .env matches frontend

---

## 📚 Next Steps

1. ✅ Run locally and test all features
2. 📝 Customize UI colors/styles
3. 🗄️ Add more newspapers to RSS list
4. 🚀 Deploy to production
5. 🎯 Add analytics (Google Analytics)
6. 📧 Add email notifications
7. 🔔 Add push notifications
8. 📱 Build mobile app (React Native)

---

## 🤝 Need Help?

- Check `README.md` for full documentation
- Check `DEPLOYMENT.md` for deployment help
- Review code comments for implementation details
- Open GitHub issues for bugs

---

**Built with ❤️ - Ready for production!**
