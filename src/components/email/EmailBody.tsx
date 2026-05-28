import { Box, Text } from '@chakra-ui/react'
export const EmailBody = ({ body }: { body: string }) => (
  <Box bg="bg.card" border="1px solid" borderColor="border.default" borderRadius="10px" px={5} py={5} mb={7}>
    <Text fontSize="13px" lineHeight={1.9} color="text.secondary" whiteSpace="pre-wrap">{body}</Text>
  </Box>
)
