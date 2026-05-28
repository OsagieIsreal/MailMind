import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = { initialColorMode: 'dark', useSystemColorMode: false }

export const chakraTheme = extendTheme({
  config,
  fonts: {
    heading: `'Playfair Display', serif`,
    body: `'Outfit', sans-serif`,
    mono: `'DM Mono', monospace`,
  },
  semanticTokens: {
    colors: {
      'bg.canvas':   { default: '#f0f4fc', _dark: '#080c14' },
      'bg.surface':  { default: '#ffffff', _dark: '#0e1420' },
      'bg.card':     { default: '#ffffff', _dark: '#131a28' },
      'bg.cardHover':{ default: '#f5f8ff', _dark: '#18202f' },
      'bg.stat':     { default: '#f8fafc', _dark: '#0d1422' },
      'border.default': { default: '#dce4f0', _dark: '#1c2538' },
      'text.primary':   { default: '#0f172a', _dark: '#dde4f0' },
      'text.secondary': { default: '#475569', _dark: '#7b8fae' },
      'text.muted':     { default: '#94a3b8', _dark: '#3d4f6a' },
      'accent.default': { default: '#2563eb', _dark: '#4f8ef7' },
      'accent.dim':     { default: '#dbeafe', _dark: '#1a2f5c' },
    },
  },
  styles: {
    global: {
      body: { bg: 'bg.canvas', color: 'text.primary', fontFamily: 'body' },
      '::-webkit-scrollbar': { width: '3px' },
      '::-webkit-scrollbar-thumb': { background: 'border.default', borderRadius: '4px' },
    },
  },
  components: {
    Button: { baseStyle: { fontFamily: 'body', fontWeight: 600, borderRadius: '8px' } },
  },
})
