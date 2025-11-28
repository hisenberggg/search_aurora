# Deployment Guide - Vercel + Render

This branch is configured for production deployment:
- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Render

## Backend Deployment (Render)

1. **Connect your GitHub repository to Render:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `deploy` branch

2. **Configure the service:**
   - **Name**: `search-aurora-backend` (or your preferred name)
   - **Environment**: Python 3
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && gunicorn app:app --bind 0.0.0.0:$PORT --workers 1 --preload --timeout 120`
   - **Python Version**: 3.12.0

3. **Deploy:**
   - Render will automatically detect `render.yaml` and use those settings
   - Wait for deployment to complete
   - Copy your Render backend URL (e.g., `https://search-aurora-backend.onrender.com`)

## Frontend Deployment (Vercel)

1. **Connect your GitHub repository to Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository
   - Select the `deploy` branch

2. **Configure Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL` = `https://your-render-backend-url.onrender.com`
   - Make sure to set it for Production, Preview, and Development environments

3. **Deploy:**
   - Vercel will automatically build and deploy
   - Your frontend will be available at `https://your-project.vercel.app`

## Environment Variables

### Backend (Render)
- `PORT`: Automatically set by Render
- `PYTHON_VERSION`: Set to 3.12.0 (in render.yaml)

### Frontend (Vercel)
- `NEXT_PUBLIC_API_URL`: Your Render backend URL (e.g., `https://search-aurora-backend.onrender.com`)

## Testing

After deployment:
1. Backend should be accessible at: `https://your-backend.onrender.com/load_data`
2. Frontend should be accessible at: `https://your-frontend.vercel.app`
3. Frontend will automatically use the Render backend via `NEXT_PUBLIC_API_URL`

## Local Development

For local development, switch to the `main` branch which uses `http://localhost:5000` endpoints.

