import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'
import { userStore } from '../_lib/userStore.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Vercel needs raw body for Stripe signature verification
export const config = { api: { bodyParser: false } }

async function getRawBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const sig = req.headers['stripe-signature'] as string
  const rawBody = await getRawBody(req)

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return res.status(400).send('Webhook signature verification failed')
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.CheckoutSession
      const userId = session.metadata?.userId
      if (userId && session.customer && session.subscription) {
        userStore.update(userId, {
          tier: 'premium',
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
        })
      }
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      // Find user by subscription ID and downgrade
      for (const id of Array.from((userStore as any).keys?.() ?? [])) {
        const u = userStore.findById(id as string)
        if (u?.stripeSubscriptionId === sub.id) {
          userStore.update(id as string, { tier: 'free', stripeSubscriptionId: undefined })
        }
      }
      break
    }
  }

  return res.json({ received: true })
}
