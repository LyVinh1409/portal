"use client"
import React, { useEffect, useState } from 'react'
import AdminLayout from '../../../components/AdminLayout'
import { RolesAPI } from '../../../lib/rolesApi'

export default function RolesPage(){
  const [roles, setRoles] = useState<any[]>([])
  const [form, setForm] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(false)
  useEffect(()=>{ load() }, [])
  async function load(){ const res = await RolesAPI.list(); setRoles(res.data || res || []) }
  async function handleCreate(){ if(!form.name) return; setLoading(true); try{ await RolesAPI.create(form); setForm({ name: '', description: '' }); await load() }finally{ setLoading(false) } }
  async function handleDelete(id:number){ if(confirm('Delete role?')){ await RolesAPI.remove(id); await load() } }
  return (
    <AdminLayout>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Quản lý Roles</h1>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1 bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-4">Tạo Role</h3>
            <input type="text" placeholder="Tên role" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full border rounded px-3 py-2 mb-2" />
            <input type="text" placeholder="Mô tả" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full border rounded px-3 py-2 mb-2" />
            <button onClick={handleCreate} disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700">Tạo</button>
          </div>
          <div className="col-span-2 bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-4">Danh sách Roles</h3>
            <div className="space-y-2">
              {roles.map((r:any)=><div key={r.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <div className="font-semibold">{r.name}</div>
                  <div className="text-sm text-gray-600">{r.description}</div>
                </div>
                <button onClick={()=>handleDelete(r.id)} className="text-red-600 hover:text-red-800">Xóa</button>
              </div>)}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
