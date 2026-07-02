"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import PublicLayout from '../../components/PublicLayout'

export default function LoginPage(){
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  async function handleLogin(e: React.FormEvent){
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Đăng nhập thất bại')
      }

      const data = await response.json()
      
      // Save tokens and user info
      localStorage.setItem('accessToken', data.access_token)
      localStorage.setItem('refreshToken', data.refresh_token)
      localStorage.setItem('user', JSON.stringify(data.user))

      // Redirect to admin dashboard
      router.push('/admin/news')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi đăng nhập')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e: React.FormEvent){
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Đăng ký thất bại')
      }

      // Auto login after registration
      await handleLogin(e)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi đăng ký')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">
              <h1 className="text-3xl font-bold text-white mb-2">CMS Platform</h1>
              <p className="text-blue-100">Đăng nhập hoặc tạo tài khoản</p>
            </div>

            {/* Form */}
            <div className="p-6 md:p-8">
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <span className="text-red-600 mt-0.5">⚠️</span>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 mb-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu"
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-600 hover:text-gray-900"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition shadow-lg hover:shadow-xl mt-6"
                >
                  {loading ? '⏳ Đang xử lý...' : '🔐 Đăng Nhập'}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-sm text-gray-500">hoặc</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              {/* Register Button */}
              <button
                onClick={handleRegister}
                disabled={loading || !email || !password}
                className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-50 font-semibold py-3 rounded-lg transition"
              >
                {loading ? '⏳ Đang xử lý...' : '✍️ Đăng Ký Tài Khoản Mới'}
              </button>

              {/* Info */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
                <p className="font-semibold mb-2">💡 Tài Khoản Test:</p>
                <p>Email: <code className="bg-white px-2 py-1 rounded">test@example.com</code></p>
                <p>Password: <code className="bg-white px-2 py-1 rounded">Test@123</code></p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 md:px-8 py-4 bg-gray-50 border-t border-gray-200 text-center text-sm text-gray-600">
              Quay lại <Link href="/" className="text-blue-600 hover:underline font-semibold">trang chủ</Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
