# Search Aurora

A simple search engine with multiple search approaches.

## Backend (Flask)

### Setup
```bash
cd backend
pip install -r requirements.txt
```

### Run
```bash
cd backend
python app.py
```

The backend will run on `http://localhost:5000`

### Endpoints
- `GET /load_data` - Load messages from external API
- `GET /search?q=<query>&approach=<approach>&page=<page>&per_page=<per_page>` - Search messages

## Frontend (Next.js)

### Setup
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### Environment Variables

**For Local Development:**
Create a `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**For Production (Vercel):**
The frontend will automatically use `https://search-aurora-backend.fly.dev` if no environment variable is set, or you can set:
```
NEXT_PUBLIC_API_URL=https://search-aurora-backend.fly.dev
```

### Build for Production
```bash
npm run build
npm start
```

## Deployment

### Deploy Frontend to Vercel

1. **Push code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub

3. **Import your repository**:
   - Click "New Project"
   - Select your GitHub repository (`search_aurora`)
   - Vercel will auto-detect Next.js

4. **Configure Environment Variables** (optional):
   - Go to Project Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL` = `https://search-aurora-backend.fly.dev`
   - **Note**: If not set, it will automatically use the Fly.io backend URL

5. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - Your site will be live at `https://your-project.vercel.app`

6. **Your app is live!** 🎉

The frontend will automatically connect to your Fly.io backend at `https://search-aurora-backend.fly.dev`.

### Deploy Backend to Fly.io

See backend deployment instructions in `backend/` directory or run:
```bash
cd backend
fly deploy
```

## Search Approaches

1. **Term Frequency Token** (`term_frequency_token`) - Token-based search using term frequency
2. **Sentence Embedding** (`sentence_embedding`) - Semantic search using sentence transformers and FAISS

