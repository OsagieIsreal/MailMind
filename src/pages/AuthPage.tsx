import { useState } from 'react'
import {
  Box, Flex, VStack, HStack, Text, Input, Button,
  FormControl, FormLabel, FormErrorMessage,
  Tabs, Tab, TabList, TabPanels, TabPanel, Divider,
} from '@chakra-ui/react'

interface AuthPageProps {
  onLogin: (email: string, password: string) => Promise<void>
  onRegister: (email: string, password: string, name: string) => Promise<void>
  onGoogleLogin: () => Promise<void>
  isLoading: boolean
}

export const AuthPage = ({ onLogin, onRegister, onGoogleLogin, isLoading }: AuthPageProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handle = (fn: () => Promise<void>) => async () => {
    setError('')
    try { await fn() }
    catch (e: any) { setError(e.error || e.message || 'Something went wrong') }
  }

  return (
    <Flex minH="100vh" bg="bg.canvas" align="center" justify="center" p={4}>
      <Box w="100%" maxW="420px">

        {/* Logo + tier badges */}
        <VStack spacing={1} mb={8} textAlign="center">
          <Text fontFamily="heading" fontSize="38px" fontWeight="700" letterSpacing="-0.02em">
            ✦ MailMind
          </Text>
          <Text fontSize="14px" color="text.secondary">AI-powered email assistant</Text>
          <HStack spacing={2} mt={3}>
            <Box bg="green.900" border="1px solid" borderColor="green.700" borderRadius="6px" px={3} py={1}>
              <Text fontSize="11px" color="green.300" fontWeight="700">✦ Free — Gemini AI · 20 req/day</Text>
            </Box>
            <Box bg="accent.dim" border="1px solid" borderColor="accent.default" borderRadius="6px" px={3} py={1}>
              <Text fontSize="11px" color="accent.default" fontWeight="700">⭐ Premium — Claude AI · $7/mo</Text>
            </Box>
          </HStack>
        </VStack>

        {/* Auth card */}
        <Box bg="bg.surface" border="1px solid" borderColor="border.default" borderRadius="16px" p={8}>

          {/* Google sign-in button */}
          <Button
            w="100%" mb={5} variant="outline" borderColor="border.default"
            color="text.primary" isLoading={isLoading}
            onClick={handle(onGoogleLogin)}
            _hover={{ bg: 'bg.cardHover' }}
            leftIcon={
              <Box as="span" fontSize="16px">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </Box>
            }
          >
            Continue with Google
          </Button>

          <HStack mb={5}>
            <Divider borderColor="border.default"/>
            <Text fontSize="11px" color="text.muted" whiteSpace="nowrap" px={2}>or use email</Text>
            <Divider borderColor="border.default"/>
          </HStack>

          <Tabs colorScheme="blue" variant="soft-rounded">
            <TabList mb={5}>
              <Tab flex={1} fontSize="12px" fontWeight="600">Sign In</Tab>
              <Tab flex={1} fontSize="12px" fontWeight="600">Create Account</Tab>
            </TabList>
            <TabPanels>

              {/* Login */}
              <TabPanel p={0}>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel fontSize="12px" fontWeight="600" color="text.secondary">Email</FormLabel>
                    <Input value={email} onChange={e => setEmail(e.target.value)} type="email"
                      placeholder="you@example.com" bg="bg.card" border="1px solid"
                      borderColor="border.default" _focus={{ borderColor: 'accent.default', boxShadow: 'none' }}/>
                  </FormControl>
                  <FormControl isInvalid={!!error}>
                    <FormLabel fontSize="12px" fontWeight="600" color="text.secondary">Password</FormLabel>
                    <Input value={password} onChange={e => setPassword(e.target.value)} type="password"
                      placeholder="••••••••" bg="bg.card" border="1px solid"
                      borderColor="border.default" _focus={{ borderColor: 'accent.default', boxShadow: 'none' }}
                      onKeyDown={e => e.key === 'Enter' && handle(() => onLogin(email, password))()}/>
                    {error && <FormErrorMessage fontSize="12px">{error}</FormErrorMessage>}
                  </FormControl>
                  <Button w="100%" bg="accent.default" color="white" isLoading={isLoading}
                    onClick={handle(() => onLogin(email, password))} _hover={{ opacity: 0.85 }} mt={1}>
                    Sign In
                  </Button>
                </VStack>
              </TabPanel>

              {/* Register */}
              <TabPanel p={0}>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel fontSize="12px" fontWeight="600" color="text.secondary">Full Name</FormLabel>
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
                      bg="bg.card" border="1px solid" borderColor="border.default"
                      _focus={{ borderColor: 'accent.default', boxShadow: 'none' }}/>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="12px" fontWeight="600" color="text.secondary">Email</FormLabel>
                    <Input value={email} onChange={e => setEmail(e.target.value)} type="email"
                      placeholder="you@example.com" bg="bg.card" border="1px solid"
                      borderColor="border.default" _focus={{ borderColor: 'accent.default', boxShadow: 'none' }}/>
                  </FormControl>
                  <FormControl isInvalid={!!error}>
                    <FormLabel fontSize="12px" fontWeight="600" color="text.secondary">Password</FormLabel>
                    <Input value={password} onChange={e => setPassword(e.target.value)} type="password"
                      placeholder="••••••••" bg="bg.card" border="1px solid"
                      borderColor="border.default" _focus={{ borderColor: 'accent.default', boxShadow: 'none' }}/>
                    {error && <FormErrorMessage fontSize="12px">{error}</FormErrorMessage>}
                  </FormControl>
                  <Button w="100%" bg="accent.default" color="white" isLoading={isLoading}
                    onClick={handle(() => onRegister(email, password, name))} _hover={{ opacity: 0.85 }} mt={1}>
                    Create Free Account
                  </Button>
                  <Text fontSize="11px" color="text.muted" textAlign="center">
                    Free plan · Gemini AI · 20 requests/day
                  </Text>
                </VStack>
              </TabPanel>

            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </Flex>
  )
}
