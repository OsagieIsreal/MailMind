import { useState, useEffect } from 'react'
import { Box } from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import type { Email } from '@/types'
import type { UsageInfo } from '@/types'
import { aiApi } from '@/api/client'
import { EmailHeader } from './EmailHeader'
import { EmailSummary } from './EmailSummary'
import { EmailBody } from './EmailBody'
import { ReplyComposer } from '@/components/reply/ReplyComposer'
import { UpgradeModal } from '@/components/shared/UpgradeModal'
import { useReply } from '@/hooks/useReply'

const fadeUp = keyframes`from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}`

interface Props {
  email: Email; tier: string
  onToggleStar:(id:string)=>void; onArchive:(id:string)=>void
  onReplied:(id:string)=>void; onUsageUpdate:(u:UsageInfo)=>void
}

export const EmailDetail = ({ email, tier, onToggleStar, onArchive, onReplied, onUsageUpdate }: Props) => {
  const [summary, setSummary] = useState('')
  const [loadingSummary, setLoadingSummary] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const reply = useReply(onReplied, onUsageUpdate)

  useEffect(() => {
    setSummary(''); reply.reset(); setLoadingSummary(true)
    aiApi.summarise(email.from, email.subject, email.body)
      .then(res => { setSummary(res.summary); if(res.usage) onUsageUpdate(res.usage) })
      .catch(() => setSummary('Summary unavailable.'))
      .finally(() => setLoadingSummary(false))
  }, [email.id])

  const handleGenerate = async () => {
    if (reply.error === 'upgrade') { onOpen(); return }
    await reply.generate(email)
    if (reply.error === 'upgrade') onOpen()
  }

  return (
    <>
      <Box flex={1} overflowY="auto" px={9} py={7} animation={`${fadeUp} 0.25s ease`}>
        <EmailHeader email={email} onToggleStar={()=>onToggleStar(email.id)} onArchive={()=>onArchive(email.id)}/>
        <Box borderTop="1px solid" borderColor="border.default" mb={5}/>
        <EmailSummary summary={summary} loading={loadingSummary} tier={tier}/>
        <EmailBody body={email.body}/>
        {!email.replied && (
          <ReplyComposer replyState={reply.replyState} tone={reply.tone}
            editedDraft={reply.editedDraft} tier={tier}
            onToneChange={reply.setTone} onEditDraft={reply.setEditedDraft}
            onGenerate={handleGenerate} onSend={()=>reply.send(email.id)}
            onRegenerate={()=>reply.generate(email)} onDiscard={reply.reset}/>
        )}
        {email.replied && reply.replyState !== 'sent' && (
          <ReplyComposer replyState="sent" tone={reply.tone} editedDraft="" tier={tier}
            onToneChange={()=>{}} onEditDraft={()=>{}} onGenerate={()=>{}}
            onSend={()=>{}} onRegenerate={()=>{}} onDiscard={()=>{}}/>
        )}
      </Box>
      <UpgradeModal isOpen={isOpen} onClose={onClose}/>
    </>
  )
}
