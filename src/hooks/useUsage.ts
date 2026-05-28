import { useState, useCallback } from 'react'
import type { UsageInfo } from '@/types'
import { aiApi } from '@/api/client'
import { FREE_DAILY_LIMIT } from '@/types'

export function useUsage() {
  const [usage, setUsage] = useState<UsageInfo>({
    tier: 'free', used: 0, limit: FREE_DAILY_LIMIT, remaining: FREE_DAILY_LIMIT,
  })
  const [limitHit, setLimitHit] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const data = await aiApi.usage()
      setUsage(data as UsageInfo)
      setLimitHit(data.tier === 'free' && data.remaining === 0)
    } catch {}
  }, [])

  const updateFromResponse = (u: UsageInfo) => {
    setUsage(u)
    setLimitHit(u.tier === 'free' && (u.remaining ?? 1) <= 0)
  }

  return { usage, limitHit, refresh, updateFromResponse }
}
