import type { VercelRequest, VercelResponse } from '@vercel/node'
import bcrypt from 'bcryptjs'
import { userStore } from '../_lib/userStore.js'
import { signToken } from '../_lib/jwt.js'
import { handleCors } from '../_lib/cors.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, password, name } = req.body ?? {}
  if (!email || !password || !name)
    return res.status(400).json({ error: 'email, password and name are required' })

  if (userStore.findByEmail(email))
    return res.status(409).json({ error: 'Email already registered' })

  const passwordHash = await bcrypt.hash(password, 12)
  const user = userStore.create({ email, passwordHash, name, tier: 'free' })
  const token = signToken({ id: user.id, email: user.email, tier: user.tier })

  return res.status(201).json({
    token,
    user: { id: user.id, email: user.email, name: user.name, tier: user.tier, picture: user.picture },
  })
}
