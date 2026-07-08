# 🏗️ NewsHub Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         NewsHub System                           │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Browser    │ ◄─────► │   Vercel     │ ◄─────► │    Render    │
│  (React UI)  │  HTTPS  │  (Frontend)  │   API   │  (Backend)   │
└──────────────┘         └──────────────┘         └──────────────┘
                                                           │
                                                           │ Mongoose
                                                           ▼
                         ┌──────────────┐         ┌──────────────┐
                         │   NewsAPI    │         │   MongoDB    │
                         │     RSS      │ ◄─────► │    Atlas     │
                         │   Feeds      │  Fetch  │  (Database)  │
                         └──────────────┘         └──────────────┘
```

---

## Component Breakdown

### 🎨 Frontend (React + Vite)

**Location**: `frontend/`

```
User Interface (React)
├── Pages
│   ├── Login.jsx           - User login form
│   ├── Register.jsx        - User registration
│   ├── Dashboard.jsx       - Main news feed
│   └── Account.jsx         - User settings
│
├── Components
│   ├── Navbar.jsx          - Navigation + logout
│   ├── NewsCard.jsx        - Individual article display
│   └── FilterPanel.jsx     - Search & filter UI
│
├── Context
│   └── AuthContext.jsx     - Global auth state
│
└── Services
    └── api.js              - Axios HTTP client
```

**Key Technologies**:
- React 18 with hooks
- React Router for navigation
- Axios for API calls
- CSS Modules for styling
- Vite for fast builds

---

### ⚙️ Backend (Node + Express)

**Location**: `backend/`

```
REST API Server (Express)
├── Models
│   └── User.js             - MongoDB user schema
│                            - Embedded preferences
│                            - Password hashing
│
├── Routes
│   ├── auth.js             - POST /login, /register
│   ├── user.js             - PUT /profile, /password, /preferences
│   └── news.js             - GET /feed, /recommendations
│
├── Middleware
│   └── auth.js             - JWT verification
│                            - Request authentication
│
├── Services
│   └── newsService.js      - NewsAPI integration
│                            - RSS feed parsing
│                            - Article aggregation
│
└── index.js                - Express app setup
                             - MongoDB connection
                             - CORS config
```

**Key Technologies**:
- Express.js for REST API
- Mongoose for MongoDB ODM
- JWT for authentication
- bcryptjs for password hashing
- node-fetch for HTTP requests
- rss-parser for RSS feeds

---

## 🔄 Data Flow

### Authentication Flow

```
1. User Registration/Login
   ┌─────────┐
   │ Browser │
   └────┬────┘
        │ POST /api/auth/register {username, email, password}
        ▼
   ┌─────────┐
   │ Express │
   └────┬────┘
        │ bcrypt.hash(password)
        ▼
   ┌─────────┐
   │ MongoDB │ Save user
   └────┬────┘
        │ User created
        ▼
   ┌─────────┐
   │ Express │ Generate JWT token
   └────┬────┘
        │ {token, user}
        ▼
   ┌─────────┐
   │ Browser │ Store token in localStorage
   └─────────┘
```

### News Feed Flow

```
2. Fetch News Articles
   ┌─────────┐
   │ Browser │
   └────┬────┘
        │ GET /api/news/feed
        │ Authorization: Bearer <token>
        ▼
   ┌─────────┐
   │ Express │ Verify JWT
   └────┬────┘
        │ Extract user preferences
        ▼
   ┌──────────┐
   │ News     │ 1. Try RSS feed for newspaper
   │ Service  │ 2. Fallback to NewsAPI
   └────┬─────┘ 3. Filter by language, area
        │
        ├─────► NewsAPI.org (HTTP request)
        │       └─► Articles JSON
        │
        └─────► RSS Feeds (HTTP + XML parsing)
                └─► Articles JSON
        │
        ▼
   ┌─────────┐
   │ Express │ Combine & deduplicate articles
   └────┬────┘
        │ {articles: [...]}
        ▼
   ┌─────────┐
   │ Browser │ Render news cards
   └─────────┘
```

---

## 🗄️ Database Schema

### User Collection

```javascript
{
  _id: ObjectId("..."),
  username: "john_doe",
  email: "john@example.com",
  password: "$2a$12$...",  // bcrypt hashed
  preferences: {
    uiLanguage: "en",
    newsLanguage: "en",
    edition: "digital",
    area: "hyderabad",
    newspaper: "the_hindu",
    keywords: "politics, technology, sports"
  },
  createdAt: ISODate("2024-01-15T10:30:00Z"),
  updatedAt: ISODate("2024-01-20T15:45:00Z")
}
```

**Indexes**:
- `username` (unique)
- `email` (unique)

---

## 🔐 Security Architecture

### JWT Authentication

```
┌──────────────────────────────────────────┐
│  Every Protected API Request             │
└──────────────────────────────────────────┘

