# 🚀 NewsHub - Complete Installation Guide for Windows

## ⚠️ IMPORTANT: You Need Node.js First!

### Step 1: Install Node.js

1. **Download Node.js**
   - Go to: https://nodejs.org
   - Download "LTS" version (Long Term Support)
   - Current recommended: Node.js 20.x or 18.x

2. **Install Node.js**
   - Run the downloaded installer (.msi file)
   - Click "Next" through all steps
   - Accept default settings
   - Click "Install"
   - Click "Finish"

3. **Verify Installation**
   - Open NEW Command Prompt (important: close old one)
   - Run these commands:
   ```cmd
   node --version
   npm --version
   ```
   - You should see version numbers (e.g., v20.11.0 and 10.2.4)

---

## Step 2: Get Your Credentials

### A. MongoDB Atlas (Database)

1. **Sign Up**
   - Go to: https://www.mongodb.com/atlas
   - Click "Try Free"
   - Sign up with email/Google/GitHub

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select region (choose closest to you)
   - Click "Create"
   - Wait 3-5 minutes for deployment

3. **Create Database User**
   - Go to "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `newshub_user`
   - Password: Click "Autogenerate Secure Password" (COPY THIS!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Allow Network Access**
   - Go to "Network Access" (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" (left sidebar)
   - Click "Connect" on your cluster
   - Click "Connect your application"
   - Copy the connection string (looks like):
     ```
     mongodb+srv://newshub_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<password>` with the password you copied earlier
   - Add `/newshub` after `.net` (database name)
   - Final string looks like:
     ```
     mongodb+srv://newshub_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/newshub?retryWrites=true&w=majority
     ```

### B. NewsAPI Key

1. **Sign Up**
   - Go to: https://newsapi.org
   - Click "Get API Key"
   - Fill in:
     - First name
     - Email
     - Password
   - Click "Submit"

2. **Get Key**
   - Check your email for confirmation
   - Click confirmation link
   - Login to NewsAPI
   - Copy your API key (looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

### C. JWT Secret

- Just make up a random string (minimum 32 characters)
- Example: `my_super_secret_jwt_key_2024_newshub_app_secure`
- Or use a password generator
- Save it somewhere (you'll need it in .env file)

---

## Step 3: Configure Environment Files

### Backend Configuration

1. **Open File**
   ```
   C:\Users\jaswa\Downloads\ML project\newshub\backend\.env
   ```

2. **Edit These Lines** (already created, just update values):
   ```env
   MONGO_URI=<paste your MongoDB connection string here>
   JWT_SECRET=<paste your random JWT secret here>
   NEWS_API_KEY=<paste your NewsAPI key here>
   ```

3. **Example** (with your actual values):
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://newshub_user:MyPass123@cluster0.abc123.mongodb.net/newshub?retryWrites=true&w=majority
   JWT_SECRET=my_super_secret_jwt_key_2024_newshub_app_secure
   JWT_EXPIRES_IN=7d
   NEWS_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
   CLIENT_URL=http://localhost:3000
   ```

4. **Save the file**

### Frontend Configuration

The file `frontend\.env` is already created and correct:
```env
VITE_API_URL=http://localhost:5000
```

No changes needed!

---

## Step 4: Install Dependencies

### Open Command Prompt

1. Press `Windows + R`
2. Type `cmd`
3. Press Enter

### Install Backend Dependencies

```cmd
cd "C:\Users\jaswa\Downloads\ML project\newshub\backend"
npm install
```

Wait 1-2 minutes. You'll see packages being installed.

### Install Frontend Dependencies

```cmd
cd "C:\Users\jaswa\Downloads\ML project\newshub\frontend"
npm install
```

Wait 1-2 minutes. You'll see packages being installed.

---

## Step 5: Start the Application

### Option A: Two Separate Terminals (Recommended)

**Terminal 1 - Backend:**
```cmd
cd "C:\Users\jaswa\Downloads\ML project\newshub\backend"
npm run dev
```

You should see:
```
MongoDB connected
Server running on port 5000
```

**Terminal 2 - Frontend (open NEW command prompt):**
```cmd
cd "C:\Users\jaswa\Downloads\ML project\newshub\frontend"
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

### Option B: Single Terminal (Sequential)

Start backend first, then start frontend in another terminal.

---

## Step 6: Open the App

1. **Open Browser**
   - Chrome, Edge, or Firefox

2. **Navigate to**
   ```
   http://localhost:3000
   ```

3. **Test Registration**
   - Click "Register"
   - Fill in:
     - Username: `testuser`
     - Email: `test@example.com`
     - Password: `password123`
     - Confirm Password: `password123`
   - Click "Register"

4. **Test Dashboard**
   - You should see the news dashboard
   - Articles should load
   - Try searching for "technology"
   - Try opening filter panel

---

## ✅ Verification Checklist

- [ ] Node.js installed (check with `node --version`)
- [ ] MongoDB Atlas cluster created
- [ ] MongoDB connection string obtained
- [ ] NewsAPI key obtained
- [ ] JWT secret created
- [ ] Backend .env file configured
- [ ] Backend dependencies installed (`npm install`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Browser opens http://localhost:3000
- [ ] Registration works
- [ ] Login works
- [ ] Dashboard shows news articles

---

## 🐛 Common Issues

### Issue: "npm is not recognized"

**Solution:**
1. Install Node.js from https://nodejs.org
2. Close ALL command prompts
3. Open NEW command prompt
4. Try again

### Issue: "MongoDB connection error"

**Solutions:**
1. Check MONGO_URI is correct in backend\.env
2. Verify password doesn't have special characters (or URL encode them)
3. Ensure Network Access allows 0.0.0.0/0 in Atlas
4. Check cluster is deployed (not paused)

### Issue: "Port 5000 already in use"

**Solution:**
1. Change PORT in backend\.env to 5001
2. Update VITE_API_URL in frontend\.env to http://localhost:5001
3. Restart servers

### Issue: "Cannot connect to backend"

**Solutions:**
1. Ensure backend is running (check Terminal 1)
2. Check CLIENT_URL in backend\.env is http://localhost:3000
3. Check VITE_API_URL in frontend\.env is http://localhost:5000
4. Restart both servers

### Issue: "NewsAPI rate limit"

**Solution:**
- Free tier = 100 requests/day
- Wait 24 hours for reset
- Use RSS feeds instead (automatic fallback)

### Issue: "No articles showing"

**Solutions:**
1. Check backend terminal for errors
2. Check browser console (F12) for errors
3. Verify NewsAPI key is correct
4. Try different search terms

---

## 🎯 Quick Command Reference

### Start Backend
```cmd
cd "C:\Users\jaswa\Downloads\ML project\newshub\backend"
npm run dev
```

### Start Frontend
```cmd
cd "C:\Users\jaswa\Downloads\ML project\newshub\frontend"
npm run dev
```

### Stop Servers
- Press `Ctrl + C` in terminal
- Type `Y` and press Enter

### Restart Servers
1. Stop with Ctrl+C
2. Run start command again

---

## 📞 Need More Help?

1. **Check Documentation**
   - PROJECT_SUMMARY.md
   - FAQ.md
   - README.md

2. **Check Logs**
   - Backend terminal shows API errors
   - Browser console (F12) shows frontend errors

3. **Test Components**
   - Backend health: http://localhost:5000/api/health
   - Should return: `{"status":"ok"}`

---

## 🎉 Success!

If you can:
- ✅ Open http://localhost:3000
- ✅ Register an account
- ✅ See news articles

**You're all set! The app is running perfectly!** 🚀

---

## 🚀 Next Steps

1. **Customize**
   - Change colors in frontend/src/index.css
   - Add more newspapers in backend/src/services/newsService.js

2. **Deploy to Production**
   - Follow DEPLOYMENT.md
   - Deploy to Vercel (frontend) + Render (backend)
   - Free hosting available!

3. **Add Features**
   - Check ARCHITECTURE.md for system design
   - Add new API endpoints
   - Create new React components

---

**Enjoy your NewsHub app!** 📰✨
