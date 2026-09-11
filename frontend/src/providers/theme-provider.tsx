import * as React from 'react'

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
}: {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: 'light' | 'dark'
  disableTransitionOnChange?: boolean
}) {
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', defaultTheme === 'dark')
  }, [defaultTheme])

  return <>{children}</>
}
