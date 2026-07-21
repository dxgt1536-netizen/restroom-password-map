import { useState } from 'react'

export default function SearchBox({ mapRef }) {
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function moveTo(lat, lng) {
    const map = mapRef.current
    const point = new window.naver.maps.LatLng(Number(lat), Number(lng))
    map.panTo(point)
    map.setZoom(18)
  }

  function handleSearch(e) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return

    setError('')
    setLoading(true)
    const map = mapRef.current
    const center = map.getCenter()

    window.naver.maps.Service.geocode(
      { query: q, coordinate: `${center.x},${center.y}` },
      (status, response) => {
        setLoading(false)
        const result = status === window.naver.maps.Service.Status.OK && response.v2.addresses[0]
        if (!result) {
          setError('검색 결과가 없습니다. (주소로 검색해 주세요)')
          return
        }
        moveTo(result.y, result.x)
      },
    )
  }

  return (
    <form className="search-box" onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="주소 검색"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? '검색 중...' : '검색'}
      </button>
      {error && <div className="search-error">{error}</div>}
    </form>
  )
}
