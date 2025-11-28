from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import time
import os
from typing import List, Dict, Any
from search_approaches.term_frequency_token import search as search_term_frequency_token
from search_approaches.sentence_embedding import search as search_sentence_embedding

app = Flask(__name__)
CORS(app)

messages_data: List[Dict[str, Any]] = []
MESSAGES_API_URL = "https://november7-730026606190.europe-west1.run.app/messages"


def load_data_from_api():
    """
    Fetch all messages from the external API and store in memory
    """
    global messages_data
    messages_data = []
    
    skip = 0
    limit = 3349
    
    while True:
        try:
            response = requests.get(
                MESSAGES_API_URL,
                params={'skip': skip, 'limit': limit},
                timeout=10
            )
            response.raise_for_status()
            data = response.json()
            
            items = data.get('items', [])
            if not items:
                break
            
            messages_data.extend(items)
            
            total = data.get('total', 0)
            if len(messages_data) >= total:
                break
            
            skip += limit
            
        except requests.exceptions.RequestException as e:
            return {'error': f'Failed to fetch data: {str(e)}'}, False
    
    return {'message': f'Successfully loaded {len(messages_data)} messages'}, True


@app.route('/load_data', methods=['GET'])
def load_data():
    """
    Load data from the external messages API
    """
    result, success = load_data_from_api()
    
    if success:
        return jsonify({
            'status': 'success',
            **result
        }), 200
    else:
        return jsonify({
            'status': 'error',
            **result
        }), 500


@app.route('/search', methods=['GET'])
def search():
    """
    Search endpoint with approach parameter
    Query params:
    - q: search query (required)
    - approach: search approach (default: 'term_frequency_token')
    - page: page number (default: 1)
    - per_page: items per page (default: 10)
    """
    query = request.args.get('q', '').strip()
    approach = request.args.get('approach', 'term_frequency_token')
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    if not query:
        return jsonify({
            'status': 'error',
            'message': 'Query parameter "q" is required'
        }), 400
    
    if page < 1:
        page = 1
    if per_page < 1 or per_page > 100:
        per_page = 10
    
    start_time = time.time()
    
    if approach == 'term_frequency_token':
        results = search_term_frequency_token(messages_data, query, page, per_page)
    elif approach == 'sentence_embedding':
        results = search_sentence_embedding(messages_data, query, page, per_page)
    else:
        return jsonify({
            'status': 'error',
            'message': f'Unknown approach: {approach}. Available approaches: term_frequency_token, sentence_embedding'
        }), 400
    
    processing_time_ms = int((time.time() - start_time) * 1000)
    
    return jsonify({
        'status': 'success',
        'query': query,
        'approach': approach,
        'processing_time_ms': processing_time_ms,
        **results
    }), 200


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)

