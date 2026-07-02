"use client"
import React from 'react'
import PublicLayout from '../components/PublicLayout'
import Link from 'next/link'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }){
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-6xl font-bold text-red-400 mb-4">500</h1>
        <h2 className="text-2xl font-semibold mb-4">Có lỗi xảy ra</h2>
        <p className="text-gray-600 mb-8">Xin lỗi, có vấn đề với máy chủ. Vui lòng thử lại sau.</p>
        <div className="flex gap-4 justify-center">
          <button onClick={reset} className="px-6 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700">Thử lại</button>
          <Link href="/" className="px-6 py-3 border border-blue-600 text-blue-600 rounded font-semibold hover:bg-blue-50">Trang chủ</Link>
        </div>
      </div>
    </PublicLayout>
  )
}
