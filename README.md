# Search Aurora - Local Setup

A simple search engine with multiple search approaches.



## Prerequisites

- Python 3.12+ installed
- Node.js 18+ and npm installed

> ** Clone the repository and switch to the `local-setup` branch:
> ```bash
> git clone https://github.com/hisenberggg/search_aurora.git
> cd search_aurora
> git checkout local-setup
> ```

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

**Note:** The backend automatically loads data on startup, so you don't need to call `/load_data` manually.

### Endpoints
- `GET /load_data` - Load messages from external API (optional, data loads automatically on startup)
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

### Environment Variables (Optional)

Create a `.env.local` file if you want to customize the backend URL:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Note:** The frontend defaults to `http://localhost:5000` if no environment variable is set.

## Local Development Workflow

1. **Start the backend:**
   ```bash
   cd backend
   python app.py
   ```
   Wait for the message "Successfully loaded X messages on startup"

2. **Start the frontend** (in a new terminal):
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

4. **Start searching!**
   - The frontend will automatically load data from the backend on startup
   - Use the search bar to query messages
   - Switch between "Term Frequency" and "Sentence Embedding" approaches

## Search Approaches

1. **Term Frequency Token** (`term_frequency_token`) - Token-based search using term frequency
2. **Sentence Embedding** (`sentence_embedding`) - Semantic search using sentence transformers and FAISS

## Troubleshooting

- **Backend not connecting?** Make sure the backend is running on `http://localhost:5000`
- **CORS errors?** The backend has CORS enabled, so this shouldn't be an issue
- **No search results?** Make sure the backend has loaded data (check backend console for "Successfully loaded X messages")
