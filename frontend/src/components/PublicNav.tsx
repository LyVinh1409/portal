"use client"
import React from 'react'
import Link from 'next/link'

export default function PublicNav(){
  return (
    <nav className="bg-white shadow sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">Website</Link>
        <ul className="flex gap-6 text-sm md:text-base">
          <li><Link href="/">Trang chủ</Link></li>
          <li><Link href="/news">Tin tức</Link></li>
          <li><Link href="/videos">Video</Link></li>
          <li><Link href="/album">Album</Link></li>
          <li><Link href="/contact">Liên hệ</Link></li>
        </ul>
      </div>
    </nav>
  )
}
