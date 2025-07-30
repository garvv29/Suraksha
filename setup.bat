@echo off
echo ============================================
echo    Suraksha Medical Training Management
echo ============================================
echo.

echo [1/4] Setting up Backend Dependencies...
cd backend
echo Installing Python packages...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Error installing Python packages. Please check your Python installation.
    pause
    exit /b 1
)

echo.
echo [2/4] Setting up Frontend Dependencies...
cd ..\frontend
echo Installing Node.js packages...
npm install
if %errorlevel% neq 0 (
    echo Error installing Node.js packages. Please check your Node.js installation.
    pause
    exit /b 1
)

echo.
echo [3/4] Database Setup Instructions:
echo =====================================
echo 1. Make sure MySQL Server is running
echo 2. Run this command in MySQL:
echo    mysql -u root -p ^< ..\database\schema.sql
echo 3. Update MySQL password in backend\app.py if needed
echo.

echo [4/4] Ready to Start!
echo ===================
echo To start the application:
echo 1. Backend: cd backend && python app.py
echo 2. Frontend: cd frontend && npm start
echo.
echo Demo Credentials:
echo - Admin: Username="admin", Password="admin123"
echo - Professional: Username="drsmith", Password="9876543210"
echo.
pause
