import type { VercelRequest, VercelResponse } from '@vercel/node'
import { extractToken } from '../_lib/jwt.js'
import { userStore, FREE_DAILY_LIMIT } from '../_lib/userStore.js'
import { generateReply } from '../_lib/aiService.js'
import { handleCors } from '../_lib/cors.js'
import type { Tone } from '../_lib/aiService.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const user = extractToken(req.headers.authorization)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  const { from, subject, body, tone } = req.body ?? {}
  if (!from || !subject || !body || !tone) return res.status(400).json({ error: 'Missing fields' })

  const { allowed, remaining } = userStore.checkAndConsume(user.id)
  if (!allowed) return res.status(429).json({ error: 'Daily limit reached', upgrade: true, limit: FREE_DAILY_LIMIT })

  try {
    const draft = await generateReply(user.tier, from, subject, body, tone as Tone)
    const u = userStore.findById(user.id)!
    const today = new Date().toISOString().split('T')[0]
    return res.json({
      draft,
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
