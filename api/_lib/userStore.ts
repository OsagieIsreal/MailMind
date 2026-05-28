export interface User {
  id: string
  email: string
  passwordHash: string | null
  name: string
  picture?: string
  googleId?: string
  tier: 'free' | 'premium'
  usageCount: number
  usageResetDate: string
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  createdAt: string
}

export const FREE_DAILY_LIMIT = 20

const users = new Map<string, User>()
let counter = 1

export const userStore = {
  findByEmail: (email: string) => {
    for (const u of users.values()) if (u.email === email) return u
  },
  findById: (id: string) => users.get(id),
  findByGoogleId: (googleId: string) => {
    for (const u of users.values()) if (u.googleId === googleId) return u
  },
  create: (data: Omit<User, 'id' | 'createdAt' | 'usageCount' | 'usageResetDate'>): User => {
    const user: User = {
      ...data, id: String(counter++), usageCount: 0,
      usageResetDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    }
    users.set(user.id, user)
    return user
  },
  update: (id: string, patch: Partial<User>) => {
    const u = users.get(id)
    if (!u) return
    const updated = { ...u, ...patch }
    users.set(id, updated)
    return updated
  },
  checkAndConsume: (id: string): { allowed: boolean; remaining: number } => {
    const u = users.get(id)
    if (!u) return { allowed: false, remaining: 0 }
    if (u.tier === 'premium') return { allowed: true, remaining: Infinity }
    const today = new Date().toISOString().split('T')[0]
    const count = u.usageResetDate === today ? u.usageCount : 0
    if (count >= FREE_DAILY_LIMIT) return { allowed: false, remaining: 0 }
    userStore.update(id, { usageCount: count + 1, usageResetDate: today })
    return { allowed: true, remaining: FREE_DAILY_LIMIT - (count + 1) }
  },
}
