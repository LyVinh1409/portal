"use client"
import React from 'react'
import DarkToggle from './DarkToggle'

export default function Header(){
  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 shadow">
      <div className="flex items-center gap-3">
        <div className="text-lg font-bold">CMS</div>
      </div>
      <div className="flex items-center gap-3">
        <DarkToggle />
      </div>
    </header>
  )
}
