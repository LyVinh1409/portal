"use client"
import React from 'react'
import PublicLayout from '../components/PublicLayout'
import Link from 'next/link'

export default function NotFound(){
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Trang không tìm thấy</h2>
        <p className="text-gray-600 mb-8">Trang bạn tìm không tồn tại hoặc đã bị xóa.</p>
        <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700">Quay lại trang chủ</Link>
      </div>
    </PublicLayout>
  )
}
