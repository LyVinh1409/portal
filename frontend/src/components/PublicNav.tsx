"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function PublicNav(){
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setIsLoggedIn(true)
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUser(null)
    setShowMenu(false)
    router.push('/')
  }

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">CMS</Link>
        
        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-8 text-sm font-medium">
          <li><Link href="/" className="hover:text-blue-600 transition">Trang chủ</Link></li>
          <li><Link href="/news" className="hover:text-blue-600 transition">Tin tức</Link></li>
          <li><Link href="/videos" className="hover:text-blue-600 transition">Video</Link></li>
          <li><Link href="/album" className="hover:text-blue-600 transition">Album</Link></li>
          <li><Link href="/contact" className="hover:text-blue-600 transition">Liên hệ</Link></li>
        </ul>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {isLoggedIn && user ? (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium"
              >
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </span>
                <span className="hidden sm:inline">{user.email}</span>
                <svg className={`w-4 h-4 transition ${showMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                  <div className="p-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">{user.email}</p>
                  </div>
                  <Link
                    href="/admin/news"
                    className="block px-4 py-2 text-sm hover:bg-blue-50 text-gray-700 transition"
                    onClick={() => setShowMenu(false)}
                  >
                    📰 Quản lý tin bài
                  </Link>
                  <Link
                    href="/admin/users"
                    className="block px-4 py-2 text-sm hover:bg-blue-50 text-gray-700 transition"
                    onClick={() => setShowMenu(false)}
                  >
                    👥 Quản lý người dùng
                  </Link>
                  <Link
                    href="/admin/dashboard"
                    className="block px-4 py-2 text-sm hover:bg-blue-50 text-gray-700 transition"
                    onClick={() => setShowMenu(false)}
                  >
                    📊 Dashboard
                  </Link>
                  <div className="border-t border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition font-medium"
                    >
                      🚪 Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-md hover:shadow-lg"
            >
              Đăng Nhập
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
