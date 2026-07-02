"use client"
import React, { useState } from 'react'

type Props = { initial?: { email?: string }, onSubmit: (v: { email: string, password?: string }) => Promise<void>, submitLabel?: string }

export default function UserForm({ initial, onSubmit, submitLabel = 'Save' }: Props){
  const [email, setEmail] = useState(initial?.email || '')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handle(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!email) { setError('Email is required'); return }
    setLoading(true)
    try {
      await onSubmit({ email, password: password || undefined })
    } catch (err: any) {
      setError(err?.message || 'Error')
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={handle} className="max-w-lg">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} type="email" className="w-full border px-3 py-2 rounded" required />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Password</label>
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="w-full border px-3 py-2 rounded" placeholder="leave empty to keep" />
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>{submitLabel}</button>
      </div>
    </form>
  )
}
