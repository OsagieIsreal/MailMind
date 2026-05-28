import { useEffect } from 'react'
import { Box, HStack, VStack, Text, IconButton } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { CloseIcon } from '@chakra-ui/icons'
import type { Email } from '@/types'
const slideIn = keyframes`from{transform:translateX(40px);opacity:0}to{transform:translateX(0);opacity:1}`
export const ToastNotification = ({ email, onClose }: { email: Email; onClose: () => void }) => {
  useEffect(() => { const t = setTimeout(onClose, 6000); return ()=>clearTimeout(t) }, [onClose])
  return (
    <Box position="fixed" bottom={6} right={6} zIndex={9999} bg="bg.card" maxW="340px"
      border="1px solid" borderColor="accent.default" borderLeftWidth="3px"
      borderRadius="12px" px={4} py={3.5} boxShadow="0 8px 32px rgba(0,0,0,0.4)"
      animation={`${slideIn} 0.3s ease`}>
      <HStack spacing={3} align="flex-start">
        <Box w="32px" h="32px" borderRadius="8px" bg="accent.dim" border="1px solid"
          borderColor="accent.dim" display="flex" alignItems="center" justifyContent="center" fontSize="16px" flexShrink={0}>🔔</Box>
        <VStack align="flex-start" spacing={0.5} flex={1}>
          <Text fontSize="11px" fontWeight="700" color="accent.default">Important email arrived</Text>
          <Text fontSize="13px" fontWeight="600">{email.fromName}</Text>
          <Text fontSize="11px" color="text.secondary" lineHeight={1.4}>{email.subject}</Text>
        </VStack>
        <IconButton aria-label="Dismiss" icon={<CloseIcon/>} size="xs" variant="ghost" color="text.muted" onClick={onClose}/>
      </HStack>
    </Box>
  )
}
