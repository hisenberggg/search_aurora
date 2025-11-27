# Search Aurora

A simple search engine with multiple search approaches.

## Backend (Flask)

### Setup
```bash
pip install -r requirements.txt
```

### Run
```bash
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
Create a `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Build for Production
```bash
npm run build
npm start
```

## Search Approaches

1. **Term Frequency Token** (`term_frequency_token`) - Token-based search using term frequency
2. **Sentence Embedding** (`sentence_embedding`) - Semantic search using sentence transformers and FAISS

