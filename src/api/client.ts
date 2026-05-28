// ─── API Client ────────────────────────────────────────────────────────────────

const BASE = ''  // Vercel serves /api from same origin

function getToken() { return localStorage.getItem('mailmind_token') }

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  const data = await res.json()
  if (!res.ok) throw { status: res.status, ...data }
  return data as T
}

export const authApi = {
  register: (email: string, password: string, name: string) =>
    request<{ token: string; user: any }>('/api/auth/register', {
      method: 'POST', body: JSON.stringify({ email, password, name }),
    }),
  login: (email: string, password: string) =>
    request<{ token: string; user: any }>('/api/auth/login', {
      method: 'POST', body: JSON.stringify({ email, password }),
    }),
  googleCallback: (code: string) =>
    request<{ token: string; user: any }>('/api/auth/google', {
      method: 'POST', body: JSON.stringify({ code }),
    }),
  getGoogleUrl: () =>
    request<{ url: string }>('/api/auth/google'),
}

export const aiApi = {
  summarise: (from: string, subject: string, body: string) =>
    request<{ summary: string; usage: any }>('/api/ai/summarise', {
      method: 'POST', body: JSON.stringify({ from, subject, body }),
    }),
  score: (from: string, subject: string, body: string) =>
    request<{ score: number }>('/api/ai/score', {
      method: 'POST', body: JSON.stringify({ from, subject, body }),
    }),
  reply: (from: string, subject: string, body: string, tone: string) =>
    request<{ draft: string; usage: any }>('/api/ai/reply', {
      method: 'POST', body: JSON.stringify({ from, subject, body, tone }),
    }),
  usage: () =>
    request<{ tier: string; used: number; limit: number; remaining: number }>('/api/ai/usage'),
}

export const stripeApi = {
  createCheckout: () => request<{ url: string }>('/api/stripe/checkout', { method: 'POST' }),
  portal: () => request<{ url: string }>('/api/stripe/portal', { method: 'POST' }),
}
