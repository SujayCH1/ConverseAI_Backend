import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@/providers/theme-provider'
import ReactQueryProvider from '@/providers/react-query-provider'
import ReduxProvider from '@/providers/redux-provider'
import { Toaster } from 'sonner'
import App from './app'
import './index.css'

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!clerkKey) {
  throw new Error('VITE_CLERK_PUBLISHABLE_KEY is required')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkKey}>
      <BrowserRouter>
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <ReduxProvider>
            <ReactQueryProvider><App /></ReactQueryProvider>
          </ReduxProvider>
          <Toaster />
        </ThemeProvider>
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
)
