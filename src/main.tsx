import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { chakraTheme } from '@/theme'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={chakraTheme.config.initialColorMode}/>
    <ChakraProvider theme={chakraTheme}>
      <App/>
    </ChakraProvider>
  </React.StrictMode>,
)
