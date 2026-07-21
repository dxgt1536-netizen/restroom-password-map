import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Geolocation } from '@capacitor/geolocation'
import SearchBox from './SearchBox.jsx'

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 } // 서울시청
const BASE_ZOOM = 16

const TEXT_ZOOM = 17 // 대략 축척 50m 수준. 이 줌 이상에서만 비밀번호 텍스트 표시
const DOT_SIZE = 6 // px, 그 아래(축척 100m~)에서는 항상 이 크기의 점으로 표시

function applyZoomState(el, zoom) {
  if (zoom >= TEXT_ZOOM) {
    el.classList.remove('map-marker-pill--dot')
    el.style.width = ''
    el.style.height = ''
    el.textContent = el.dataset.password
    return
  }

  el.classList.add('map-marker-pill--dot')
  el.style.width = `${DOT_SIZE}px`
  el.style.height = `${DOT_SIZE}px`
  el.textContent = ''
}

const MapView = forwardRef(function MapView({ entries, onMapClick, onEditEntry }, ref) {
  const mapDivRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef(new Map())
  const markerElsRef = useRef(new Map())
  const myLocationMarkerRef = useRef(null)
  const zoomRef = useRef(BASE_ZOOM)
  const [locating, setLocating] = useState(false)

  useImperativeHandle(ref, () => ({
    panTo(lat, lng) {
      const map = mapRef.current
      if (!map) return
      map.panTo(new window.naver.maps.LatLng(lat, lng))
      map.setZoom(18)
    },
  }))

  async function locateMe(map) {
    setLocating(true)
    try {
      const permission = await Geolocation.checkPermissions()
      const granted =
        permission.location === 'granted' || permission.coarseLocation === 'granted'

      if (!granted) {
        const requested = await Geolocation.requestPermissions()
        if (requested.location !== 'granted' && requested.coarseLocation !== 'granted') {
          return
        }
      }

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 8000,
      })
      const here = new window.naver.maps.LatLng(position.coords.latitude, position.coords.longitude)
      map.panTo(here)

      if (!myLocationMarkerRef.current) {
        myLocationMarkerRef.current = new window.naver.maps.Marker({
          position: here,
          map,
          icon: buildMyLocationIcon(),
          zIndex: 50,
        })
      } else {
        myLocationMarkerRef.current.setPosition(here)
      }
    } catch {
      // 위치 권한 거부/실패 시에는 조용히 기본 위치를 유지한다
    } finally {
      setLocating(false)
    }
  }

  useEffect(() => {
    if (mapRef.current) return

    const center = new window.naver.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng)
    const map = new window.naver.maps.Map(mapDivRef.current, {
      center,
      zoom: BASE_ZOOM,
    })
    mapRef.current = map

    map.addListener('click', (e) => {
      onMapClick(e.coord.lat(), e.coord.lng())
    })

    map.addListener('zoom_changed', () => {
      const zoom = map.getZoom()
      zoomRef.current = zoom
      for (const el of markerElsRef.current.values()) {
        applyZoomState(el, zoom)
      }
    })

    locateMe(map)
    // 최초 1회만 지도를 생성한다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const currentIds = new Set(entries.map((entry) => entry.id))

    for (const [id, marker] of markersRef.current) {
      if (!currentIds.has(id)) {
        marker.setMap(null)
        markersRef.current.delete(id)
        markerElsRef.current.delete(id)
      }
    }

    entries.forEach((entry) => {
      let marker = markersRef.current.get(entry.id)
      const position = new window.naver.maps.LatLng(entry.lat, entry.lng)
      const icon = buildMarkerIcon(entry, onEditEntry)
      applyZoomState(icon.content, zoomRef.current)

      if (!marker) {
        marker = new window.naver.maps.Marker({ position, map, icon })
        markersRef.current.set(entry.id, marker)
      } else {
        marker.setPosition(position)
        marker.setIcon(icon)
      }
      markerElsRef.current.set(entry.id, icon.content)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries])

  return (
    <div className="map-container">
      <div ref={mapDivRef} className="map-canvas" />
      <SearchBox mapRef={mapRef} />
      <button
        type="button"
        className="locate-button"
        onClick={() => mapRef.current && locateMe(mapRef.current)}
        disabled={locating}
      >
        {locating ? '...' : '내 위치'}
      </button>
    </div>
  )
})

function buildMarkerIcon(entry, onEditEntry) {
  const el = document.createElement('div')
  el.className = 'map-marker-pill'
  el.dataset.password = entry.password
  el.textContent = entry.password
  el.title = entry.memo ? `${entry.name} · ${entry.memo}` : entry.name

  el.addEventListener('click', (e) => {
    e.stopPropagation()
    onEditEntry(entry)
  })

  return {
    content: el,
    anchor: new window.naver.maps.Point(0, 10),
  }
}

function buildMyLocationIcon() {
  const el = document.createElement('div')
  el.className = 'map-my-location-dot'
  return {
    content: el,
    anchor: new window.naver.maps.Point(8, 8),
  }
}

export default MapView
