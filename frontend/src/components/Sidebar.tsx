"use client"
import React from 'react'
import Link from 'next/link'

export default function Sidebar(){
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 min-h-screen hidden md:block">
      <nav className="p-4">
        <ul className="space-y-2 text-sm">
          <li><Link href="/dashboard" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Dashboard</Link></li>
          <li><Link href="/admin" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">CMS Home</Link></li>
          <li><Link href="/admin/roles" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Roles</Link></li>
          <li><Link href="/admin/permissions" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Permissions</Link></li>
          <li><Link href="/media" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Media</Link></li>
          <li><Link href="/news" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">News</Link></li>
          <li><Link href="/users" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Users</Link></li>
        </ul>
      </nav>
    </aside>
  )
}
