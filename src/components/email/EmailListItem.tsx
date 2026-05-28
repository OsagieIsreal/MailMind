import { Box, HStack, Text } from '@chakra-ui/react'
import type { Email } from '@/types'
import { Avatar } from '@/components/shared/Avatar'
import { PriorityBar } from '@/components/shared/PriorityBar'

export const EmailListItem = ({ email, isSelected, onSelect }: { email:Email; isSelected:boolean; onSelect:()=>void }) => (
  <Box px={3.5} py={3} borderBottom="1px solid" borderColor="border.default" cursor="pointer"
    borderLeft="2px solid" borderLeftColor={isSelected?'accent.default':'transparent'}
    bg={isSelected?'bg.cardHover':'transparent'} onClick={onSelect}
    _hover={{bg:'bg.cardHover'}} transition="all 0.15s">
    <HStack spacing={2.5} align="flex-start">
      <Avatar name={email.fromName} size={34}/>
      <Box flex={1} minW={0}>
        <HStack justify="space-between">
          <Text fontSize="12px" fontWeight={email.read?500:700} color={email.read?'text.secondary':'text.primary'} noOfLines={1} maxW="140px">{email.fromName}</Text>
          <Text fontSize="9px" color="text.muted" fontFamily="mono" flexShrink={0}>{email.date}</Text>
        </HStack>
        <Text fontSize="11px" mt={0.5} fontWeight={email.read?400:600} color={email.read?'text.secondary':'text.primary'} noOfLines={1}>{email.subject}</Text>
        <HStack mt={1.5} spacing={2}>
          <PriorityBar score={email.priorityScore}/>
          {!email.read && <Box w="5px" h="5px" borderRadius="full" bg="accent.default" flexShrink={0}/>}
          {email.replied && <Text fontSize="9px" color="green.400" fontWeight="700">↩ Replied</Text>}
          {email.starred && <Text fontSize="10px">⭐</Text>}
        </HStack>
      </Box>
    </HStack>
  </Box>
)
