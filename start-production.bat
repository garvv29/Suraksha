@echo off
echo Starting Suraksha in Production Mode...
echo =====================================
cd backend
set FLASK_ENV=production
set SECRET_KEY=suraksha-production-secret-key-2024
gunicorn --bind 0.0.0.0:5000 --workers 4 app:app
