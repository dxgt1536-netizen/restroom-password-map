import { useState } from 'react'

export default function EntryList({ entries, onSelect, onEdit, onDelete }) {
  const [query, setQuery] = useState('')

  const filtered = entries.filter((entry) =>
    entry.name.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="entry-list">
      <input
        className="entry-list-search"
        placeholder="저장된 장소 검색"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {filtered.length === 0 && <p className="entry-list-empty">저장된 비밀번호가 없습니다.</p>}
      <ul>
        {filtered.map((entry) => (
          <li key={entry.id}>
            <button type="button" className="entry-item" onClick={() => onSelect(entry)}>
              <span className="entry-name">{entry.name}</span>
              {entry.memo && <span className="entry-memo">{entry.memo}</span>}
            </button>
            <button
              type="button"
              className="entry-edit"
              onClick={() => onEdit(entry)}
              aria-label={`${entry.name} 수정`}
            >
              ✎
            </button>
            <button
              type="button"
              className="entry-delete"
              onClick={() => onDelete(entry.id)}
              aria-label={`${entry.name} 삭제`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
