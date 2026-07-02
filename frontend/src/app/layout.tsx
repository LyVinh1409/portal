import './globals.css'
import React from 'react'
import ThemeProvider from '../components/ThemeProvider'

export const metadata = {
  title: 'App',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}
