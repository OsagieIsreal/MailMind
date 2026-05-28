import { useState, useEffect } from 'react'
import { Box, Flex, Text, useColorMode } from '@chakra-ui/react'
import type { Email } from '@/types'
import type { UsageInfo } from '@/types'
import { useEmails } from '@/hooks/useEmails'
import { useUsage } from '@/hooks/useUsage'
import { useAuthState } from '@/hooks/useAuth'
import { Sidebar } from '@/components/layout/Sidebar'
import { StatsBar } from '@/components/layout/StatsBar'
import { EmailDetail } from '@/components/email/EmailDetail'
import { ToastNotification } from '@/components/shared/ToastNotification'
import { UsageBanner } from '@/components/shared/UsageBanner'
import { AuthPage } from '@/pages/AuthPage'
import { aiApi } from '@/api/client'

export default function App() {
  const { colorMode, toggleColorMode } = useColorMode()
  const auth = useAuthState()
  const {
    visibleEmails, stats, filter, search,
    setFilter, setSearch, setAllEmails,
    markRead, toggleStar, archiveEmail, markReplied, setPriorityScore,
  } = useEmails()
  const { usage, limitHit, refresh: refreshUsage, updateFromResponse } = useUsage()
  const [selected, setSelected] = useState<Email | null>(null)
  const [toast, setToast] = useState<Email | null>(null)
  const [gmailConnected, setGmailConnected] = useState(false)
  const [gmailLoading, setGmailLoading] = useState(false)

  // Handle Google OAuth callback — ?code= in URL after redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (code) {
      window.history.replaceState({}, '', '/')
      auth.handleGoogleCallback(code)
    }
  }, [])

  useEffect(() => { if (auth.user) refreshUsage() }, [auth.user])

  useEffect(() => {
    const t = setTimeout(() => {
      const urgent = visibleEmails.find(e => e.priorityScore >= 80)
      if (urgent) setToast(urgent)
    }, 7000)
    return () => clearTimeout(t)
  }, [])

  const handleSelectEmail = (email: Email) => { markRead(email.id); setSelected(email) }

  const connectGmail = async () => {
    setGmailLoading(true)
    try {
      // Uses Gmail MCP via backend AI route
      const { fetchGmailInbox } = await import('@/api/gmail')
      const emails = await fetchGmailInbox(auth.token!)
      setAllEmails(emails)
      setGmailConnected(true)
      for (const email of emails) {
        try {
          const { score } = await aiApi.score(email.from, email.subject, email.body)
          setPriorityScore(email.id, score)
        } catch {}
      }
    } catch (err) { console.error('Gmail error:', err) }
    finally { setGmailLoading(false) }
  }

  if (!auth.user) {
    return (
      <AuthPage
        onLogin={auth.login}
        onRegister={auth.register}
        onGoogleLogin={auth.loginWithGoogle}
        isLoading={auth.isLoading}
      />
    )
  }

  return (
    <Flex h="100vh" overflow="hidden" bg="bg.canvas">
      <Sidebar
        emails={visibleEmails} selectedId={selected?.id ?? null}
        filter={filter} search={search} stats={stats}
        gmailConnected={gmailConnected} gmailLoading={gmailLoading} user={auth.user}
        onSelectEmail={handleSelectEmail} onFilterChange={setFilter}
        onSearchChange={setSearch} onConnectGmail={connectGmail}
        onToggleStar={toggleStar} onArchive={archiveEmail}
        onToggleTheme={toggleColorMode} isDark={colorMode === 'dark'}
        onLogout={auth.logout}
      />
      <Flex flex={1} flexDir="column" overflow="hidden">
        <UsageBanner usage={usage} limitHit={limitHit}/>
        <StatsBar stats={stats}/>
        {selected ? (
          <EmailDetail
            key={selected.id} email={selected} tier={auth.user.tier}
            onToggleStar={toggleStar}
            onArchive={id => { archiveEmail(id); setSelected(null) }}
            onReplied={markReplied} onUsageUpdate={updateFromResponse}
          />
        ) : (
          <Flex flex={1} align="center" justify="center" flexDir="column" gap={3}>
            <Box w="64px" h="64px" borderRadius="16px" bg="bg.card" border="1px solid"
              borderColor="border.default" display="flex" alignItems="center" justifyContent="center" fontSize="28px">
              ✦
            </Box>
            <Text fontFamily="heading" fontSize="22px" color="text.secondary" fontWeight="600">
              Select an email to begin
            </Text>
            <Text fontSize="13px" color="text.muted">
              {auth.user.tier === 'free' ? '✦ Gemini AI — free plan' : '⭐ Claude AI — premium'}
            </Text>
          </Flex>
        )}
      </Flex>
      {toast && <ToastNotification email={toast} onClose={() => setToast(null)}/>}
    </Flex>
  )
}
