"use client"
import React from 'react'
import { useTheme } from './ThemeProvider'

export default function DarkToggle(){
  const { dark, toggle } = useTheme()
  return (
    <button onClick={toggle} className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800">
      {dark ? 'Light' : 'Dark'}
    </button>
  )
}
