'use client'

import { useState, FormEvent, useEffect } from 'react'
import SearchBar from '@/components/SearchBar'
import SearchResults from '@/components/SearchResults'

interface SearchResult {
  id: string
  user_id: string
  user_name: string
  timestamp: string
  message: string
}

interface SearchResponse {
  status: string
  query: string
  approach: string
  total: number
  items: SearchResult[]
  page: number
  per_page: number
  total_pages: number
  processing_time_ms?: number
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function Home() {
  const [query, setQuery] = useState('')
  const [approach, setApproach] = useState('term_frequency_token')
  const [results, setResults] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [queryTime, setQueryTime] = useState<number | null>(null)

  // Load data on startup (silently)
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/load_data`)
        if (response.ok) {
          const data = await response.json()
          console.log('Data loaded:', data.message)
        } else {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || `HTTP ${response.status}: Failed to load data`)
        }
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to load data. Make sure the backend is running on http://localhost:5000'
        setError(errorMessage)
        console.error('Error loading data:', err)
      } finally {
        setDataLoading(false)
      }
    }

    loadData()
  }, [])

  const handleSearch = async (searchQuery: string, searchApproach: string, page: number = 1) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setError(null)
    setQueryTime(null)

    const startTime = performance.now()

    try {
      const response = await fetch(
        `${API_BASE_URL}/search?q=${encodeURIComponent(searchQuery)}&approach=${searchApproach}&page=${page}&per_page=10`
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP ${response.status}: Search failed`)
      }

      const data = await response.json()
      
      // Use backend processing time if available, otherwise use client-side timing
      const executionTime = data.processing_time_ms || Math.round(performance.now() - startTime)
      
      setResults(data)
      setQueryTime(executionTime)
      setError(null)
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to search. Make sure the backend is running on http://localhost:5000'
      setError(errorMessage)
      setResults(null)
      setQueryTime(null)
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    handleSearch(query, approach, 1)
  }

  const handlePageChange = (page: number) => {
    if (results) {
      handleSearch(query, approach, page)
    }
  }

  return (
    <main style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ 
          textAlign: 'center', 
          fontSize: '48px', 
          fontWeight: '300',
          color: '#696FC7',
          marginBottom: '40px',
          letterSpacing: '-1px'
        }}>
          Search Messages
        </h1>

        <SearchBar
          query={query}
          approach={approach}
          onQueryChange={setQuery}
          onApproachChange={setApproach}
          onSubmit={handleSubmit}
          loading={loading || dataLoading}
        />

        {error && (
          <div style={{
            marginTop: '20px',
            padding: '12px',
            backgroundColor: '#fee',
            color: '#c33',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {results && (
          <SearchResults
            results={results}
            onPageChange={handlePageChange}
            queryTime={queryTime}
          />
        )}
      </div>
    </main>
  )
}

