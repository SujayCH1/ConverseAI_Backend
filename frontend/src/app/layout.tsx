
import { Plus_Jakarta_Sans } from "next/font/google"
import type React from "react"
import type { Metadata } from "next"
import {
  ClerkProvider
} from '@clerk/nextjs'
import { ThemeProvider } from "@/providers/theme-provider"
import { Toaster } from "sonner"
import Reactqueryprovider from "@/providers/react-query-provider"
import ReduxProvider from "@/providers/redux-provider"
import './globals.css'

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "XTR - Automate Instagram Chats",
  description: "XTR is an automation tool that allows you to chat with your followers on Instagram.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    //  to fix the next hydration issue due to clerk Providre => suppressHydrationWarning
    <ClerkProvider  > 
      <html lang="en" className="dark">
      <title>XTR-Automate Faster!</title>
      <head>
      <link rel="icon" href="/IG.png" type="image/png" />
      </head>
        <body suppressHydrationWarning className={`${jakarta.className} D bg-background text-foreground antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            <ReduxProvider>
              <Reactqueryprovider>
                {children}
              </Reactqueryprovider>
            </ReduxProvider>
            <Toaster />
          </ThemeProvider>

        </body>
      </html> 
    </ClerkProvider>
  )
}


