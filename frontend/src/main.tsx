import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@/providers/theme-provider'
import ReactQueryProvider from '@/providers/react-query-provider'
import ReduxProvider from '@/providers/redux-provider'
import { Toaster } from 'sonner'
import App from './app'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
        <ReduxProvider>
          <ReactQueryProvider><App /></ReactQueryProvider>
        </ReduxProvider>
        <Toaster />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
