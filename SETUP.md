# StellaDash Setup Guide

## Prerequisites
- Node.js 18+
- Python 3.9+
- AWS Account (optional, for S3)
- Gemini API Key (optional, for AI chat)

## Backend Setup

1. Navigate to backend:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Add your API keys to `.env`:
```
GEMINI_API_KEY=your_gemini_api_key_here
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=stelladash-uploads
AWS_REGION=us-east-1
```

5. Run the server:
```bash
uvicorn app:app --reload
```

Backend will run on `http://localhost:8000`

## Frontend Setup

1. Navigate to frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## Getting API Keys

### Gemini API Key (Free)
1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy and paste into `.env`

### AWS S3 (Optional)
1. Go to AWS Console → IAM
2. Create new user with S3 permissions
3. Generate access keys
4. Create S3 bucket named `stelladash-uploads`
5. Add credentials to `.env`

## Testing

1. Open `http://localhost:3000`
2. Upload `sample_data/sales_sample.csv`
3. View auto-generated dashboard
4. Try filters, AI chat, and PDF export

## Features

✅ CSV/Excel upload with drag & drop
✅ Auto-generated KPI cards (Power BI style)
✅ Interactive charts (bar, line, pie)
✅ Color-coded visualizations
✅ Smart filters
✅ AI-powered chat (Gemini)
✅ PDF export
✅ AWS S3 integration
✅ Auto insights & correlations

## Troubleshooting

**Backend not starting?**
- Check Python version: `python --version`
- Install dependencies again: `pip install -r requirements.txt`

**Frontend not starting?**
- Check Node version: `node --version`
- Clear cache: `rm -rf .next node_modules && npm install`

**AI Chat not working?**
- Verify GEMINI_API_KEY in `.env`
- Check backend logs for errors

**S3 upload failing?**
- Verify AWS credentials in `.env`
- Check bucket exists and has correct permissions
- S3 is optional - app works without it
