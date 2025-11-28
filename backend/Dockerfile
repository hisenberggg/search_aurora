# Use Python 3.12 slim image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies for FAISS and other libraries
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app.py .
COPY search_approaches ./search_approaches

# Expose port (Fly.io will set PORT env variable)
EXPOSE 8080

# Use gunicorn to run the Flask app
# Using 1 worker to ensure shared in-memory state (messages_data)
CMD gunicorn app:app --bind 0.0.0.0:${PORT:-8080} --workers 1 --timeout 120 --preload

