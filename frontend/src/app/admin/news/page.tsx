"use client"
import React, { useState } from 'react'
import AdminLayout from '../../../components/AdminLayout'
import Link from 'next/link'
import { NewsAPI } from '../../../lib/api'

interface NewsItem {
  id: number
  title: string
  status: string
  author?: { full_name: string }
  created_at: string
  published_at?: string
  view_count?: number
}

export default function NewsManagementPage(){
  const [items, setItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all') // all, draft, pending, approved, published
  const [searchTerm, setSearchTerm] = useState('')
  
  React.useEffect(()=>{ load() }, [filter])
  
  async function load(){
    setLoading(true)
    try{
      const res = await NewsAPI.list(100, 0)
      let data = res.data || []
      if(filter !== 'all'){
        data = data.filter((n: NewsItem) => n.status === filter)
      }
      if(searchTerm){
        data = data.filter((n: NewsItem) => n.title.toLowerCase().includes(searchTerm.toLowerCase()))
      }
      setItems(data)
    }finally{ setLoading(false) }
  }
  
  async function handleDelete(id: number){
    if(confirm('Xóa bài viết này?')){
      await NewsAPI.delete(id)
      await load()
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800',
      pending_review: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      published: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800'
    }
    const labels = {
      draft: 'Bản nháp',
      pending_review: 'Chờ duyệt',
      approved: 'Đã duyệt',
      published: 'Đã xuất bản',
      rejected: 'Từ chối'
    }
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles] || ''}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    )
  }

  return (
    <AdminLayout>
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Quản lý Tin Tức</h1>
            <p className="text-gray-600 mt-2">Tổng cộng {items.length} bài viết</p>
          </div>
          <Link href="/admin/news/new" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
            + Tạo Bài Viết Mới
          </Link>
        </div>

        {/* Search & Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); load() }}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả</option>
            <option value="draft">Bản nháp</option>
            <option value="pending_review">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="published">Đã xuất bản</option>
            <option value="rejected">Từ chối</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {items.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>Không có bài viết nào</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tiêu Đề</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Trạng Thái</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tác Giả</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Lượt Xem</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ngày Tạo</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((n: NewsItem)=>(
                  <tr key={n.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 truncate max-w-xs">{n.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(n.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {n.author?.full_name || 'Không xác định'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {n.view_count || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(n.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <Link href={`/admin/news/${n.id}`} className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                          Sửa
                        </Link>
                        {n.status === 'pending_review' && (
                          <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                            Duyệt
                          </button>
                        )}
                        <button onClick={()=>handleDelete(n.id)} className="text-red-600 hover:text-red-700 font-medium text-sm">
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
