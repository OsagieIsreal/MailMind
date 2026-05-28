import { Box, HStack, Text, Button, Progress } from '@chakra-ui/react'
import type { UsageInfo } from '@/types'
import { stripeApi } from '@/api/client'

interface UsageBannerProps { usage: UsageInfo; limitHit: boolean }

export const UsageBanner = ({ usage, limitHit }: UsageBannerProps) => {
  if (usage.tier === 'premium') return null

  const used = usage.used ?? 0
  const limit = usage.limit ?? 20
  const percent = Math.round((used / limit) * 100)
  const isWarning = percent >= 75

  const handleUpgrade = async () => {
    try {
      const { url } = await stripeApi.createCheckout()
      window.location.href = url
    } catch { alert('Could not open checkout. Please try again.') }
  }

  return (
    <Box
      px={6} py={2.5}
      bg={limitHit ? 'red.900' : isWarning ? 'orange.900' : 'bg.card'}
      borderBottom="1px solid"
      borderColor={limitHit ? 'red.700' : isWarning ? 'orange.700' : 'border.default'}
    >
      <HStack justify="space-between">
        <HStack spacing={4} flex={1}>
          <Text fontSize="11px" color="text.secondary" fontWeight="600" whiteSpace="nowrap">
            {limitHit ? '⛔ Daily limit reached' : `✦ Free — ${used}/${limit} requests today`}
          </Text>
          {!limitHit && (
            <Box flex={1} maxW="160px">
              <Progress
                value={percent} size="xs" borderRadius="full"
                colorScheme={isWarning ? 'orange' : 'blue'} bg="border.default"
              />
            </Box>
          )}
          {(isWarning || limitHit) && (
            <Text fontSize="11px" color={limitHit ? 'red.300' : 'orange.300'}>
              {limitHit ? 'Resets tomorrow' : `${limit - used} left`}
            </Text>
          )}
        </HStack>
        <Button size="xs" onClick={handleUpgrade}
          bg="accent.default" color="white" _hover={{ opacity: 0.85 }}>
          ⭐ Upgrade to Premium — $7/mo
        </Button>
      </HStack>
    </Box>
  )
}
