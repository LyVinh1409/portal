"use client"
import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import ThemeProvider from './ThemeProvider'

export default function AdminLayout({ children }:{ children: React.ReactNode }){
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-4">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  )
}
