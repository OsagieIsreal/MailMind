import { Box, VStack, HStack, Text, Textarea, Button } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import type { ReplyState, Tone } from '@/types'
import { LoadingDots } from '@/components/shared/LoadingDots'
import { ToneSelector } from './ToneSelector'

const fadeUp = keyframes`from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}`

interface Props {
  replyState: ReplyState; tone: Tone; editedDraft: string; tier: string
  onToneChange:(t:Tone)=>void; onEditDraft:(v:string)=>void
  onGenerate:()=>void; onSend:()=>void; onRegenerate:()=>void; onDiscard:()=>void
}

export const ReplyComposer = ({ replyState,tone,editedDraft,tier,onToneChange,onEditDraft,onGenerate,onSend,onRegenerate,onDiscard }: Props) => {
  if (replyState==='sent') return (
    <HStack bg="green.900" border="1px solid" borderColor="green.700" borderRadius="10px" px={5} py={4} spacing={3} animation={`${fadeUp} 0.3s ease`}>
      <Text fontSize="20px">✓</Text>
      <VStack align="flex-start" spacing={0.5}>
        <Text fontSize="13px" fontWeight="700" color="green.300">Reply sent successfully</Text>
        <Text fontSize="12px" color="green.600">Your reply has been delivered.</Text>
      </VStack>
    </HStack>
  )
  return (
    <VStack align="flex-start" spacing={3} w="100%">
      <ToneSelector tone={tone} onChange={onToneChange}/>
      {replyState==='idle'&&(
        <HStack spacing={3} align="center">
          <Button bg="accent.default" color="white" _hover={{opacity:.85}} size="md" onClick={onGenerate}
            boxShadow="0 0 24px rgba(79,142,247,0.2)">✦ Generate Smart Reply</Button>
          <Box bg={tier==='premium'?'yellow.700':'green.800'} borderRadius="5px" px={2} py={1}>
            <Text fontSize="10px" fontWeight="700" color={tier==='premium'?'yellow.200':'green.300'}>
              {tier==='premium'?'⭐ Claude AI':'✦ Gemini AI'}
            </Text>
          </Box>
        </HStack>
      )}
      {replyState==='loading'&&(
        <HStack bg="bg.card" border="1px solid" borderColor="border.default" borderRadius="10px" px={5} py={4} spacing={3} w="100%">
          <LoadingDots/><Text fontSize="13px" color="text.secondary">Drafting your {tone} reply…</Text>
        </HStack>
      )}
      {replyState==='reviewing'&&(
        <Box w="100%" bg="bg.card" border="1px solid" borderColor="border.default" borderRadius="10px" overflow="hidden" animation={`${fadeUp} 0.3s ease`}>
          <HStack px={4} py={3} borderBottom="1px solid" borderColor="border.default" justify="space-between">
            <Text fontSize="12px" fontWeight="600">✏️ Review Before Sending</Text>
            <Box bg="accent.dim" borderRadius="5px" px={2} py={0.5}>
              <Text fontSize="10px" fontWeight="700" color="accent.default">AI · {tone} · Edit freely</Text>
            </Box>
          </HStack>
          <Textarea value={editedDraft} onChange={e=>onEditDraft(e.target.value)} rows={8}
            bg="transparent" border="none" borderRadius={0} resize="vertical"
            fontSize="13px" lineHeight={1.8} color="text.primary" fontFamily="body" p={4}
            _focus={{boxShadow:'none',border:'none'}}/>
          <HStack px={4} py={3} borderTop="1px solid" borderColor="border.default" spacing={2}>
            <Button bg="green.500" color="white" size="sm" _hover={{opacity:.85}} onClick={onSend}>✓ Send Reply</Button>
            <Button variant="outline" borderColor="border.default" color="text.secondary" size="sm" _hover={{bg:'bg.cardHover'}} onClick={onRegenerate}>↻ Regenerate</Button>
            <Button variant="ghost" color="text.muted" size="sm" onClick={onDiscard}>Discard</Button>
          </HStack>
        </Box>
      )}
    </VStack>
  )
}
