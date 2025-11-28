import re
from collections import Counter
from typing import List, Dict, Any


def tokenize(text: str) -> List[str]:
    """
    Tokenize text into lowercase words, removing punctuation
    """
    tokens = re.findall(r'\b\w+\b', text.lower())
    return tokens


def calculate_term_frequency(tokens: List[str]) -> Dict[str, int]:
    """
    Calculate term frequency for a list of tokens
    """
    return dict(Counter(tokens))


def search(messages_data: List[Dict[str, Any]], query: str, page: int = 1, per_page: int = 10) -> Dict[str, Any]:
    """
    Search using term frequency and token-based matching
    
    Args:
        messages_data: List of message dictionaries
        query: Search query string
        page: Page number (1-indexed)
        per_page: Number of items per page
    
    Returns:
        Dictionary with search results and pagination info
    """
    if not messages_data:
        return {
            'total': 0,
            'items': [],
            'page': page,
            'per_page': per_page,
            'message': 'No data loaded. Please call /load_data first.'
        }
    
    query_tokens = tokenize(query)
    if not query_tokens:
        return {
            'total': 0,
            'items': [],
            'page': page,
            'per_page': per_page
        }
    
    scored_messages = []
    
    for message in messages_data:
        message_text = message.get('message', '').lower()
        message_tokens = tokenize(message_text)
        message_tf = calculate_term_frequency(message_tokens)
        
        score = 0
        matched_tokens = 0
        
        for token in query_tokens:
            if token in message_tf:
                score += message_tf[token]
                matched_tokens += 1
        
        if matched_tokens > 0:
            normalized_score = score / len(query_tokens) * (matched_tokens / len(query_tokens))
            scored_messages.append((normalized_score, message))
    
    scored_messages.sort(key=lambda x: x[0], reverse=True)
    
    total = len(scored_messages)
    start = (page - 1) * per_page
    end = start + per_page
    paginated_results = scored_messages[start:end]
    
    items = [msg for _, msg in paginated_results]
    
    return {
        'total': total,
        'items': items,
        'page': page,
        'per_page': per_page,
        'total_pages': (total + per_page - 1) // per_page
    }

