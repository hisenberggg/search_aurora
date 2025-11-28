'use client'

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
}

interface SearchResultsProps {
  results: SearchResponse
  onPageChange: (page: number) => void
  queryTime: number | null
}

export default function SearchResults({ results, onPageChange, queryTime }: SearchResultsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div>
      <div style={{
        marginBottom: 'clamp(16px, 4vw, 20px)',
        color: '#666',
        fontSize: 'clamp(12px, 3vw, 14px)',
        padding: '0 4px'
      }}>
        Found {results.total} result{results.total !== 1 ? 's' : ''}
        {queryTime !== null && ` . ${queryTime} ms`}
      </div>

      <div style={{ marginBottom: 'clamp(24px, 6vw, 40px)' }}>
        {results.items.map((item) => (
          <div
            key={item.id}
            style={{
              padding: 'clamp(16px, 4vw, 20px)',
              marginBottom: 'clamp(12px, 3vw, 16px)',
              backgroundColor: '#fff',
              borderRadius: '12px',
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
              border: '1px solid #f0f0f0',
              transition: 'box-shadow 0.2s'
            }}
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginBottom: 'clamp(8px, 2vw, 12px)'
            }}
            className="result-header"
            >
              <div style={{
                fontWeight: '600',
                color: '#696FC7',
                fontSize: 'clamp(14px, 4vw, 16px)'
              }}>
                {item.user_name}
              </div>
              <div style={{
                color: '#999',
                fontSize: 'clamp(11px, 3vw, 12px)'
              }}>
                {formatDate(item.timestamp)}
              </div>
            </div>
            <div style={{
              color: '#333',
              fontSize: 'clamp(14px, 4vw, 15px)',
              lineHeight: '1.6',
              wordBreak: 'break-word'
            }}>
              {item.message}
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        @media (min-width: 640px) {
          .result-header {
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: flex-start !important;
          }
        }
        @media (max-width: 639px) {
          .pagination-page-number {
            display: none;
          }
          .pagination-page-number.pagination-current,
          .pagination-page-number.pagination-first,
          .pagination-page-number.pagination-last {
            display: inline-block;
          }
        }
      `}</style>

      {results.total_pages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 'clamp(4px, 1vw, 8px)',
          flexWrap: 'wrap',
          padding: '0 4px'
        }}
        className="pagination-container"
        >
          <button
            onClick={() => onPageChange(results.page - 1)}
            disabled={results.page === 1}
            style={{
              padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px)',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              backgroundColor: results.page === 1 ? '#f5f5f5' : '#fff',
              color: results.page === 1 ? '#ccc' : '#696FC7',
              cursor: results.page === 1 ? 'not-allowed' : 'pointer',
              fontSize: 'clamp(12px, 3vw, 14px)',
              fontWeight: '500',
              whiteSpace: 'nowrap'
            }}
          >
            Previous
          </button>

          {Array.from({ length: results.total_pages }, (_, i) => i + 1)
            .filter(page => {
              return (
                page === 1 ||
                page === results.total_pages ||
                page === results.page ||
                (page >= results.page - 1 && page <= results.page + 1)
              )
            })
            .map((page, index, array) => {
              const showEllipsisBefore = index > 0 && array[index - 1] < page - 1
              const isFirst = page === 1
              const isLast = page === results.total_pages
              const isCurrent = page === results.page
              return (
                <div key={page} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {showEllipsisBefore && (
                    <span style={{ color: '#999', padding: '0 4px', fontSize: 'clamp(12px, 3vw, 14px)' }}>...</span>
                  )}
                  <button
                    onClick={() => onPageChange(page)}
                    className={`pagination-page-number ${isCurrent ? 'pagination-current' : ''} ${isFirst ? 'pagination-first' : ''} ${isLast ? 'pagination-last' : ''}`}
                    style={{
                      padding: 'clamp(6px, 1.5vw, 8px) clamp(10px, 2.5vw, 12px)',
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0',
                      backgroundColor: page === results.page ? '#696FC7' : '#fff',
                      color: page === results.page ? '#fff' : '#696FC7',
                      cursor: 'pointer',
                      fontSize: 'clamp(12px, 3vw, 14px)',
                      fontWeight: page === results.page ? '600' : '500',
                      minWidth: 'clamp(36px, 9vw, 40px)'
                    }}
                  >
                    {page}
                  </button>
                </div>
              )
            })}

          <button
            onClick={() => onPageChange(results.page + 1)}
            disabled={results.page === results.total_pages}
            style={{
              padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px)',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              backgroundColor: results.page === results.total_pages ? '#f5f5f5' : '#fff',
              color: results.page === results.total_pages ? '#ccc' : '#696FC7',
              cursor: results.page === results.total_pages ? 'not-allowed' : 'pointer',
              fontSize: 'clamp(12px, 3vw, 14px)',
              fontWeight: '500',
              whiteSpace: 'nowrap'
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