1. Frontend sends request with token:
   Authorization: Bearer eyJhbGc...

2. Backend auth middleware:
   ├─ Extract token from header
   ├─ Verify with JWT_SECRET
   ├─ Decode user ID
   ├─ Fetch user from MongoDB
   └─ Attach to req.user

3. Route handler:
   ├─ Access authenticated user
   └─ Process request

4. If invalid/expired:
   ├─ Return 401 Unauthorized
   └─ Frontend redirects to login
```

### Password Security

- Passwords hashed with bcrypt (12 rounds)
- Never stored or transmitted in plain text
- Comparison done server-side only
- JWT tokens expire (configurable)

---

## 🌐 API Integration

### NewsAPI.org

```
Endpoint: https://newsapi.org/v2/everything

Parameters:
├─ q: "India" OR keywords
├─ language: "en", "hi", "te", etc.
├─ from: "2024-01-15" (optional)
├─ pageSize: 20
└─ apiKey: <YOUR_KEY>

Response:
{
  "articles": [
    {
      "source": {"name": "BBC News"},
      "title": "...",
      "description": "...",
      "url": "https://...",
      "urlToImage": "https://...",
      "publishedAt": "2024-01-15T10:30:00Z"
    }
  ]
}

Limits (Free Tier):
- 100 requests/day
- 1 request/second
- Results from last 30 days
```

### RSS Feeds

```
50+ newspapers supported:

English National:
- Times of India, The Hindu, Indian Express, etc.

English International:
- BBC, Reuters, Guardian, Al Jazeera

Regional:
- Eenadu (Telugu)
- Dainik Jagran (Hindi)
- Malayala Manorama (Malayalam)
- And many more...

Parsing:
- rss-parser library
- Converts XML to JSON
- Extracts title, description, link, image, date
- Normalizes format to match NewsAPI
```

---

## 📊 Performance Considerations

### Frontend Optimization
- Lazy loading for images
- CSS Modules (scoped, tree-shaken)
- Vite's instant HMR
- Code splitting by route
- Minimal bundle size

### Backend Optimization
- Mongoose lean queries
- Connection pooling
- Efficient RSS parsing (8s timeout)
- Parallel API requests (Promise.all)
- CORS preflight caching

### Database Optimization
- Indexed username/email lookups
- Embedded preferences (no joins)
- Connection string options (retryWrites, w:majority)

---

## 🚀 Deployment Architecture

### Production Setup

```
User Request Flow:

1. Browser
   └─► https://newshub.vercel.app
       │
       ├─ Vercel Edge Network (CDN)
       │  ├─ Static assets cached
       │  └─ React app served
       │
       └─► API calls to backend

2. API Requests
   └─► https://newshub-backend.onrender.com/api/*
       │
       ├─ Render Load Balancer
       ├─ Express.js server
       │  ├─ JWT verification
       │  ├─ Business logic
       │  └─ MongoDB queries
       │
       └─► External services
           ├─ MongoDB Atlas (Ireland/US)
           ├─ NewsAPI.org
           └─ RSS feeds (various)
```

### Scaling Strategy

**Horizontal Scaling**:
- Frontend: Automatic (Vercel CDN)
- Backend: Add more Render instances
- Database: MongoDB Atlas auto-scaling

**Vertical Scaling**:
- Render: Upgrade instance size
- MongoDB: Increase RAM/storage tier

---

## 🔄 Development Workflow

```
Developer
   │
   ├─ Edit code locally
   ├─ Test with npm run dev
   ├─ Commit to Git
   │
   ▼
GitHub Repository
   │
   ├─► Vercel (frontend)
   │   └─ Auto-build & deploy
   │
   └─► Render (backend)
       └─ Auto-build & deploy
```

---

## 📈 Future Enhancements

1. **Caching Layer** - Redis for API responses
2. **Queue System** - Bull/RabbitMQ for background jobs
3. **Elasticsearch** - Full-text search
4. **WebSockets** - Real-time notifications
5. **CDN for Images** - Cloudinary integration
6. **Rate Limiting** - Express-rate-limit
7. **Monitoring** - Sentry, LogRocket
8. **Analytics** - Google Analytics, Mixpanel

---

**Architecture designed for scalability and maintainability** 🚀
