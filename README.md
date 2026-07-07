# 🚀 NewsHub - Modern Full-Stack News Aggregator

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/atlas)
[![JWT](https://img.shields.io/badge/Auth-JWT-orange.svg)](https://jwt.io/)

> A production-ready news aggregation platform with personalized feeds, multi-language support, and intelligent recommendations.

## 🎯 Tech Stack

### Frontend
- **React 18** + **Vite** - Lightning-fast development
- **React Router** - Client-side routing
- **Axios** - HTTP client with interceptors
- **CSS Modules** - Scoped styling
- **Deployment**: Vercel

### Backend
- **Node.js** + **Express.js** - REST API server
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **JWT** - Secure authentication
- **bcryptjs** - Password hashing
- **NewsAPI + RSS Parser** - Multi-source news aggregation
- **Deployment**: Render

## ✨ Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 📰 **Multi-Source News** - NewsAPI + RSS feeds from 50+ newspapers
- 🌍 **Multi-Language Support** - English, Hindi, Telugu, Tamil, Kannada, Malayalam, and more
- 🎯 **Personalized Feeds** - Based on user preferences and keywords
- ⭐ **Smart Recommendations** - Keyword-based article suggestions
- 🔍 **Advanced Search** - Filter by language, area, newspaper, date
- ⚙️ **User Preferences** - Customizable settings for UI and news
- 📱 **Responsive Design** - Mobile-first approach

## 📁 Project Structure

```
newshub/
├── backend/
│   ├── src/
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Express route handlers
│   │   ├── middleware/      # Auth middleware
│   │   ├── services/        # Business logic (NewsAPI, RSS)
│   │   └── index.js         # App entry point
│   ├── package.json
│   ├── .env.example
│   └── render.yaml          # Render deployment config
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable UI components
    │   ├── pages/           # Route pages
    │   ├── context/         # React Context (Auth)
    │   ├── services/        # API service (Axios)
    │   ├── App.jsx          # Main app with routing
    │   └── main.jsx         # React entry point
    ├── public/
    ├── package.json
    ├── vite.config.js
    └── vercel.json          # Vercel deployment config
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier available)
- NewsAPI key (get from https://newsapi.org)

### Backend Setup

1. Navigate to backend:
```bash
cd newshub/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/newshub?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
NEWS_API_KEY=your_newsapi_key_here
CLIENT_URL=http://localhost:3000
```

4. Start dev server:
```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend:
```bash
cd newshub/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000
```

4. Start dev server:
```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### User Management
- `GET /api/user/preferences` - Get user preferences
- `PUT /api/user/preferences` - Update preferences
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/password` - Change password

### News
- `GET /api/news/feed` - Get personalized news feed
- `GET /api/news/recommendations` - Get recommended articles
- `GET /api/news/meta` - Get area/newspaper metadata

## 🔧 Configuration

### MongoDB Atlas Setup
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create cluster and database user
3. Whitelist your IP or use `0.0.0.0/0` for testing
4. Copy connection string to `.env`

### NewsAPI Setup
1. Sign up at [NewsAPI](https://newsapi.org)
2. Get free API key (100 requests/day)
3. Add key to backend `.env`

## 🚢 Deployment

### Deploy Backend to Render
1. Push code to GitHub
2. Connect Render to your repository
3. Select `backend` folder as root
4. Add environment variables from `.env`
5. Deploy

### Deploy Frontend to Vercel
1. Push code to GitHub
2. Import project to Vercel
3. Set root directory to `frontend`
4. Add environment variable: `VITE_API_URL=<your-render-backend-url>`
5. Deploy

## 🎨 Features in Detail

### User Preferences
- UI Language selection
- News language preference
- Default area/city
- Preferred newspaper
- Custom keywords for personalized feed

### News Sources
- **English**: Times of India, The Hindu, Indian Express, BBC, Reuters, Guardian, CNN
- **Hindi**: Dainik Jagran, Dainik Bhaskar, Amar Ujala
- **Telugu**: Eenadu, Sakshi, Andhra Jyothy
- **Tamil**: Dina Thanthi, Dinamalar
- **Kannada**: Vijaya Karnataka, Prajavani
- **Malayalam**: Malayala Manorama, Mathrubhumi
- And many more via RSS feeds

## 🔐 Security

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens with configurable expiry
- Protected API routes with auth middleware
- CORS enabled for specified origins
- Input validation on all endpoints

## 📊 Performance

- Lazy loading for images
- CSS modules for optimized styling
- Vite for fast frontend builds
- Efficient MongoDB queries with indexes
- API response caching ready

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- NewsAPI for news data
- MongoDB Atlas for database hosting
- Vercel & Render for deployment platforms

---

**Built with ❤️ using the MERN stack**
