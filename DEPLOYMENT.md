# 🚀 StellaDash - Deployment Guide

Complete guide to deploy StellaDash to production with free hosting options!

## 📋 Table of Contents
- [Deployment Options](#deployment-options)
- [Frontend Deployment](#frontend-deployment)
- [Backend Deployment](#backend-deployment)
- [Full Stack Deployment](#full-stack-deployment)
- [Post-Deployment](#post-deployment)

---

## 🎯 Deployment Order (IMPORTANT!)

### Why Backend First?

Frontend needs backend URL to work! Follow this order:

```
1. Deploy Backend → Get URL
2. Update Frontend with Backend URL
3. Deploy Frontend → Done!
```

### Quick Deployment Flow

```bash
# Step 1: Deploy Backend (Railway)
cd backend
railway up
# Get URL: https://stelladash-production.up.railway.app

# Step 2: Update Frontend
cd ../frontend
# Edit .env.local or add in Vercel:
NEXT_PUBLIC_API_URL=https://stelladash-production.up.railway.app

# Step 3: Deploy Frontend
vercel --prod
# Done! Frontend now talks to backend
```

---

## Deployment Options

### Recommended Free Hosting

| Component | Platform | Free Tier | Best For |
|-----------|----------|-----------|----------|
| **Frontend** | Vercel | ✅ Unlimited | Next.js apps |
| **Frontend** | Netlify | ✅ 100GB/month | Static sites |
| **Backend** | Railway | ✅ $5 credit/month | Python apps |
| **Backend** | Render | ✅ 750 hours/month | Web services |
| **Backend** | Fly.io | ✅ 3 VMs free | Global deployment |

### Our Recommendation
- **Frontend**: Vercel (best Next.js support)
- **Backend**: Railway or Render (easy Python deployment)

---

## Frontend Deployment

### Option 1: Vercel (Recommended) ⭐

#### Why Vercel?
- ✅ Built for Next.js
- ✅ Automatic deployments from Git
- ✅ Free SSL certificates
- ✅ Global CDN
- ✅ Zero configuration

#### Step-by-Step Deployment

**1. Prepare Your Code**
```bash
cd frontend

# Test build locally
npm run build
npm start

# If successful, commit changes
git add .
git commit -m "Ready for deployment"
git push
```

**2. Deploy to Vercel**

**Option A: Using Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? stelladash
# - Directory? ./
# - Override settings? No
```

**Option B: Using Vercel Dashboard**
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your Git repository
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: frontend
   - Build Command: npm run build
   - Output Directory: .next
5. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```
6. Click "Deploy"

**3. Get Your URL**
```
Your app is live at: https://stelladash.vercel.app
```

---

### Option 2: Netlify

#### Step-by-Step Deployment

**1. Prepare Build**
```bash
cd frontend

# Create netlify.toml
cat > netlify.toml << EOF
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
EOF
```

**2. Deploy**

**Option A: Netlify CLI**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd frontend
netlify deploy --prod

# Follow prompts
```

**Option B: Netlify Dashboard**
1. Go to https://netlify.com
2. Click "Add new site" → "Import existing project"
3. Connect Git repository
4. Configure:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Add Environment Variables
6. Click "Deploy"

---

## Backend Deployment

### Option 1: Railway (Recommended) ⭐

#### Why Railway?
- ✅ $5 free credit/month
- ✅ Easy Python deployment
- ✅ Automatic HTTPS
- ✅ Environment variables support
- ✅ GitHub integration

#### Step-by-Step Deployment

**1. Prepare Your Code**

Create `Procfile` in backend folder:
```bash
cd backend
echo "web: uvicorn app:app --host 0.0.0.0 --port \$PORT" > Procfile
```

Create `railway.json`:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn app:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**2. Deploy to Railway**

**Option A: Railway CLI**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd backend
railway init

# Deploy
railway up

# Add environment variables
railway variables set GEMINI_API_KEY=your_key
railway variables set AWS_ACCESS_KEY_ID=your_key
railway variables set AWS_SECRET_ACCESS_KEY=your_secret
```

**Option B: Railway Dashboard**
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Configure:
   - Root Directory: `backend`
   - Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
6. Add Environment Variables:
   ```
   GEMINI_API_KEY=your_key
   AWS_ACCESS_KEY_ID=your_key
   AWS_SECRET_ACCESS_KEY=your_secret
   AWS_BUCKET_NAME=stelladash-uploads
   AWS_REGION=us-east-1
   ```
7. Click "Deploy"

**3. Get Your URL**
```
Backend URL: https://stelladash-production.up.railway.app
```

**4. Update Frontend**
Update `NEXT_PUBLIC_API_URL` in Vercel:
```
NEXT_PUBLIC_API_URL=https://stelladash-production.up.railway.app
```

---

### Option 2: Render

#### Step-by-Step Deployment

**1. Prepare Your Code**

Create `render.yaml`:
```yaml
services:
  - type: web
    name: stelladash-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: PYTHON_VERSION
        value: 3.10.0
      - key: GEMINI_API_KEY
        sync: false
      - key: AWS_ACCESS_KEY_ID
        sync: false
      - key: AWS_SECRET_ACCESS_KEY
        sync: false
```

**2. Deploy to Render**
1. Go to https://render.com
2. Click "New" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - Name: `stelladash-backend`
   - Root Directory: `backend`
   - Environment: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
5. Add Environment Variables
6. Click "Create Web Service"

**3. Get Your URL**
```
Backend URL: https://stelladash-backend.onrender.com
```

---

### Option 3: Fly.io

#### Step-by-Step Deployment

**1. Install Fly CLI**
```bash
# Mac/Linux
curl -L https://fly.io/install.sh | sh

# Windows
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

**2. Login and Deploy**
```bash
# Login
fly auth login

# Initialize
cd backend
fly launch

# Follow prompts:
# - App name: stelladash-backend
# - Region: Choose closest
# - PostgreSQL: No
# - Redis: No

# Deploy
fly deploy

# Set environment variables
fly secrets set GEMINI_API_KEY=your_key
fly secrets set AWS_ACCESS_KEY_ID=your_key
fly secrets set AWS_SECRET_ACCESS_KEY=your_secret
```

**3. Get Your URL**
```
Backend URL: https://stelladash-backend.fly.dev
```

---

## Full Stack Deployment

### ⚠️ IMPORTANT: Deployment Order

**Always deploy in this order:**

1. ✅ **Backend First** → Get backend URL
2. ✅ **Update Frontend** → Add backend URL to env
3. ✅ **Frontend Last** → Deploy with correct backend URL

### Why This Order?
- Frontend needs backend URL to make API calls
- Backend can work independently
- Changing backend URL later requires frontend redeployment

---

### Complete Deployment Checklist

#### Phase 1: Backend Deployment (Do This First!)
- [ ] Choose platform (Railway/Render/Fly.io)
- [ ] Create `Procfile` or deployment config
- [ ] Push code to GitHub
- [ ] Deploy backend
- [ ] Add environment variables
- [ ] Test backend URL: `https://your-backend.com`
- [ ] Verify API: `https://your-backend.com/` returns status
- [ ] **COPY BACKEND URL** - You'll need this!

#### Phase 2: Frontend Deployment (Do This Second!)
- [ ] **IMPORTANT**: Update `NEXT_PUBLIC_API_URL` with backend URL from Phase 1
- [ ] Test build locally: `npm run build`
- [ ] Deploy to Vercel/Netlify
- [ ] Verify deployment
- [ ] Test upload functionality

#### Phase 3: Testing (Final Step)
- [ ] Upload sample CSV
- [ ] Check dashboard renders
- [ ] Test filters
- [ ] Test PDF export
- [ ] Check insights panel
- [ ] Test on mobile device

---

### Step-by-Step Example

**Step 1: Deploy Backend to Railway**
```bash
cd backend
railway up
# Output: Deployed to https://stelladash-production.up.railway.app
```

**Step 2: Update Frontend Config**
```bash
cd ../frontend

# Option A: Local .env.local file
echo "NEXT_PUBLIC_API_URL=https://stelladash-production.up.railway.app" > .env.local

# Option B: Add in Vercel Dashboard (recommended)
# Go to Vercel → Project → Settings → Environment Variables
# Add: NEXT_PUBLIC_API_URL = https://stelladash-production.up.railway.app
```

**Step 3: Deploy Frontend to Vercel**
```bash
vercel --prod
# Output: Deployed to https://stelladash.vercel.app
```

**Step 4: Test Everything**
```bash
# Open frontend URL
# Upload CSV
# Verify it works!
```

---

### Complete Deployment Checklist

---

## Post-Deployment

### Custom Domain (Optional)

#### Vercel Custom Domain
1. Go to Vercel Dashboard → Your Project
2. Click "Settings" → "Domains"
3. Add your domain: `stelladash.yourdomain.com`
4. Update DNS records as instructed
5. Wait for SSL certificate (automatic)

#### Railway Custom Domain
1. Go to Railway Dashboard → Your Service
2. Click "Settings" → "Domains"
3. Add custom domain
4. Update DNS CNAME record
5. Wait for SSL certificate

### SSL Certificates
All platforms provide free SSL certificates automatically!

### Monitoring

#### Vercel Analytics
```bash
# Add to frontend/package.json
npm install @vercel/analytics

# Add to pages/_app.js
import { Analytics } from '@vercel/analytics/react'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
```

#### Railway Logs
```bash
# View logs
railway logs

# Follow logs
railway logs --follow
```

#### Render Logs
Available in dashboard under "Logs" tab

---

## Environment Variables Reference

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### Backend (.env)
```bash
# Optional: Gemini AI
GEMINI_API_KEY=your_gemini_key

# Optional: AWS S3
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_BUCKET_NAME=stelladash-uploads
AWS_REGION=us-east-1
```

---

## Troubleshooting Deployment

### Frontend Issues

#### ❌ Build fails on Vercel
```bash
# Check build locally first
cd frontend
npm run build

# Common fixes:
# 1. Remove .next folder
rm -rf .next

# 2. Clear npm cache
npm cache clean --force

# 3. Reinstall dependencies
rm -rf node_modules
npm install
```

#### ❌ API calls fail (CORS)
```bash
# Solution: Update backend CORS settings
# In backend/app.py, add your frontend URL:

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://stelladash.vercel.app",  # Add your domain
        "https://your-custom-domain.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### Backend Issues

#### ❌ Backend won't start
```bash
# Check logs:
# Railway: railway logs
# Render: Check dashboard logs
# Fly.io: fly logs

# Common issues:
# 1. Missing dependencies
# 2. Wrong Python version
# 3. Port binding issues
```

#### ❌ Environment variables not working
```bash
# Verify variables are set:
# Railway: railway variables
# Render: Check dashboard
# Fly.io: fly secrets list

# Re-deploy after adding variables
```

---

## Cost Estimation

### Free Tier Limits

**Vercel (Frontend)**
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic SSL
- ✅ Global CDN

**Railway (Backend)**
- ✅ $5 credit/month (~500 hours)
- ✅ 1GB RAM
- ✅ 1GB storage
- ⚠️ Sleeps after 30 min inactivity

**Render (Backend)**
- ✅ 750 hours/month
- ✅ 512MB RAM
- ⚠️ Sleeps after 15 min inactivity
- ⚠️ Slower cold starts

### Upgrade Costs (if needed)

**Vercel Pro**: $20/month
- More bandwidth
- Advanced analytics
- Team features

**Railway**: Pay as you go
- $0.000463/GB-hour RAM
- $0.25/GB storage

**Render**: $7/month
- No sleep
- Faster performance
- More resources

---

## Production Checklist

### Security
- [ ] Environment variables secured
- [ ] API keys not in code
- [ ] CORS properly configured
- [ ] HTTPS enabled (automatic)
- [ ] .env files in .gitignore

### Performance
- [ ] Frontend build optimized
- [ ] Images optimized
- [ ] API responses cached
- [ ] Database queries optimized (if added)

### Monitoring
- [ ] Error tracking setup
- [ ] Analytics enabled
- [ ] Logs accessible
- [ ] Uptime monitoring

### Documentation
- [ ] README updated with live URLs
- [ ] API documentation
- [ ] Deployment notes
- [ ] Known issues documented

---

## Quick Deploy Commands

### Complete Deployment (Correct Order!)

```bash
# ========================================
# STEP 1: Deploy Backend First
# ========================================
cd backend
railway up
# Copy the URL you get: https://stelladash-production.up.railway.app

# ========================================
# STEP 2: Update Frontend with Backend URL
# ========================================
cd ../frontend

# Add backend URL to environment
# Option A: Create .env.local
echo "NEXT_PUBLIC_API_URL=https://stelladash-production.up.railway.app" > .env.local

# Option B: Add in Vercel dashboard (recommended for production)

# ========================================
# STEP 3: Deploy Frontend
# ========================================
vercel --prod

# Done! 🎉
# Frontend: https://stelladash.vercel.app
# Backend:  https://stelladash-production.up.railway.app
```

### Common Mistake to Avoid ❌

```bash
# ❌ WRONG: Deploying frontend first
cd frontend
vercel --prod  # Frontend deployed but has no backend URL!

cd backend
railway up     # Backend deployed but frontend already live with wrong URL
# Now you need to redeploy frontend 😞

# ✅ CORRECT: Backend first, then frontend
cd backend
railway up     # Get backend URL

cd frontend
# Add backend URL to .env.local
vercel --prod  # Frontend deployed with correct backend URL
# Works perfectly! 😊
```

---

## Quick Deploy Commands

---

## Example Deployment URLs

After deployment, your URLs will look like:

```
Frontend: https://stelladash.vercel.app
Backend:  https://stelladash-production.up.railway.app
API:      https://stelladash-production.up.railway.app/api/upload
```

---

## Support

### Getting Help
- 📖 Check platform documentation
- 💬 Platform Discord/Slack communities
- 🐛 GitHub issues
- 📧 Contact: [your-email@example.com]

### Useful Links
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app/)
- [Render Docs](https://render.com/docs)
- [Fly.io Docs](https://fly.io/docs/)

---

## Success! 🎉

Your StellaDash is now live and accessible worldwide!

**Share your deployment:**
- Tweet about it
- Add to portfolio
- Show to potential employers
- Get feedback from users

---

**Made with 💜 by [Your Name]**

⭐ Star the repo if this helped you deploy!
