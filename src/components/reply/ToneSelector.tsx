import { HStack, Box, Text, VStack } from '@chakra-ui/react'
import type { Tone } from '@/types'
const TONES: {key:Tone;label:string;icon:string}[] = [
  {key:'formal',label:'Formal',icon:'👔'},{key:'friendly',label:'Friendly',icon:'😊'},{key:'brief',label:'Brief',icon:'⚡'}
]
export const ToneSelector = ({ tone, onChange }: { tone:Tone; onChange:(t:Tone)=>void }) => (
  <VStack align="flex-start" spacing={2} mb={4}>
    <Text fontSize="11px" color="text.muted" fontWeight="600" textTransform="uppercase" letterSpacing="0.08em">Reply Tone</Text>
    <HStack spacing={2}>
      {TONES.map(({key,label,icon})=>(
        <Box key={key} as="button" px={3.5} py={1.5} borderRadius="8px" border="1px solid"
          borderColor={tone===key?'accent.default':'border.default'}
          bg={tone===key?'accent.dim':'bg.card'} color={tone===key?'accent.default':'text.secondary'}
          fontSize="12px" fontWeight="600" cursor="pointer" display="flex" alignItems="center" gap={1.5}
          onClick={()=>onChange(key)} transition="all 0.15s" _hover={{opacity:.8}}>
          <Text as="span">{icon}</Text><Text as="span">{label}</Text>
        </Box>
      ))}
    </HStack>
  </VStack>
)
