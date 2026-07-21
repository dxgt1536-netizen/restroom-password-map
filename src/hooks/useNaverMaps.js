import { useEffect, useState } from 'react'

const SCRIPT_ID = 'naver-maps-script'
let loadPromise = null

function loadNaverMapsScript(clientId) {
  if (window.naver?.maps) return Promise.resolve()
  if (loadPromise) return loadPromise

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}&submodules=geocoder`
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('네이버 지도 스크립트를 불러오지 못했습니다.'))
    document.head.appendChild(script)
  })

  return loadPromise
}

export function useNaverMaps() {
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const clientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID

  useEffect(() => {
    if (!clientId) {
      setStatus('error')
      return
    }
    loadNaverMapsScript(clientId)
      .then(() => setStatus('ready'))
      .catch(() => setStatus('error'))
  }, [clientId])

  return { status, hasClientId: Boolean(clientId) }
}
