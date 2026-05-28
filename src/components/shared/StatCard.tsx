import { Box, Text } from '@chakra-ui/react'
export const StatCard = ({ label, value, accentColor }: { label:string; value:number|string; accentColor?:string }) => (
  <Box flex={1} bg="bg.stat" border="1px solid" borderColor="border.default" borderRadius="10px" px={4} py={3}>
    <Text fontFamily="mono" fontSize="22px" fontWeight="700" color={accentColor??'text.primary'} lineHeight={1}>{value}</Text>
    <Text fontSize="11px" color="text.secondary" fontWeight="600" mt={1}>{label}</Text>
  </Box>
)
