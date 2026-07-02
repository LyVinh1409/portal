"use client"
import React from 'react'
import PublicNav from './PublicNav'

export default function PublicLayout({ children }:{ children: React.ReactNode }){
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <main className="flex-1">{children}</main>
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>&copy; 2026 Website. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
