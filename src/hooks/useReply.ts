import { useState } from 'react'
import type { Email, Tone, ReplyState } from '@/types'
import type { UsageInfo } from '@/types'
import { aiApi } from '@/api/client'

export function useReply(onReplied: (id: string) => void, onUsageUpdate: (u: UsageInfo) => void) {
  const [tone, setTone] = useState<Tone>('formal')
  const [replyState, setReplyState] = useState<ReplyState>('idle')
  const [draft, setDraft] = useState('')
  const [editedDraft, setEditedDraft] = useState('')
  const [error, setError] = useState<string | null>(null)

  const reset = () => { setReplyState('idle'); setDraft(''); setEditedDraft(''); setError(null) }

  const generate = async (email: Email) => {
    setReplyState('loading')
    setError(null)
    try {
      const res = await aiApi.reply(email.from, email.subject, email.body, tone)
      setDraft(res.draft)
      setEditedDraft(res.draft)
      if (res.usage) onUsageUpdate(res.usage)
      setReplyState('reviewing')
    } catch (err: any) {
      if (err?.upgrade) {
        setError('upgrade')
      } else {
        setError('Failed to generate reply. Please try again.')
      }
      setReplyState('idle')
    }
  }

  const send = (emailId: string) => { setReplyState('sent'); onReplied(emailId) }

  return { tone, setTone, replyState, draft, editedDraft, setEditedDraft, error, reset, generate, send }
}
