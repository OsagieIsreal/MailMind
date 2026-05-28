import { Box, Text, HStack } from '@chakra-ui/react'
import { LoadingDots } from '@/components/shared/LoadingDots'
export const EmailSummary = ({ summary, loading, tier }: { summary:string; loading:boolean; tier:string }) => (
  <Box bg="accent.dim" border="1px solid" borderColor="accent.dim" borderRadius="10px" px={4} py={3.5} mb={5}>
    <HStack spacing={2} mb={2}>
      <Text fontSize="10px" fontWeight="700" color="accent.default" letterSpacing="0.1em" textTransform="uppercase">✦ AI Summary</Text>
      <Box bg={tier==='premium'?'yellow.700':'green.800'} borderRadius="4px" px={1.5} py={0.5}>
        <Text fontSize="9px" fontWeight="700" color={tier==='premium'?'yellow.200':'green.300'}>{tier==='premium'?'Claude':'Gemini'}</Text>
      </Box>
    </HStack>
    {loading ? <LoadingDots/> : <Text fontSize="13px" lineHeight={1.7}>{summary||'Generating…'}</Text>}
  </Box>
)
