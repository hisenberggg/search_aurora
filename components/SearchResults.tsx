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
        marginBottom: '20px',
        color: '#666',
        fontSize: '14px'
      }}>
        Found {results.total} result{results.total !== 1 ? 's' : ''}
        {queryTime !== null && ` . ${queryTime} ms`}
      </div>

      <div style={{ marginBottom: '40px' }}>
        {results.items.map((item) => (
          <div
            key={item.id}
            style={{
              padding: '20px',
              marginBottom: '16px',
              backgroundColor: '#fff',
              borderRadius: '12px',
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
              border: '1px solid #f0f0f0',
              transition: 'box-shadow 0.2s'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '12px'
            }}>
              <div style={{
                fontWeight: '600',
                color: '#696FC7',
                fontSize: '16px'
              }}>
                {item.user_name}
              </div>
              <div style={{
                color: '#999',
                fontSize: '12px'
              }}>
                {formatDate(item.timestamp)}
              </div>
            </div>
            <div style={{
              color: '#333',
              fontSize: '15px',
              lineHeight: '1.6'
            }}>
              {item.message}
            </div>
          </div>
        ))}
      </div>

      {results.total_pages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => onPageChange(results.page - 1)}
            disabled={results.page === 1}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              backgroundColor: results.page === 1 ? '#f5f5f5' : '#fff',
              color: results.page === 1 ? '#ccc' : '#696FC7',
              cursor: results.page === 1 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Previous
          </button>

          {Array.from({ length: results.total_pages }, (_, i) => i + 1)
            .filter(page => {
              // Show first page, last page, current page, and pages around current
              return (
                page === 1 ||
                page === results.total_pages ||
                (page >= results.page - 1 && page <= results.page + 1)
              )
            })
            .map((page, index, array) => {
              // Add ellipsis if there's a gap
              const showEllipsisBefore = index > 0 && array[index - 1] < page - 1
              return (
                <div key={page} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {showEllipsisBefore && (
                    <span style={{ color: '#999', padding: '0 4px' }}>...</span>
                  )}
                  <button
                    onClick={() => onPageChange(page)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0',
                      backgroundColor: page === results.page ? '#696FC7' : '#fff',
                      color: page === results.page ? '#fff' : '#696FC7',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: page === results.page ? '600' : '500',
                      minWidth: '40px'
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
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              backgroundColor: results.page === results.total_pages ? '#f5f5f5' : '#fff',
              color: results.page === results.total_pages ? '#ccc' : '#696FC7',
              cursor: results.page === results.total_pages ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

