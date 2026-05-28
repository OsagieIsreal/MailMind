import { HStack, Box } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
const pulse = keyframes`0%,100%{opacity:.3;transform:scale(.7)}50%{opacity:1;transform:scale(1.3)}`
export const LoadingDots = () => (
  <HStack spacing={1.5} py={1}>
    {[0,1,2].map(i=>(
      <Box key={i} w="6px" h="6px" borderRadius="full" bg="accent.default"
        animation={`${pulse} 1.2s ease-in-out ${i*0.2}s infinite`} />
    ))}
  </HStack>
)
