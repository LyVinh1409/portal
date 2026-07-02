"use client"
import React, { useEffect, useState } from 'react'
import AdminLayout from '../../../components/AdminLayout'
import { Users } from '../../../lib/api'
import Link from 'next/link'

export default function UsersPage(){
  const [items, setItems] = useState<any[]>([])
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  useEffect(()=>{ load() }, [])
  async function load(){ const res = await Users.list(100, 0); setItems(res.data || []) }
  async function handleCreate(){ if(!form.email) return; setLoading(true); try{ await Users.create(form); setForm({ email: '', password: '' }); await load() }finally{ setLoading(false) } }
  async function handleDelete(id:number){ if(confirm('Delete?')){ await Users.delete(id); await load() } }
  return (
    <AdminLayout>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Người dùng</h1>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1 bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-4">Tạo người dùng</h3>
            <input type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="w-full border rounded px-3 py-2 mb-2" />
            <input type="password" placeholder="Mật khẩu" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="w-full border rounded px-3 py-2 mb-2" />
            <button onClick={handleCreate} disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700">Tạo</button>
          </div>
          <div className="col-span-2 bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-4">Danh sách</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Ngày tạo</th>
                    <th className="px-4 py-2 text-left">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((u:any)=>(
                    <tr key={u.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{u.email}</td>
                      <td className="px-4 py-2">{new Date(u.created_at).toLocaleDateString('vi-VN')}</td>
                      <td className="px-4 py-2 space-x-2">
                        <button onClick={()=>handleDelete(u.id)} className="text-red-600 hover:text-red-800">Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
