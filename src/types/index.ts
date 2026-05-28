export interface Email {
  id: string; threadId: string; from: string; fromName: string
  subject: string; snippet: string; body: string; date: string
  read: boolean; starred: boolean; archived: boolean
  priorityScore: number; labels: string[]; replied?: boolean
}

export type Tone = 'formal' | 'friendly' | 'brief'
export type Filter = 'inbox' | 'unread' | 'starred' | 'priority'
export type ReplyState = 'idle' | 'loading' | 'reviewing' | 'sent'

export interface User {
  id: string; email: string; name: string; tier: 'free' | 'premium'
}

export interface UsageInfo {
  tier: 'free' | 'premium'
  used: number | null
  limit: number | null
  remaining: number | null
}

export interface AuthState {
  user: User | null
  token: string | null
}

export interface InboxStats {
  unread: number
  starred: number
  urgent: number
}

export const FREE_DAILY_LIMIT = 20
