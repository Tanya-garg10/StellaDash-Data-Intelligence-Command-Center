# ⭐ StellaDash - Data Intelligence Command Center

> Transform your CSV/Excel data into stunning interactive dashboards instantly!

![StellaDash](https://img.shields.io/badge/Status-Production%20Ready-success)
![Next.js](https://img.shields.io/badge/Next.js-14.1-black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green)

## 🎯 Problem Statement

Manual data analysis is time-consuming and requires technical expertise. StellaDash solves this by instantly transforming raw data into professional, interactive dashboards with auto-generated insights, charts, and reports.

## ✨ Features

### Core Features
- 🚀 **Instant Upload** - Drag & drop CSV/Excel files (handles 50K+ rows!)
- 📊 **Power BI-Style Cards** - Beautiful gradient KPI cards with real-time metrics
- 📈 **Interactive Charts** - 6+ chart types (bar, line, pie) with custom colors
- 🔍 **Smart Insights** - Auto-generated correlations, outliers, and data quality metrics
- 🎨 **Dynamic Filters** - Category-wise filtering with actual data values
- 📥 **PDF Export** - Download complete dashboard as professional PDF report
- ✨ **Dark Theme UI** - Star Wars inspired design with smooth animations

### Optional Features
- ☁️ **AWS S3 Integration** - Secure cloud storage for uploaded files
- 🤖 **AI Chat** - Ask questions about your data (Gemini API)

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** - React framework with server-side rendering
- **TailwindCSS** - Utility-first CSS framework
- **Recharts** - Composable charting library
- **jsPDF + html2canvas** - PDF generation

### Backend
- **FastAPI** - Modern Python web framework
- **Pandas** - Data analysis and manipulation
- **NumPy** - Numerical computing
- **Boto3** - AWS SDK for Python

### Cloud (Optional)
- **AWS S3** - File storage
- **AWS Lambda** - Serverless computing
- **Gemini API** - AI-powered chat

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.9+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd stelladash
```

2. **Backend Setup**
```bash
cd backend
pip install -r requirements.txt
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

### Running the Application

1. **Start Backend** (Terminal 1)
```bash
cd backend
uvicorn app:app --reload
```
Backend runs on: `http://localhost:8000`

2. **Start Frontend** (Terminal 2)
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:3000`

3. **Open Browser**
Navigate to `http://localhost:3000` and start uploading data!

## 📊 Demo Flow

1. **Upload Data**
   - Drag & drop your CSV/Excel file
   - Supports files with 50K+ rows
   - Instant processing and analysis

2. **Explore Dashboard**
   - View auto-generated KPI cards
   - Interact with 6+ different charts
   - Apply filters to drill down

3. **Get Insights**
   - Auto-detected correlations
   - Missing data analysis
   - Data quality metrics

4. **Export Report**
   - Click "Export PDF"
   - Download professional dashboard report
   - Share with stakeholders

## 📁 Project Structure

```
stelladash/
├── backend/
│   ├── app.py              # FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables
├── frontend/
│   ├── pages/
│   │   ├── index.js       # Upload page
│   │   └── _app.js        # App wrapper
│   ├── components/
│   │   └── Dashboard.js   # Main dashboard component
│   ├── styles/
│   │   └── globals.css    # Global styles
│   └── package.json       # Node dependencies
├── sample_data/
│   └── sales_sample.csv   # Sample dataset
└── README.md
```

## 🎨 Features Breakdown

### KPI Cards
- Total Rows
- Column Count
- Missing Values
- Data Completeness %

### Chart Types
1. **Line Charts** - Trend analysis
2. **Bar Charts** - Category comparison
3. **Pie Charts** - Distribution visualization
4. **Histograms** - Frequency distribution

### Auto Insights
- **Correlations** - Top 3 correlated numeric columns
- **Missing Data** - Columns with missing values
- **Data Quality** - Overall completeness score
- **Top Values** - Highest/most common values

### Filters
- Dynamic dropdowns based on your data
- Category-wise filtering
- Real-time chart updates
- Up to 20 options per filter

## 🔧 Configuration

### Optional: AWS S3 Setup

1. Create `.env` file in `backend/` folder:
```bash
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_BUCKET_NAME=stelladash-uploads
AWS_REGION=us-east-1
```

2. Create S3 bucket in AWS Console
3. Set appropriate permissions

### Optional: Gemini AI Chat

1. Get free API key: https://makersuite.google.com/app/apikey
2. Add to `backend/.env`:
```bash
GEMINI_API_KEY=your_api_key_here
```

## 📝 Sample Data

Use the included `sample_data/sales_sample.csv` to test:
- 10 rows of sales data
- Multiple regions and products
- Numeric and categorical columns

## 🎯 Use Cases

### Business Analytics
- Sales performance dashboards
- Customer segmentation analysis
- Revenue tracking

### Data Science
- Exploratory data analysis (EDA)
- Quick data profiling
- Feature correlation analysis

### Education
- Student performance tracking
- Course analytics
- Research data visualization

### Healthcare
- Patient data analysis
- Treatment outcome tracking
- Medical research insights

## 🐛 Troubleshooting

### Backend not starting?
```bash
# Check Python version
python --version  # Should be 3.9+

# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend not starting?
```bash
# Check Node version
node --version  # Should be 18+

# Clear cache and reinstall
rm -rf .next node_modules
npm install
```

### Charts not rendering?
- Hard refresh browser: `Ctrl + Shift + R`
- Clear browser cache
- Check browser console for errors

### PDF export blank?
- Wait for all charts to load
- Try landscape mode
- Reduce browser zoom to 100%

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel deploy
```

### Backend (Railway/Render)
```bash
cd backend
# Follow platform-specific deployment guide
```

## 📈 Performance

- **Upload Speed**: < 2 seconds for 50K rows
- **Chart Rendering**: < 1 second
- **PDF Generation**: 2-3 seconds
- **Memory Usage**: ~200MB for 50K rows

## 🤝 Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 🙏 Acknowledgments

- Next.js team for amazing framework
- FastAPI for blazing fast backend
- Recharts for beautiful charts
- TailwindCSS for utility-first styling

## 📞 Support

Having issues? 
- Check [Troubleshooting](#-troubleshooting) section
- Open an issue on GitHub
- Contact: tanyagarg5315@gmail.com

⭐ **Star this repo if you found it helpful!**

Made with 💜 by Tanya Garg
