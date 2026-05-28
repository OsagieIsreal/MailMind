import { Box, Text } from '@chakra-ui/react'
const palette = ['#4f8ef7','#a78bfa','#f472b6','#34d399','#fbbf24','#fb923c']
export const Avatar = ({ name, size = 36 }: { name: string; size?: number }) => (
  <Box w={`${size}px`} h={`${size}px`} borderRadius="full" flexShrink={0}
    bg={palette[name.charCodeAt(0) % palette.length]}
    display="flex" alignItems="center" justifyContent="center">
    <Text fontFamily="mono" fontSize={`${size*0.35}px`} fontWeight="700" color="white">
      {name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
    </Text>
  </Box>
)
