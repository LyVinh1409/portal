"use client"
import React, { useEffect, useState } from 'react'
import AdminLayout from '../../../components/AdminLayout'
import { Categories } from '../../../lib/api'
import Link from 'next/link'

type CategoryFormState = {
  name: string
  slug: string
  parent_id?: number | null
}

export default function CategoriesPage(){
  const [items, setItems] = useState<any[]>([])
  const [form, setForm] = useState<CategoryFormState>({ name: '', slug: '', parent_id: null })
  const [loading, setLoading] = useState(false)
  useEffect(()=>{ load() }, [])
  async function load(){ const res = await Categories.list(100, 0); setItems(res.data || []) }
  async function handleCreate(){ if(!form.name) return; setLoading(true); try{ await Categories.create(form); setForm({ name: '', slug: '', parent_id: null }); await load() }finally{ setLoading(false) } }
  async function handleDelete(id:number){ if(confirm('Delete?')){ await Categories.remove(id); await load() } }
  return (
    <AdminLayout>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Danh mục</h1>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1 bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-4">Tạo danh mục</h3>
            <input type="text" placeholder="Tên" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full border rounded px-3 py-2 mb-2" />
            <input type="text" placeholder="Slug" value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})} className="w-full border rounded px-3 py-2 mb-2" />
            <button onClick={handleCreate} disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700">Tạo</button>
          </div>
          <div className="col-span-2 bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-4">Danh sách</h3>
            <div className="space-y-2">
              {items.map((c:any)=>(
                <div key={c.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-sm text-gray-600">{c.slug}</div>
                  </div>
                  <button onClick={()=>handleDelete(c.id)} className="text-red-600 hover:text-red-800">Xóa</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
