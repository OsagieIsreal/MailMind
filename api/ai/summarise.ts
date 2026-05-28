import type { VercelRequest, VercelResponse } from '@vercel/node'
import { extractToken } from '../_lib/jwt.js'
import { userStore, FREE_DAILY_LIMIT } from '../_lib/userStore.js'
import { summariseEmail } from '../_lib/aiService.js'
import { handleCors } from '../_lib/cors.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const user = extractToken(req.headers.authorization)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  const { from, subject, body } = req.body ?? {}
  if (!from || !subject || !body) return res.status(400).json({ error: 'Missing fields' })

  const { allowed, remaining } = userStore.checkAndConsume(user.id)
  if (!allowed) return res.status(429).json({ error: 'Daily limit reached', upgrade: true, limit: FREE_DAILY_LIMIT })

  try {
    const summary = await summariseEmail(user.tier, from, subject, body)
    const u = userStore.findById(user.id)!
    const today = new Date().toISOString().split('T')[0]
    return res.json({
      summary,
      usage: {
        tier: u.tier,
        used: u.tier === 'free' ? (u.usageResetDate === today ? u.usageCount : 0) : null,
        limit: u.tier === 'free' ? FREE_DAILY_LIMIT : null,
        remaining: u.tier === 'free' ? remaining : null,
      },
    })
  } catch {
    return res.status(500).json({ error: 'AI service error' })
  }
}
