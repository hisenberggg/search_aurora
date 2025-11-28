import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Any, Optional

# Global variables for model and index
_model: Optional[SentenceTransformer] = None
_index: Optional[faiss.Index] = None
_messages_list: List[Dict[str, Any]] = []
_initialized = False

# Similarity threshold - only return results above this threshold
SIMILARITY_THRESHOLD = 0.3  # Adjust this value (0.0 to 1.0) to control relevance cutoff


def initialize(messages_data: List[Dict[str, Any]]):
    """
    Initialize the embedding model and build FAISS index from messages
    
    Args:
        messages_data: List of message dictionaries
    """
    global _model, _index, _messages_list, _initialized
    
    if not messages_data:
        return
    
    # Initialize model (using a lightweight model for speed)
    if _model is None:
        _model = SentenceTransformer('all-MiniLM-L6-v2')
    
    # Extract message texts
    message_texts = [msg.get('message', '') for msg in messages_data]
    
    # Generate embeddings
    embeddings = _model.encode(message_texts, show_progress_bar=False)
    embeddings = np.array(embeddings).astype('float32')
    
    # Create FAISS index (L2 distance)
    dimension = embeddings.shape[1]
    _index = faiss.IndexFlatL2(dimension)
    
    # Normalize vectors for cosine similarity (L2 normalization)
    faiss.normalize_L2(embeddings)
    
    # Add vectors to index
    _index.add(embeddings)
    
    # Store messages list for retrieval
    _messages_list = messages_data.copy()
    _initialized = True


def search(messages_data: List[Dict[str, Any]], query: str, page: int = 1, per_page: int = 10) -> Dict[str, Any]:
    """
    Search using sentence embeddings and FAISS similarity search
    
    Args:
        messages_data: List of message dictionaries
        query: Search query string
        page: Page number (1-indexed)
        per_page: Number of items per page
    
    Returns:
        Dictionary with search results and pagination info
    """
    global _model, _index, _messages_list, _initialized
    
    if not messages_data:
        return {
            'total': 0,
            'items': [],
            'page': page,
            'per_page': per_page,
            'message': 'No data loaded. Please call /load_data first.'
        }
    
    # Lazy initialization: build index if not already built or if data changed
    if not _initialized or len(_messages_list) != len(messages_data):
        initialize(messages_data)
    
    if _index is None or _model is None:
        return {
            'total': 0,
            'items': [],
            'page': page,
            'per_page': per_page,
            'message': 'Failed to initialize search index.'
        }
    
    # Encode query
    query_embedding = _model.encode([query], show_progress_bar=False)
    query_embedding = np.array(query_embedding).astype('float32')
    faiss.normalize_L2(query_embedding)
    
    # Search in FAISS index
    # Get all results (FAISS returns sorted by distance)
    k = len(_messages_list)
    distances, indices = _index.search(query_embedding, k)
    
    # Convert distances to similarity scores (1 - normalized distance)
    # Since we're using L2 normalized vectors, distance is related to cosine distance
    # For cosine similarity: similarity = 1 - (distance^2 / 2)
    similarities = 1 - (distances[0] ** 2 / 2)
    
    # Create list of (similarity, message) tuples
    scored_messages = [
        (float(similarities[i]), _messages_list[int(indices[0][i])])
        for i in range(len(indices[0]))
    ]
    
    # Sort by similarity (descending) - though FAISS already returns sorted results
    scored_messages.sort(key=lambda x: x[0], reverse=True)
    
    # Filter results above similarity threshold
    filtered_messages = [
        (score, msg) for score, msg in scored_messages
        if score >= SIMILARITY_THRESHOLD
    ]
    
    # Pagination
    total = len(filtered_messages)
    start = (page - 1) * per_page
    end = start + per_page
    paginated_results = filtered_messages[start:end]
    
    # Return messages without scores
    items = [msg for _, msg in paginated_results]
    
    return {
        'total': total,
        'items': items,
        'page': page,
        'per_page': per_page,
        'total_pages': (total + per_page - 1) // per_page
    }

