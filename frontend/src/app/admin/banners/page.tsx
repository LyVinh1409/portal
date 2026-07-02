"use client"
import React, { useEffect, useState } from 'react'
import AdminLayout from '../../../components/AdminLayout'
import { BannersAPI } from '../../../lib/api'
import Link from 'next/link'

export default function BannersPage(){
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  useEffect(()=>{ load() }, [])
  async function load(){ setLoading(true); try{ const res = await BannersAPI.list(100, 0); setItems(res.data || []) }finally{ setLoading(false) } }
  async function handleDelete(id:number){ if(confirm('Delete?')){ await BannersAPI.delete(id); await load() } }
  return (
    <AdminLayout>
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Banner</h1>
          <Link href="/admin/banners/new" className="px-4 py-2 bg-blue-600 text-white rounded font-semibold">Tạo mới</Link>
        </div>
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Tiêu đề</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Vị trí</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Trạng thái</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {items.map((b:any)=>(
                <tr key={b.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm">{b.title}</td>
                  <td className="px-6 py-3 text-sm">{b.position}</td>
                  <td className="px-6 py-3 text-sm">{b.is_active ? 'Kích hoạt' : 'Tắt'}</td>
                  <td className="px-6 py-3 text-sm space-x-2">
                    <Link href={`/admin/banners/${b.id}`} className="text-blue-600 hover:underline">Sửa</Link>
                    <button onClick={()=>handleDelete(b.id)} className="text-red-600 hover:underline">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
