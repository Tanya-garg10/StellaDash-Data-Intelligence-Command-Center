# 🚀 StellaDash - Complete Setup Guide

This guide will help you set up StellaDash from scratch in under 10 minutes!

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Optional Features](#optional-features)
- [Troubleshooting](#troubleshooting)
- [Testing](#testing)

## Prerequisites

Before you begin, ensure you have:

### Required
- ✅ **Node.js 18+** - [Download](https://nodejs.org/)
- ✅ **Python 3.9+** - [Download](https://www.python.org/)
- ✅ **npm or yarn** - Comes with Node.js

### Optional (for advanced features)
- ⭐ **Gemini API Key** - For AI chat feature
- ☁️ **AWS Account** - For S3 cloud storage

### Check Your Installation
```bash
# Check Node.js version
node --version  # Should be 18.x or higher

# Check Python version
python --version  # Should be 3.9 or higher

# Check npm version
npm --version
```

## Quick Start

### 1️⃣ Clone & Install (5 minutes)

```bash
# Clone the repository
git clone <repository-url>
cd stelladash

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Install frontend dependencies
cd ../frontend
npm install
```

### 2️⃣ Start the Application (2 minutes)

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn app:app --reload
```
✅ Backend running on: http://localhost:8000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend running on: http://localhost:3000

### 3️⃣ Test It Out!

1. Open browser: http://localhost:3000
2. Upload `sample_data/sales_sample.csv`
3. Explore your dashboard! 🎉

## Detailed Setup

### Backend Setup

#### Step 1: Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

**What gets installed:**
- FastAPI - Web framework
- Pandas - Data analysis
- NumPy - Numerical computing
- Boto3 - AWS SDK (optional)
- Google Generative AI - Gemini API (optional)

#### Step 2: Configure Environment (Optional)
```bash
# Copy example file
cp .env.example .env

# Edit .env file (optional)
nano .env  # or use any text editor
```

**Environment Variables:**
```bash
# Optional: Gemini AI for chat feature
GEMINI_API_KEY=your_key_here

# Optional: AWS S3 for cloud storage
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_BUCKET_NAME=stelladash-uploads
AWS_REGION=us-east-1
```

#### Step 3: Start Backend Server
```bash
uvicorn app:app --reload
```

**Expected Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

**Test Backend:**
```bash
# Open in browser or use curl
curl http://localhost:8000
# Should return: {"status": "StellaDash API Running"}
```

### Frontend Setup

#### Step 1: Install Node Dependencies
```bash
cd frontend
npm install
```

**What gets installed:**
- Next.js - React framework
- TailwindCSS - Styling
- Recharts - Charts library
- jsPDF - PDF generation
- Axios - HTTP client

#### Step 2: Configure Environment (Optional)
```bash
# Copy example file
cp .env.example .env.local

# Usually no changes needed
```

**Default Configuration:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Step 3: Start Development Server
```bash
npm run dev
```

**Expected Output:**
```
▲ Next.js 14.1.0
- Local:        http://localhost:3000
✓ Ready in 2.5s
```

**Test Frontend:**
Open browser: http://localhost:3000

## Optional Features

### 🤖 Enable AI Chat (Gemini API)

#### Step 1: Get API Key
1. Visit: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key

#### Step 2: Add to Backend
```bash
# Edit backend/.env
GEMINI_API_KEY=your_actual_key_here
```

#### Step 3: Restart Backend
```bash
cd backend
uvicorn app:app --reload
```

#### Step 4: Test
1. Upload a CSV file
2. Scroll to "Ask Your Data" section
3. Enter your API key in the UI
4. Ask questions like "What is the average age?"

### ☁️ Enable AWS S3 Storage

#### Step 1: Create S3 Bucket
1. Go to AWS Console → S3
2. Click "Create bucket"
3. Name: `stelladash-uploads`
4. Region: `us-east-1` (or your preferred region)
5. Keep default settings
6. Click "Create bucket"

#### Step 2: Create IAM User
1. Go to AWS Console → IAM
2. Click "Users" → "Add user"
3. Username: `stelladash-app`
4. Access type: "Programmatic access"
5. Attach policy: `AmazonS3FullAccess`
6. Copy Access Key ID and Secret Access Key

#### Step 3: Configure Backend
```bash
# Edit backend/.env
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_BUCKET_NAME=stelladash-uploads
AWS_REGION=us-east-1
```

#### Step 4: Restart Backend
```bash
cd backend
uvicorn app:app --reload
```

#### Step 5: Test
1. Upload a CSV file
2. Check dashboard - should show "☁️ Stored in AWS S3"
3. Verify in AWS Console → S3 → your bucket

## Troubleshooting

### Backend Issues

#### ❌ "Module not found" error
```bash
# Solution: Reinstall dependencies
cd backend
pip install -r requirements.txt --force-reinstall
```

#### ❌ "Port 8000 already in use"
```bash
# Solution: Kill existing process
# Windows:
netstat -ano | findstr :8000
taskkill /PID <process_id> /F

# Mac/Linux:
lsof -ti:8000 | xargs kill -9

# Or use different port:
uvicorn app:app --reload --port 8001
```

#### ❌ "Python not found"
```bash
# Try python3 instead
python3 --version
python3 -m pip install -r requirements.txt
python3 -m uvicorn app:app --reload
```

### Frontend Issues

#### ❌ "npm command not found"
```bash
# Install Node.js from: https://nodejs.org/
# Then verify:
node --version
npm --version
```

#### ❌ "Port 3000 already in use"
```bash
# Next.js will automatically use port 3001
# Or kill existing process:
# Windows:
netstat -ano | findstr :3000
taskkill /PID <process_id> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

#### ❌ "Module not found" error
```bash
# Solution: Clear cache and reinstall
cd frontend
rm -rf .next node_modules
npm install
npm run dev
```

#### ❌ Charts not rendering
```bash
# Solution: Hard refresh browser
# Windows/Linux: Ctrl + Shift + R
# Mac: Cmd + Shift + R

# Or clear browser cache
```

### CORS Issues

#### ❌ "CORS policy blocked"
```bash
# Check backend is running on port 8000
# Check frontend API URL in .env.local
# Restart both servers
```

### PDF Export Issues

#### ❌ Blank PDF or missing content
```bash
# Solution:
1. Wait for all charts to load completely
2. Ensure browser zoom is at 100%
3. Try in Chrome/Edge (best compatibility)
4. Check browser console for errors
```

## Testing

### Test with Sample Data

```bash
# Sample file included
sample_data/sales_sample.csv

# Contains:
- 10 rows
- Multiple regions (North, South, East, West)
- Products (Widget A, B, C)
- Sales and Units data
```

### Test Checklist

- [ ] Backend starts without errors
- [ ] Frontend loads at localhost:3000
- [ ] Can upload CSV file
- [ ] Dashboard displays correctly
- [ ] KPI cards show data
- [ ] Charts render properly
- [ ] Filters work (if categorical data)
- [ ] PDF export downloads
- [ ] Insights panel shows data

### Performance Test

```bash
# Test with large file (50K rows)
# Expected:
- Upload: < 2 seconds
- Dashboard render: < 1 second
- PDF export: 2-3 seconds
```

## Production Deployment

### Frontend (Vercel)

```bash
cd frontend
npm run build  # Test build locally
vercel deploy  # Deploy to Vercel
```

### Backend (Railway/Render)

```bash
cd backend
# Add Procfile:
echo "web: uvicorn app:app --host 0.0.0.0 --port $PORT" > Procfile

# Deploy using platform CLI or web interface
```

### Environment Variables in Production

**Frontend (Vercel):**
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

**Backend (Railway/Render):**
```
GEMINI_API_KEY=your_key
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_BUCKET_NAME=stelladash-uploads
AWS_REGION=us-east-1
```

## Development Tips

### Hot Reload
Both servers support hot reload:
- Backend: Changes auto-reload with `--reload` flag
- Frontend: Next.js auto-refreshes on file changes

### Debug Mode

**Backend:**
```bash
# Enable debug logging
uvicorn app:app --reload --log-level debug
```

**Frontend:**
```bash
# Check browser console (F12)
# React DevTools recommended
```

### Code Quality

```bash
# Backend linting
cd backend
pip install pylint
pylint app.py

# Frontend linting
cd frontend
npm run lint
```

## Next Steps

1. ✅ **Customize UI** - Edit `frontend/components/Dashboard.js`
2. ✅ **Add Features** - Extend `backend/app.py`
3. ✅ **Deploy** - Follow production deployment guide
4. ✅ **Share** - Show off your dashboard!

## Support

### Getting Help

- 📖 Check [README.md](README.md) for overview
- 🐛 Check [Troubleshooting](#troubleshooting) section
- 💬 Open GitHub issue
- 📧 Contact: tanyagarg5315@gmail.com

### Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Pandas Docs](https://pandas.pydata.org/docs/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Recharts Docs](https://recharts.org/)

## Success! 🎉

If you've made it here, your StellaDash is ready to use!

**Quick Test:**
1. Upload `sample_data/sales_sample.csv`
2. Explore the dashboard
3. Try filters
4. Export PDF
5. Share with friends! 🚀

**Made with 💜**
