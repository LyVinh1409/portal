"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '../../../../components/AdminLayout'
import { NewsAPI } from '../../../../lib/api'

export default function NewsCreatePage(){
  const router = useRouter()
  const [form, setForm] = useState({ 
    title: '', 
    slug: '', 
    excerpt: '',
    body: '', 
    seo_title: '',
    seo_description: '',
    featured_key: '',
    tag_ids: [] as number[]
  })
  const [loading, setLoading] = useState(false)
  const [tagInput, setTagInput] = useState('')

  async function handleSubmit(){
    if(!form.title.trim()) {
      alert('Vui lòng nhập tiêu đề')
      return
    }
    if(!form.body.trim()) {
      alert('Vui lòng nhập nội dung')
      return
    }

    setLoading(true)
    try {
      await NewsAPI.create({
        title: form.title,
        slug: form.slug || form.title.toLowerCase().replace(/\s+/g, '-'),
        excerpt: form.excerpt,
        body: form.body,
        seo_title: form.seo_title,
        seo_description: form.seo_description,
        featured_key: form.featured_key || undefined,
        tag_ids: form.tag_ids,
      })
      alert('Đăng bài thành công!')
      router.push('/admin/news')
    } catch(err) {
      alert('Lỗi: ' + (err instanceof Error ? err.message : 'Không xác định'))
    } finally {
      setLoading(false)
    }
  }

  const handleAddTag = () => {
    if(tagInput.trim() && form.tag_ids.length < 5) {
      setForm({ ...form, tag_ids: [...form.tag_ids, Date.now()] })
      setTagInput('')
    }
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Đăng Bài Viết Mới</h1>
          <p className="text-gray-600 mt-2">Chia sẻ nội dung của bạn với cộng đồng</p>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tiêu Đề *</label>
              <input 
                value={form.title} 
                onChange={e => setForm({ ...form, title: e.target.value })} 
                placeholder="Nhập tiêu đề bài viết" 
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-lg font-medium" 
              />
              {form.title && (
                <p className="text-sm text-gray-500 mt-2">
                  Slug: <span className="font-mono text-blue-600">{form.slug || form.title.toLowerCase().replace(/\s+/g, '-')}</span>
                </p>
              )}
            </div>

            {/* Excerpt Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mô Tả Ngắn</label>
              <textarea 
                value={form.excerpt} 
                onChange={e => setForm({ ...form, excerpt: e.target.value })} 
                placeholder="Nhập mô tả ngắn (tối đa 200 ký tự)" 
                maxLength={200}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[100px] resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">{form.excerpt.length}/200 ký tự</p>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Hình Ảnh Đại Diện</label>
              <input 
                value={form.featured_key} 
                onChange={e => setForm({ ...form, featured_key: e.target.value })} 
                placeholder="Nhập URL hình ảnh" 
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
              />
              {form.featured_key && (
                <div className="mt-4 rounded-lg overflow-hidden border border-gray-200">
                  <img src={form.featured_key} alt="Preview" className="w-full h-40 object-cover" onError={(e)=>e.currentTarget.src='https://via.placeholder.com/400x300?text=Invalid+Image'} />
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nội Dung *</label>
              <div className="mb-4 flex gap-2 border-b border-gray-200 pb-4">
                <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium" type="button">
                  <strong>B</strong>
                </button>
                <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium italic" type="button">
                  I
                </button>
                <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium underline" type="button">
                  U
                </button>
              </div>
              <textarea 
                value={form.body} 
                onChange={e => setForm({ ...form, body: e.target.value })} 
                placeholder="Nhập nội dung bài viết..." 
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[400px] font-mono text-sm resize-vertical"
              />
              <p className="text-xs text-gray-500 mt-2">{form.body.length} ký tự</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Cài Đặt Xuất Bản</h3>
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition mb-3"
              >
                {loading ? '⏳ Đang lưu...' : '✓ Đăng Bài'}
              </button>
              <button 
                onClick={() => router.back()}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-lg transition"
              >
                Quay Lại
              </button>
            </div>

            {/* SEO Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">SEO</h3>
              <div className="space-y-3">
                <input 
                  value={form.seo_title} 
                  onChange={e => setForm({ ...form, seo_title: e.target.value })} 
                  placeholder="Tiêu đề SEO" 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea 
                  value={form.seo_description} 
                  onChange={e => setForm({ ...form, seo_description: e.target.value })} 
                  placeholder="Mô tả SEO" 
                  maxLength={160}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500">{form.seo_description.length}/160</p>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex gap-2 mb-3">
                <input 
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleAddTag()}
                  placeholder="Nhập tag..." 
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  onClick={handleAddTag}
                  className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg text-sm font-medium"
                >
                  Thêm
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.tag_ids.map((tag, idx) => (
                  <span key={tag} className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                    Tag {idx + 1}
                    <button 
                      onClick={() => setForm({ ...form, tag_ids: form.tag_ids.filter(t => t !== tag) })}
                      className="hover:text-blue-800 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900">
                <strong>💡 Mẹo:</strong> Sử dụng tiêu đề hấp dẫn, mô tả chi tiết và hình ảnh chất lượng để tăng lượt xem.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
