'use client'

import { FormEvent } from 'react'

interface SearchBarProps {
  query: string
  approach: string
  onQueryChange: (query: string) => void
  onApproachChange: (approach: string) => void
  onSubmit: (e: FormEvent) => void
  loading: boolean
}

export default function SearchBar({
  query,
  approach,
  onQueryChange,
  onApproachChange,
  onSubmit,
  loading
}: SearchBarProps) {
  return (
    <form onSubmit={onSubmit} style={{ marginBottom: 'clamp(24px, 6vw, 40px)' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        backgroundColor: '#fff',
        borderRadius: '24px',
        padding: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e0e0e0',
        transition: 'box-shadow 0.2s'
      }}
      className="search-container"
      >
        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          flex: 1
        }}>
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search messages..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: 'clamp(14px, 4vw, 16px)',
              padding: '8px 12px',
              background: 'transparent',
              minWidth: 0
            }}
            disabled={loading}
          />
          
          <button
            type="submit"
            disabled={loading || !query.trim()}
            style={{
              padding: '10px 20px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: loading ? '#ccc' : '#696FC7',
              color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: 'clamp(14px, 4vw, 16px)',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background-color 0.2s',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            {loading ? (
              'Searching...'
            ) : (
              <>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <span className="search-text">Search</span>
              </>
            )}
          </button>
        </div>
        
        <select
          value={approach}
          onChange={(e) => onApproachChange(e.target.value)}
          style={{
            padding: '10px 16px',
            borderRadius: '16px',
            border: '1px solid #e0e0e0',
            fontSize: 'clamp(14px, 4vw, 16px)',
            backgroundColor: '#fff',
            color: '#696FC7',
            cursor: 'pointer',
            outline: 'none',
            fontWeight: '500',
            width: '100%'
          }}
          disabled={loading}
        >
          <option value="term_frequency_token">Term Frequency</option>
          <option value="sentence_embedding">Sentence Embedding</option>
        </select>
      </div>
      <style jsx>{`
        @media (min-width: 640px) {
          .search-container {
            flex-direction: row !important;
            padding: 8px 8px 8px 24px !important;
          }
          .search-container select {
            width: auto !important;
            flex-shrink: 0;
          }
        }
        @media (max-width: 480px) {
          .search-text {
            display: none;
          }
        }
      `}</style>
    </form>
  )
}

