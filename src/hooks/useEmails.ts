import { useState, useMemo } from 'react'
import type { Email, Filter } from '@/types'
import { MOCK_EMAILS } from '@/data/mockEmails'

export function useEmails() {
  const [emails, setEmails] = useState<Email[]>(MOCK_EMAILS)
  const [filter, setFilter] = useState<Filter>('inbox')
  const [search, setSearch] = useState('')

  const setAllEmails = (list: Email[]) => setEmails(list)
  const updateEmail = (id: string, patch: Partial<Email>) =>
    setEmails(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e))
  const markRead = (id: string) => updateEmail(id, { read: true })
  const toggleStar = (id: string) =>
    setEmails(prev => prev.map(e => e.id === id ? { ...e, starred: !e.starred } : e))
  const archiveEmail = (id: string) => updateEmail(id, { archived: true })
  const markReplied = (id: string) => updateEmail(id, { replied: true })
  const setPriorityScore = (id: string, score: number) => updateEmail(id, { priorityScore: score })

  const visibleEmails = useMemo(() =>
    emails.filter(e => {
      if (e.archived) return false
      if (filter === 'unread' && e.read) return false
      if (filter === 'starred' && !e.starred) return false
      if (filter === 'priority' && e.priorityScore < 50) return false
      const q = search.toLowerCase()
      if (q && !e.subject.toLowerCase().includes(q) &&
        !e.fromName.toLowerCase().includes(q) &&
        !e.snippet.toLowerCase().includes(q)) return false
      return true
    }).sort((a, b) => b.priorityScore - a.priorityScore),
    [emails, filter, search]
  )

  const stats = useMemo(() => ({
    unread: emails.filter(e => !e.read && !e.archived).length,
    urgent: emails.filter(e => e.priorityScore >= 80 && !e.archived).length,
    starred: emails.filter(e => e.starred).length,
    replied: emails.filter(e => e.replied).length,
  }), [emails])

  return {
    emails, visibleEmails, stats, filter, setFilter, search, setSearch,
    setAllEmails, markRead, toggleStar, archiveEmail, markReplied, setPriorityScore,
  }
}
