"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '../../../../components/AdminLayout'
import { NewsAPI } from '../../../../lib/api'

export default function NewsCreatePage(){
  const router = useRouter()
  const [form, setForm] = useState({ title: '', slug: '', body: '', featured_image_url: '', tags: '', category_id: '', is_published: false })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(){
    setLoading(true)
    try {
      await NewsAPI.create({
        title: form.title,
        slug: form.slug,
        body: form.body,
        featured_image_url: form.featured_image_url,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        category_id: form.category_id ? Number(form.category_id) : undefined,
        is_published: form.is_published,
      })
      router.push('/admin/news')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Tạo tin tức</h1>
        <div className="grid gap-4 max-w-3xl">
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Tiêu đề" className="border rounded px-3 py-2" />
          <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="Slug" className="border rounded px-3 py-2" />
          <input value={form.featured_image_url} onChange={e => setForm({ ...form, featured_image_url: e.target.value })} placeholder="Featured image URL" className="border rounded px-3 py-2" />
          <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="Tags (comma separated)" className="border rounded px-3 py-2" />
          <input value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} placeholder="Category ID" className="border rounded px-3 py-2" />
          <textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} placeholder="Nội dung" className="border rounded px-3 py-2 min-h-[200px]" />
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} />
            Đã xuất bản
          </label>
          <button onClick={handleSubmit} disabled={loading} className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">
            {loading ? 'Đang lưu...' : 'Lưu tin tức'}
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}
