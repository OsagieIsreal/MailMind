import type { VercelRequest, VercelResponse } from '@vercel/node'
import bcrypt from 'bcryptjs'
import { userStore } from '../_lib/userStore.js'
import { signToken } from '../_lib/jwt.js'
import { handleCors } from '../_lib/cors.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, password } = req.body ?? {}
  if (!email || !password)
    return res.status(400).json({ error: 'email and password are required' })

  const user = userStore.findByEmail(email)
  if (!user || !user.passwordHash)
    return res.status(401).json({ error: 'Invalid credentials' })

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

  const token = signToken({ id: user.id, email: user.email, tier: user.tier })
  return res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, tier: user.tier, picture: user.picture },
  })
}
