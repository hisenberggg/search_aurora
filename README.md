# Search Aurora - Local Setup

A simple search engine with multiple search approaches.

## Prerequisites

- Python 3.12+ installed
- Node.js 18+ and npm installed

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

**Note:** By default, the frontend connects to the deployed Render backend (`https://search-messages.onrender.com/`). 

**To use a local backend instead:**

- Edit `app/page.tsx` (lines 27-34) and change the default return URL from `https://search-messages.onrender.com/` to `http://localhost:5000`

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

---

## Bonus 1: Design Notes / Alternative Approaches

### Current Approach

**Load all messages from the upstream `/messages` API once at startup.**

Keep them in memory and run a simple full-text search (token-based AND + term-frequency scoring) implemented in Python.

**Pros:**
- Very simple, no extra infrastructure
- Easy to reason about
- More than fast enough for ~3k records
- Low latency (sub-100ms achievable)

**Cons:**
- Not great if data grows to millions of records
- Needs frequent updates/re-fetching if data changes often
- Memory usage scales with dataset size

### Alternative: Query `/messages` API at Search Time

Query the `/messages` API directly for each search request.

**Why rejected:**
- The `/messages` API itself takes ~125ms per request
- This would make every search request slower than the 100ms requirement
- Network latency adds significant overhead

**Decision:** Chose to pre-load messages on startup to eliminate network calls from the hot path.

### Alternative 1: DB-Backed Full-Text Search (PostgreSQL tsvector)

Persist messages into a Postgres table with a `tsvector` column on `message` and `user_name`.

Use a GIN index for full-text search.

`/search` would translate the query into a `to_tsquery` or `plainto_tsquery` call.

**Pros:**
- Scales better to larger datasets
- Good ranking capabilities
- Familiar operational model
- Supports complex queries and filtering

**Cons:**
- Additional infrastructure (PostgreSQL database)
- More moving parts
- More complex deployment
- Requires database maintenance

### Alternative 2: Semantic Search with Embeddings + Vector Index

Use a sentence embedding model (e.g., `sentence-transformers`) to embed each message.

Store vectors in an in-memory FAISS or similar ANN index.

For each query, embed the query and perform k-NN search.

**Note:** This approach is already implemented as the `sentence_embedding` search method.

**Pros:**
- "Conceptual" search – robust to paraphrasing and synonyms
- Better semantic understanding
- Can find relevant results even without exact keyword matches

**Cons:**
- Heavier CPU usage during initialization
- Longer cold start time (model loading + embedding generation)
- More complex deployment
- May need GPU for low latency at scale

---

## Bonus 2: How to Reduce Latency to ~30ms

Given the dataset size (~3.3k records), achieving 30ms latency is realistic with the following optimizations:

### 1. In-Memory Index (Already Implemented)

All search operations are on Python lists and strings – no network calls on the hot path.

Complexity is O(N × query_length), and N ≈ 3.3k → microseconds to low single-digit milliseconds in practice.

### 2. Deploy Close to Users

If users are in Europe, deploy to `europe-west1` (or equivalent) so RTT is low.

Network latency often dwarfs compute time; minimizing RTT is key to sub-30ms p95.

### 3. Optimize Server Settings

- Use Gunicorn with appropriate worker configuration
- Configure a few workers if the PaaS supports it (but for simple compute, a single worker is often fine)
- Avoid heavy middleware/logging on the request path
- Use `--preload` flag to load data before workers fork

### 4. Warm Startup & Caching

- Fetch and index messages at startup
- Ensure cold start (first request after deployment) is done before load tests
- If data rarely changes, skip periodic re-fetching during the exercise window – no cache invalidation cost

### 5. Keep Responses Small & Paginated

- Default `page_size=10` and cap at e.g. 50–100
- Less data over the wire = less latency from serialization + network transfer

### 6. Additional Optimizations (If Needed)

For consistent <30ms p95 under more load:

- **Add a light inverted index:** Dictionary from token → list of message IDs so you don't scan all 3.3k messages on every query (more relevant if it grows to hundreds of thousands)
- **Pre-normalize text:** Lowercasing and tokenization at index time to reduce per-request processing even further
- **Connection pooling:** Reuse database connections if using a DB-backed approach
- **Response compression:** Enable gzip compression for JSON responses
