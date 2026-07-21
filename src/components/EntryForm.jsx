import { useState } from 'react'

export default function EntryForm({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [password, setPassword] = useState(initial?.password ?? '')
  const [memo, setMemo] = useState(initial?.memo ?? '')

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !password.trim()) return
    onSave({ name: name.trim(), password: password.trim(), memo: memo.trim() })
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h2>{initial?.id ? '비밀번호 수정' : '비밀번호 추가'}</h2>
        <label>
          건물/장소 이름
          <input value={name} onChange={(e) => setName(e.target.value)} autoFocus required />
        </label>
        <label>
          비밀번호
          <input value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <label>
          메모 (선택)
          <input
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="예: 3층 여자화장실"
          />
        </label>
        <div className="modal-actions">
          <button type="button" onClick={onCancel}>
            취소
          </button>
          <button type="submit">저장</button>
        </div>
      </form>
    </div>
  )
}
