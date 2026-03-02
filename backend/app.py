from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
from io import BytesIO
import json
import boto3
import os
from dotenv import load_dotenv
import google.generativeai as genai
from datetime import datetime

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# AWS S3 Setup
s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION', 'us-east-1')
)

# Gemini Setup
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY') or os.getenv('GOOGLE_API_KEY')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    # Use stable model name
    model = genai.GenerativeModel('gemini-1.5-pro')
else:
    model = None

# Store uploaded data in memory (for demo)
data_store = {}

class ChatRequest(BaseModel):
    question: str
    data_id: str
    api_key: str
    model: str = "gemini-pro"

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    
    # Read CSV/Excel
    if file.filename.endswith('.csv'):
        df = pd.read_csv(BytesIO(contents))
    else:
        df = pd.read_excel(BytesIO(contents))
    
    # Generate unique ID
    data_id = f"data_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    # Upload to S3 (if configured)
    s3_url = None
    try:
        bucket_name = os.getenv('AWS_BUCKET_NAME')
        if bucket_name:
            s3_client.put_object(
                Bucket=bucket_name,
                Key=f"{data_id}/{file.filename}",
                Body=contents
            )
            s3_url = f"s3://{bucket_name}/{data_id}/{file.filename}"
    except Exception as e:
        print(f"S3 upload failed: {e}")
    
    # Store data in memory
    data_store[data_id] = df
    
    # Profile data
    profile = {
        "data_id": data_id,
        "filename": file.filename,
        "rows": len(df),
        "columns": len(df.columns),
        "s3_url": s3_url,
        "column_info": []
    }
    
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    categorical_cols = df.select_dtypes(include=['object']).columns.tolist()
    
    # Get filter options for categorical columns
    filter_options = {}
    for col in categorical_cols:
        unique_vals = df[col].dropna().unique().tolist()
        if len(unique_vals) <= 50:  # Only if reasonable number of options
            filter_options[col] = sorted([str(v) for v in unique_vals])[:20]  # Max 20 options
    
    for col in df.columns:
        col_info = {
            "name": col,
            "type": str(df[col].dtype),
            "missing": int(df[col].isna().sum()),
            "missing_pct": round(df[col].isna().sum() / len(df) * 100, 2),
            "unique": int(df[col].nunique())
        }
        
        if col in numeric_cols:
            col_info["stats"] = {
                "mean": float(df[col].mean()),
                "median": float(df[col].median()),
                "min": float(df[col].min()),
                "max": float(df[col].max()),
                "std": float(df[col].std())
            }
        
        profile["column_info"].append(col_info)
    
    # Generate diverse charts
    charts = []
    chart_colors = ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"]
    
    # Numeric charts with different types
    for idx, col in enumerate(numeric_cols[:3]):
        values = df[col].dropna()
        charts.append({
            "type": "line" if idx == 0 else "bar",
            "title": f"{col} Analysis",
            "color": chart_colors[idx % len(chart_colors)],
            "data": [{"name": str(i), "value": float(v)} for i, v in enumerate(values.head(20))]
        })
    
    # Categorical pie/bar charts
    for idx, col in enumerate(categorical_cols[:3]):
        cat_data = df[col].value_counts().head(8).to_dict()
        charts.append({
            "type": "pie" if idx == 0 else "bar",
            "title": f"{col} Distribution",
            "color": chart_colors[(idx + 3) % len(chart_colors)],
            "data": [{"name": str(k), "value": int(v)} for k, v in cat_data.items()]
        })
    
    # Insights with auto-findings
    insights = []
    auto_findings = []
    
    # Top numeric column
    if numeric_cols:
        top_col = numeric_cols[0]
        top_val = df[top_col].max()
        auto_findings.append(f"Highest {top_col}: {top_val:,.2f}")
    
    # Most common category
    if categorical_cols:
        top_cat_col = categorical_cols[0]
        top_cat = df[top_cat_col].mode()[0]
        auto_findings.append(f"Most common {top_cat_col}: {top_cat}")
    
    # Data quality
    total_missing = df.isna().sum().sum()
    auto_findings.append(f"Data completeness: {((1 - total_missing/(len(df)*len(df.columns)))*100):.1f}%")
    
    insights.append({
        "type": "auto",
        "title": "🎯 Auto Insights",
        "items": auto_findings
    })
    
    # Correlations
    if len(numeric_cols) > 1:
        corr_matrix = df[numeric_cols].corr()
        top_corr = []
        for i in range(len(corr_matrix.columns)):
            for j in range(i+1, len(corr_matrix.columns)):
                val = corr_matrix.iloc[i, j]
                if not np.isnan(val):
                    top_corr.append({
                        "col1": corr_matrix.columns[i],
                        "col2": corr_matrix.columns[j],
                        "value": abs(val)
                    })
        top_corr = sorted(top_corr, key=lambda x: x["value"], reverse=True)[:3]
        if top_corr:
            insights.append({
                "type": "correlation",
                "title": "📊 Top Correlations",
                "items": [f"{c['col1']} ↔ {c['col2']}: {c['value']:.2f}" for c in top_corr]
            })
    
    # Missing data
    missing_cols = [col for col in df.columns if df[col].isna().sum() > 0]
    if missing_cols:
        insights.append({
            "type": "missing",
            "title": "⚠️ Missing Data",
            "items": [f"{col}: {df[col].isna().sum()} rows ({df[col].isna().sum()/len(df)*100:.1f}%)" for col in missing_cols[:3]]
        })
    
    return {
        "profile": profile,
        "charts": charts,
        "insights": insights,
        "filters": categorical_cols,
        "filter_options": filter_options,
        "numeric_cols": numeric_cols
    }

