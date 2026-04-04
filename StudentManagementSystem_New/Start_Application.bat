@echo off
echo =======================================================
echo Starting Full Stack Student Management System...
echo =======================================================
echo.

echo [1/2] Launching Backend Server (Node.js)...
start "Backend Server" cmd /k "cd backend && echo Installing backend dependencies... && npm install && echo Seeding database... && npm run seed && echo Starting Backend... && node server.js"

echo [2/2] Launching Frontend Server (React/Vite)...
start "Frontend Server" cmd /k "cd frontend && echo Installing frontend dependencies... && npm install && echo Starting Frontend... && npm run dev"

echo.
echo Both servers are opening in new windows right now.
echo Please wait a moment for them to install dependencies and start.
echo.
pause
