// Gmail integration via backend proxy
import type { Email } from '@/types'

export async function fetchGmailInbox(token: string): Promise<Email[]> {
  const res = await fetch('/api/gmail/inbox', {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Failed to fetch Gmail inbox')
  return res.json()
}
