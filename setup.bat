@echo off
echo ========================================
echo NewsHub - Quick Setup Script
echo ========================================
echo.

echo [1/4] Setting up Backend...
cd backend
if not exist .env (
    echo Creating .env from template...
    copy .env.example .env
    echo.
    echo IMPORTANT: Edit backend\.env and add your MongoDB URI, JWT Secret, and NewsAPI key
    echo.
)
echo Installing backend dependencies...
call npm install
cd ..

echo.
echo [2/4] Setting up Frontend...
cd frontend
if not exist .env (
    echo Creating .env from template...
    copy .env.example .env
)
echo Installing frontend dependencies...
call npm install
cd ..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Edit backend\.env with your credentials
echo    - MongoDB Atlas URI
echo    - JWT_SECRET (any random string)
echo    - NEWS_API_KEY from https://newsapi.org
echo.
echo 2. Start the backend:
echo    cd backend
echo    npm run dev
echo.
echo 3. Start the frontend (in new terminal):
echo    cd frontend
echo    npm run dev
echo.
echo 4. Open http://localhost:3000 in your browser
echo.
pause