@app.get("/")
def read_root():
    return {
        "status": "StellaDash API Running",
        "model": "gemini-2.5-flash-latest" if model else "No model configured"
    }


@app.post("/api/chat")
async def chat_with_data(request: ChatRequest):
    if not request.api_key:
        return {"answer": "⚠️ API key is required"}
    
    if request.data_id not in data_store:
        raise HTTPException(status_code=404, detail="Data not found")
    
    df = data_store[request.data_id]
    
    # Create context about the data
    context = f"""
    Dataset Info:
    - Rows: {len(df)}
    - Columns: {', '.join(df.columns.tolist())}
    - Numeric columns: {', '.join(df.select_dtypes(include=[np.number]).columns.tolist())}
    - Categorical columns: {', '.join(df.select_dtypes(include=['object']).columns.tolist())}
    
    Sample data:
    {df.head(3).to_string()}
    
    User question: {request.question}
    
    Provide a concise, data-driven answer based on the dataset.
    """
    
    try:
        # Configure with user's API key
        genai.configure(api_key=request.api_key)
        user_model = genai.GenerativeModel(request.model)
        response = user_model.generate_content(context)
        return {"answer": response.text}
    except Exception as e:
        return {"answer": f"Unable to process: {str(e)}"}

@app.post("/api/filter")
async def filter_data(data_id: str, filters: dict):
    if data_id not in data_store:
        raise HTTPException(status_code=404, detail="Data not found")
    
    df = data_store[data_id]
    filtered_df = df.copy()
    
    # Apply filters
    for col, value in filters.items():
        if col in filtered_df.columns:
            filtered_df = filtered_df[filtered_df[col] == value]
    
    # Regenerate charts for filtered data
    charts = []
    numeric_cols = filtered_df.select_dtypes(include=[np.number]).columns.tolist()
    chart_colors = ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"]
    
    for idx, col in enumerate(numeric_cols[:3]):
        values = filtered_df[col].dropna()
        charts.append({
            "type": "bar",
            "title": f"{col} (Filtered)",
            "color": chart_colors[idx % len(chart_colors)],
            "data": [{"name": str(i), "value": float(v)} for i, v in enumerate(values.head(15))]
        })
    
    return {
        "filtered_rows": len(filtered_df),
        "charts": charts
    }
