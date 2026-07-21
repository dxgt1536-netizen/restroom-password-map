import { useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import { BannerAd } from '@capgo/capacitor-admob'

const BANNER_AD_UNIT_ID = 'ca-app-pub-6113842446435581/4316953836'

export function useBannerAd() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    const banner = new BannerAd({ adUnitId: BANNER_AD_UNIT_ID, position: 'bottom' })
    banner.show().catch(() => {
      // 광고 로드 실패는 조용히 무시하고 앱은 정상 동작한다
    })
  }, [])
}
