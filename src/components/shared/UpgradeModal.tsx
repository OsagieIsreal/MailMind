import {
  Modal, ModalOverlay, ModalContent, ModalBody,
  VStack, HStack, Text, Button, Box, List, ListItem, ListIcon,
} from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'
import { stripeApi } from '@/api/client'
import { useState } from 'react'

interface UpgradeModalProps { isOpen: boolean; onClose: () => void }

export const UpgradeModal = ({ isOpen, onClose }: UpgradeModalProps) => {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const { url } = await stripeApi.createCheckout()
      window.location.href = url
    } catch { alert('Could not open checkout. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
      <ModalContent bg="bg.surface" border="1px solid" borderColor="border.default" borderRadius="16px">
        <ModalBody p={8}>
          <VStack spacing={6}>
            <VStack spacing={1} textAlign="center">
              <Text fontSize="28px">⭐</Text>
              <Text fontFamily="heading" fontSize="22px" fontWeight="700">Upgrade to Premium</Text>
              <Text fontSize="13px" color="text.secondary">You have used your free daily limit.</Text>
            </VStack>

            {/* Comparison */}
            <HStack spacing={4} w="100%" align="flex-start">
              <Box flex={1} p={4} bg="bg.card" border="1px solid" borderColor="border.default" borderRadius="10px">
                <Text fontSize="12px" fontWeight="700" color="text.secondary" mb={3}>FREE</Text>
                <Text fontSize="20px" fontWeight="700" mb={3}>$0</Text>
                <List spacing={2}>
                  {['Gemini AI (fast)', '20 requests/day', 'Gmail integration', 'Basic summaries'].map(f => (
                    <ListItem key={f} fontSize="12px" color="text.secondary" display="flex" alignItems="center" gap={2}>
                      <CheckIcon color="green.400" boxSize={3} /> {f}
                    </ListItem>
                  ))}
                </List>
              </Box>
              <Box flex={1} p={4} bg="accent.dim" border="2px solid" borderColor="accent.default" borderRadius="10px" position="relative">
                <Box position="absolute" top="-10px" right="12px" bg="accent.default"
                  borderRadius="5px" px={2} py={0.5}>
                  <Text fontSize="9px" fontWeight="700" color="white">BEST</Text>
                </Box>
                <Text fontSize="12px" fontWeight="700" color="accent.default" mb={3}>PREMIUM</Text>
                <Text fontSize="20px" fontWeight="700" mb={3}>$7<Text as="span" fontSize="12px" fontWeight="400">/mo</Text></Text>
                <List spacing={2}>
                  {['Claude AI (smarter)', 'Unlimited requests', 'Priority support', 'Better summaries & replies'].map(f => (
                    <ListItem key={f} fontSize="12px" display="flex" alignItems="center" gap={2}>
                      <CheckIcon color="accent.default" boxSize={3} /> {f}
                    </ListItem>
                  ))}
                </List>
              </Box>
            </HStack>

            <VStack spacing={2} w="100%">
              <Button w="100%" bg="accent.default" color="white" isLoading={loading}
                onClick={handleUpgrade} _hover={{ opacity: 0.85 }} size="md">
                Start Premium — $7/month
              </Button>
              <Button w="100%" variant="ghost" color="text.muted" size="sm" onClick={onClose}>
                Continue on free plan
              </Button>
            </VStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
