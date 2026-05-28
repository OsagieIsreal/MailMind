import { Box, HStack, Text } from '@chakra-ui/react'
export const getPriorityColor = (s: number) => s>=80?'#f87171':s>=50?'#fbbf24':s>=25?'#4f8ef7':'#3d4f6a'
export const getPriorityLabel = (s: number) => s>=80?'Urgent':s>=50?'High':s>=25?'Normal':'Low'
export const PriorityBar = ({ score }: { score: number }) => (
  <HStack spacing={1.5}>
    <Box w="48px" h="4px" borderRadius="full" bg="border.default" overflow="hidden">
      <Box w={`${score}%`} h="100%" bg={getPriorityColor(score)} borderRadius="full" transition="width 0.4s" />
    </Box>
    <Text fontSize="10px" fontWeight="700" color={getPriorityColor(score)} fontFamily="mono">
      {getPriorityLabel(score)}
    </Text>
  </HStack>
)
