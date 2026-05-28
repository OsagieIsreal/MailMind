import { Box, VStack, HStack, Text, Input, InputGroup, InputLeftElement, Button, Flex, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import { SearchIcon, ChevronDownIcon } from '@chakra-ui/icons'
import type { Filter, InboxStats, Email, User } from '@/types'
import { EmailListItem } from '@/components/email/EmailListItem'

interface Props {
  emails:Email[]; selectedId:string|null; filter:Filter; search:string
  stats:InboxStats; gmailConnected:boolean; gmailLoading:boolean; user:User|null
  onSelectEmail:(e:Email)=>void; onFilterChange:(f:Filter)=>void
  onSearchChange:(s:string)=>void; onConnectGmail:()=>void
  onToggleStar:(id:string)=>void; onArchive:(id:string)=>void
  onToggleTheme:()=>void; isDark:boolean; onLogout:()=>void
}

const FILTERS: {key:Filter;label:string;statKey:keyof InboxStats|null}[] = [
  {key:'inbox',label:'Inbox',statKey:null},{key:'unread',label:'Unread',statKey:'unread'},
  {key:'starred',label:'⭐ Starred',statKey:'starred'},{key:'priority',label:'⚑ Priority',statKey:'urgent'},
]

export const Sidebar = ({ emails,selectedId,filter,search,stats,gmailConnected,gmailLoading,user,
  onSelectEmail,onFilterChange,onSearchChange,onConnectGmail,onToggleStar,onArchive,onToggleTheme,isDark,onLogout }: Props) => (
  <Box w="280px" flexShrink={0} bg="bg.surface" borderRight="1px solid" borderColor="border.default" display="flex" flexDirection="column" h="100vh">
    <HStack px={5} py={4} borderBottom="1px solid" borderColor="border.default" justify="space-between">
      <Box>
        <Text fontFamily="heading" fontSize="20px" fontWeight="700" letterSpacing="-0.02em">✦ MailMind</Text>
        <Text fontSize="11px" color="text.secondary" mt={0.5}>AI Email Assistant</Text>
      </Box>
      <HStack spacing={1}>
        <Button variant="outline" size="xs" onClick={onToggleTheme} borderColor="border.default">{isDark?'☀️':'🌙'}</Button>
        {user && (
          <Menu>
            <MenuButton as={Button} variant="ghost" size="xs" rightIcon={<ChevronDownIcon/>}>
              <Text fontSize="11px" maxW="60px" noOfLines={1}>{user.name.split(' ')[0]}</Text>
            </MenuButton>
            <MenuList bg="bg.card" borderColor="border.default" fontSize="12px">
              <MenuItem bg="transparent" _hover={{bg:'bg.cardHover'}} isDisabled>
                {user.tier==='premium'?'⭐ Premium':'✦ Free plan'}
              </MenuItem>
              <MenuItem bg="transparent" _hover={{bg:'bg.cardHover'}} onClick={onLogout} color="red.400">Sign out</MenuItem>
            </MenuList>
          </Menu>
        )}
      </HStack>
    </HStack>
    <Box px={4} py={3} borderBottom="1px solid" borderColor="border.default">
      {gmailConnected
        ? <HStack spacing={2}><Box w="7px" h="7px" borderRadius="full" bg="green.400"/><Text fontSize="12px" color="green.400" fontWeight="600">Gmail Connected</Text></HStack>
        : <Button w="100%" size="sm" bg="accent.default" color="white" isLoading={gmailLoading} loadingText="Connecting…" onClick={onConnectGmail} _hover={{opacity:.85}}>Connect Gmail →</Button>
      }
    </Box>
    <Box px={3.5} py={2.5} borderBottom="1px solid" borderColor="border.default">
      <InputGroup size="sm">
        <InputLeftElement pointerEvents="none"><SearchIcon color="text.muted"/></InputLeftElement>
        <Input value={search} onChange={e=>onSearchChange(e.target.value)} placeholder="Search emails…"
          bg="bg.card" border="1px solid" borderColor="border.default" borderRadius="8px"
          fontSize="12px" _placeholder={{color:'text.muted'}} _focus={{borderColor:'accent.default',boxShadow:'none'}}/>
      </InputGroup>
    </Box>
    <VStack spacing={1} px={2.5} py={2} borderBottom="1px solid" borderColor="border.default" align="stretch">
      {FILTERS.map(({key,label,statKey})=>{
        const count = statKey ? stats[statKey] : null
        const isActive = filter===key
        return (
          <Flex key={key} as="button" align="center" justify="space-between" w="100%" px={2.5} py={2}
            borderRadius="7px" bg={isActive?'accent.dim':'transparent'} color={isActive?'accent.default':'text.secondary'}
            fontWeight={isActive?600:400} fontSize="12px" cursor="pointer" onClick={()=>onFilterChange(key)}
            _hover={{color:'text.primary'}} transition="all 0.15s">
            <Text>{label}</Text>
            {count!==null&&count>0&&<Box bg={isActive?'accent.default':'border.default'} color={isActive?'white':'text.secondary'} borderRadius="10px" px={1.5} fontSize="10px" fontWeight="700">{count}</Box>}
          </Flex>
        )
      })}
    </VStack>
    <Box flex={1} overflowY="auto">
      {emails.length===0
        ? <Text px={4} py={6} fontSize="12px" color="text.muted" textAlign="center">No emails found</Text>
        : emails.map(email=><EmailListItem key={email.id} email={email} isSelected={email.id===selectedId} onSelect={()=>onSelectEmail(email)}/>)
      }
    </Box>
  </Box>
)
