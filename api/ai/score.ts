import type { VercelRequest, VercelResponse } from '@vercel/node'
import { extractToken } from '../_lib/jwt.js'
import { userStore } from '../_lib/userStore.js'
import { scorePriority } from '../_lib/aiService.js'
import { handleCors } from '../_lib/cors.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const user = extractToken(req.headers.authorization)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  const { from, subject, body } = req.body ?? {}
  if (!from || !subject || !body) return res.status(400).json({ error: 'Missing fields' })

  const { allowed } = userStore.checkAndConsume(user.id)
  if (!allowed) return res.json({ score: 50 }) // non-fatal: return default

  try {
    const score = await scorePriority(user.tier, from, subject, body)
    return res.json({ score })
  } catch {
    return res.json({ score: 50 })
  }
}
