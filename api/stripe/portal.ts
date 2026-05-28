import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'
import { extractToken } from '../_lib/jwt.js'
import { userStore } from '../_lib/userStore.js'
import { handleCors } from '../_lib/cors.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const payload = extractToken(req.headers.authorization)
  if (!payload) return res.status(401).json({ error: 'Unauthorized' })

  const user = userStore.findById(payload.id)
  if (!user?.stripeCustomerId) return res.status(400).json({ error: 'No active subscription' })

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.VITE_APP_URL}/settings`,
    })
    return res.json({ url: session.url })
  } catch {
    return res.status(500).json({ error: 'Could not open billing portal' })
  }
}
