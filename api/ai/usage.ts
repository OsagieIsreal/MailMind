import type { VercelRequest, VercelResponse } from '@vercel/node'
import { extractToken } from '../_lib/jwt.js'
import { userStore, FREE_DAILY_LIMIT } from '../_lib/userStore.js'
import { handleCors } from '../_lib/cors.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const user = extractToken(req.headers.authorization)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  const u = userStore.findById(user.id)
  if (!u) return res.status(404).json({ error: 'User not found' })

  const today = new Date().toISOString().split('T')[0]
  const used = u.usageResetDate === today ? u.usageCount : 0

  return res.json({
    tier: u.tier,
    used: u.tier === 'free' ? used : null,
    limit: u.tier === 'free' ? FREE_DAILY_LIMIT : null,
    remaining: u.tier === 'free' ? FREE_DAILY_LIMIT - used : null,
  })
}
