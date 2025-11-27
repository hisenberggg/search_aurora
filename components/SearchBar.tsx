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
    <form onSubmit={onSubmit} style={{ marginBottom: '40px' }}>
      <div style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: '24px',
        padding: '8px 8px 8px 24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e0e0e0',
        transition: 'box-shadow 0.2s'
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
            fontSize: '16px',
            padding: '8px 0',
            background: 'transparent'
          }}
          disabled={loading}
        />
        
        <select
          value={approach}
          onChange={(e) => onApproachChange(e.target.value)}
          style={{
            padding: '8px 16px',
            borderRadius: '16px',
            border: '1px solid #e0e0e0',
            fontSize: '14px',
            backgroundColor: '#fff',
            color: '#696FC7',
            cursor: 'pointer',
            outline: 'none',
            fontWeight: '500'
          }}
          disabled={loading}
        >
          <option value="term_frequency_token">Term Frequency</option>
          <option value="sentence_embedding">Sentence Embedding</option>
        </select>

        <button
          type="submit"
          disabled={loading || !query.trim()}
          style={{
            padding: '10px 24px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: loading ? '#ccc' : '#696FC7',
            color: '#fff',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background-color 0.2s'
          }}
        >
          {loading ? (
            'Searching...'
          ) : (
            <>
              <svg
                width="20"
                height="20"
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
              Search
            </>
          )}
        </button>
      </div>
    </form>
  )
}

