// ─── Google OAuth Callback ─────────────────────────────────────────────────────
// Called after Google redirects back with ?code=...
// Exchanges code → tokens → user info → JWT

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { OAuth2Client } from 'google-auth-library'
import { userStore } from '../_lib/userStore.js'
import { signToken } from '../_lib/jwt.js'
import { handleCors } from '../_lib/cors.js'

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.VITE_APP_URL}/api/auth/google`,
)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return

  // ── Step 1: Frontend sends { code } from Google's redirect ────────────────
  if (req.method === 'POST') {
    const { code } = req.body ?? {}
    if (!code) return res.status(400).json({ error: 'code is required' })

    try {
      // Exchange code for tokens
      const { tokens } = await client.getToken(code)
      client.setCredentials(tokens)

      // Verify ID token and get user info
      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token!,
        audience: process.env.GOOGLE_CLIENT_ID,
      })
      const payload = ticket.getPayload()!
      const { sub: googleId, email, name, picture } = payload

      if (!email) return res.status(400).json({ error: 'No email from Google' })

      // Find or create user
      let user = userStore.findByGoogleId(googleId!) ?? userStore.findByEmail(email)

      if (!user) {
        user = userStore.create({
          email, name: name ?? email, picture,
          passwordHash: null,
          googleId,
          tier: 'free',
        })
      } else if (!user.googleId) {
        // Link Google to existing email/password account
        user = userStore.update(user.id, { googleId, picture }) ?? user
      }

      const token = signToken({ id: user.id, email: user.email, tier: user.tier })
      return res.json({
        token,
        user: { id: user.id, email: user.email, name: user.name, tier: user.tier, picture: user.picture },
      })
    } catch (err) {
      console.error('Google OAuth error:', err)
      return res.status(401).json({ error: 'Google authentication failed' })
    }
  }

  // ── Step 2: GET — return the Google OAuth URL for the frontend to redirect to
  if (req.method === 'GET') {
    const url = client.generateAuthUrl({
      access_type: 'offline',
      scope: ['email', 'profile'],
      prompt: 'select_account',
    })
    return res.json({ url })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
