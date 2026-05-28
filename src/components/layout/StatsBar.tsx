import { HStack, Box } from '@chakra-ui/react'
import { StatCard } from '@/components/shared/StatCard'
import type { InboxStats } from '@/types'
export const StatsBar = ({ stats }: { stats: InboxStats }) => (
  <Box px={6} py={3} bg="bg.surface" borderBottom="1px solid" borderColor="border.default">
    <HStack spacing={2.5}>
      <StatCard label="Unread" value={stats.unread} accentColor="#4f8ef7"/>
      <StatCard label="Urgent" value={stats.urgent} accentColor="#f87171"/>
      <StatCard label="Starred" value={stats.starred} accentColor="#fbbf24"/>
      <StatCard label="Replied" value={stats.replied} accentColor="#34d399"/>
    </HStack>
  </Box>
)
