"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '../../../../components/AdminLayout'
import { BannersAPI } from '../../../../lib/api'

export default function BannerCreatePage(){
  const router = useRouter()
  const [form, setForm] = useState({ title: '', image_url: '', position: '', is_active: false })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(){
    setLoading(true)
    try {
      await BannersAPI.create({
        title: form.title,
        image_url: form.image_url,
        position: form.position,
        is_active: form.is_active,
      })
      router.push('/admin/banners')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Tạo banner</h1>
        <div className="grid gap-4 max-w-3xl">
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Tiêu đề" className="border rounded px-3 py-2" />
          <input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="Image URL" className="border rounded px-3 py-2" />
          <input value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} placeholder="Position" className="border rounded px-3 py-2" />
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
            Kích hoạt
          </label>
          <button onClick={handleSubmit} disabled={loading} className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">
            {loading ? 'Đang lưu...' : 'Lưu banner'}
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}
