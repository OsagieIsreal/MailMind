import { GoogleGenerativeAI } from '@google/generative-ai'

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export type Tier = 'free' | 'premium'
export type Tone = 'formal' | 'friendly' | 'brief'

async function geminiComplete(system: string, user: string): Promise<string> {
  const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction: system })
  const result = await model.generateContent(user)
  return result.response.text()
}

async function claudeComplete(system: string, user: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  })
  if (!res.ok) throw new Error(`Claude API ${res.status}`)
  const data = await res.json() as { content: { text?: string }[] }
  return data.content.map(b => b.text ?? '').join('')
}

export function aiComplete(tier: Tier, system: string, user: string): Promise<string> {
  return tier === 'premium' ? claudeComplete(system, user) : geminiComplete(system, user)
}

export async function summariseEmail(tier: Tier, from: string, subject: string, body: string) {
  return aiComplete(tier,
    tier === 'premium'
      ? 'You are an executive email assistant. In 1–2 sentences: summarise the email, flag urgency, and note any required action. Be direct and professional.'
      : 'Summarise this email in 1–2 sentences. Note urgency or required actions. Be concise.',
    `From: ${from}\nSubject: ${subject}\n\n${body}`,
  )
}

export async function scorePriority(tier: Tier, from: string, subject: string, body: string) {
  const r = await aiComplete(tier,
    'Return ONLY a number 0–100 representing email urgency. 100=critical. 0=newsletter. No other text.',
    `From: ${from}\nSubject: ${subject}\n\n${body}`,
  )
  const n = parseInt(r.trim(), 10)
  return isNaN(n) ? 50 : Math.min(100, Math.max(0, n))
}

const TONE_MAP: Record<Tone, string> = {
  formal:   'Write a formal, professional reply with proper salutation and sign-off.',
  friendly: 'Write a warm, conversational yet professional reply.',
  brief:    'Write a reply in 2–3 sentences max. Be direct.',
}

export async function generateReply(tier: Tier, from: string, subject: string, body: string, tone: Tone) {
  return aiComplete(tier,
    `You are an email reply assistant. ${TONE_MAP[tone]} Write ONLY the email body — no subject, no headers.`,
    `Original email from ${from}:\nSubject: ${subject}\n\n${body}`,
  )
}
