import { useRef, useState } from 'react'
import MapView from './components/MapView.jsx'
import EntryForm from './components/EntryForm.jsx'
import EntryList from './components/EntryList.jsx'
import { useNaverMaps } from './hooks/useNaverMaps.js'
import { useBannerAd } from './hooks/useBannerAd.js'
import { addEntry, getEntries, removeEntry, updateEntry } from './lib/storage.js'
import './App.css'

export default function App() {
  const { status, hasClientId } = useNaverMaps()
  useBannerAd()
  const [entries, setEntries] = useState(() => getEntries())
  const [formState, setFormState] = useState(null) // { mode: 'add', lat, lng } | { mode: 'edit', entry }
  const mapRef = useRef(null)

  function refresh() {
    setEntries(getEntries())
  }

  function handleMapClick(lat, lng) {
    setFormState({ mode: 'add', lat, lng })
  }

  function handleEditEntry(entry) {
    setFormState({ mode: 'edit', entry })
  }

  function handleDeleteEntry(id) {
    if (!window.confirm('이 비밀번호를 삭제할까요?')) return
    removeEntry(id)
    refresh()
  }

  function handleSave(data) {
    if (formState.mode === 'add') {
      addEntry({ ...data, lat: formState.lat, lng: formState.lng })
    } else {
      updateEntry(formState.entry.id, data)
    }
    setFormState(null)
    refresh()
  }

  function handleSelectFromList(entry) {
    mapRef.current?.panTo(entry.lat, entry.lng)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>화장실 비밀번호</h1>
      </header>
      <div className="app-body">
        <EntryList
          entries={entries}
          onSelect={handleSelectFromList}
          onEdit={handleEditEntry}
          onDelete={handleDeleteEntry}
        />
        <div className="map-area">
          {status === 'ready' && (
            <MapView
              ref={mapRef}
              entries={entries}
              onMapClick={handleMapClick}
              onEditEntry={handleEditEntry}
            />
          )}
          {status === 'loading' && <div className="map-status">지도를 불러오는 중...</div>}
          {status === 'error' && (
            <div className="map-status map-status-error">
              {hasClientId
                ? '지도를 불러오지 못했습니다. Client ID와 등록된 서비스 URL을 확인하세요.'
                : '.env 파일에 VITE_NAVER_MAP_CLIENT_ID를 설정해주세요.'}
            </div>
          )}
        </div>
      </div>
      {formState && (
        <EntryForm
          initial={formState.mode === 'edit' ? formState.entry : null}
          onSave={handleSave}
          onCancel={() => setFormState(null)}
        />
      )}
    </div>
  )
}
