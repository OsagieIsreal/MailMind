import { HStack, VStack, Box, Text, Button } from '@chakra-ui/react'
import type { Email } from '@/types'
import { Avatar } from '@/components/shared/Avatar'
import { PriorityBar, getPriorityColor } from '@/components/shared/PriorityBar'

export const EmailHeader = ({ email, onToggleStar, onArchive }: { email:Email; onToggleStar:()=>void; onArchive:()=>void }) => (
  <Box mb={5}>
    <HStack justify="space-between" mb={4}>
      <HStack spacing={2}>
        <Button size="xs" variant="outline" borderColor="border.default" color="text.secondary" onClick={onToggleStar} _hover={{bg:'bg.cardHover'}}>{email.starred?'⭐ Starred':'☆ Star'}</Button>
        <Button size="xs" variant="outline" borderColor="border.default" color="text.secondary" onClick={onArchive} _hover={{bg:'bg.cardHover'}}>🗂 Archive</Button>
      </HStack>
      <HStack spacing={2}>
        <Text fontSize="11px" color="text.muted" fontFamily="mono">Priority:</Text>
        <Text fontSize="12px" fontWeight="700" color={getPriorityColor(email.priorityScore)} fontFamily="mono">{email.priorityScore}/100</Text>
        <PriorityBar score={email.priorityScore}/>
      </HStack>
    </HStack>
    <Text fontFamily="heading" fontSize="22px" fontWeight="700" letterSpacing="-0.02em" lineHeight={1.3} mb={3}>{email.subject}</Text>
    <HStack spacing={3}>
      <Avatar name={email.fromName} size={40}/>
      <VStack align="flex-start" spacing={0}>
        <HStack><Text fontSize="13px" fontWeight="600">{email.fromName}</Text><Text fontSize="12px" color="text.muted">&lt;{email.from}&gt;</Text></HStack>
        <Text fontSize="11px" color="text.muted" fontFamily="mono">{email.date}</Text>
      </VStack>
      {email.replied&&<Box ml="auto" bg="green.900" border="1px solid" borderColor="green.700" borderRadius="6px" px={2.5} py={0.5}><Text fontSize="11px" color="green.300" fontWeight="700">✓ Replied</Text></Box>}
    </HStack>
  </Box>
)
