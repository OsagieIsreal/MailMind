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
  if (!user) return res.status(404).json({ error: 'User not found' })

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: user.email,
      line_items: [{ price: process.env.STRIPE_PREMIUM_PRICE_ID!, quantity: 1 }],
      success_url: `${process.env.VITE_APP_URL}/upgrade-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VITE_APP_URL}/pricing`,
      metadata: { userId: user.id },
    })
    return res.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return res.status(500).json({ error: 'Could not create checkout session' })
  }
}
