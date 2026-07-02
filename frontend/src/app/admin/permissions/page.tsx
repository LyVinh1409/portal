"use client"
import React, { useEffect, useState } from 'react'
import AdminLayout from '../../../components/AdminLayout'
import { RolesAPI } from '../../../lib/rolesApi'

export default function PermissionsPage(){
  const [permissions, setPermissions] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])
  const [form, setForm] = useState({ name: '', description: '' })
  const [selectedRole, setSelectedRole] = useState<number | null>(null)
  const [rolePerms, setRolePerms] = useState<any[]>([])
  useEffect(()=>{ loadPerms(); loadRoles() }, [])
  async function loadPerms(){ const res = await RolesAPI.listPerms(); setPermissions(res.data || res || []) }
  async function loadRoles(){ const res = await RolesAPI.list(); setRoles(res.data || res || []) }
  async function handleCreatePerm(){ if(!form.name) return; await RolesAPI.createPerm(form); setForm({ name: '', description: '' }); await loadPerms() }
  async function handleSelectRole(roleId:number){ setSelectedRole(roleId) }
  async function handleAssignPerm(permId:number){ if(selectedRole) await RolesAPI.assignPerm(selectedRole, permId) }
  async function handleRevokePerm(permId:number){ if(selectedRole) await RolesAPI.revokePerm(selectedRole, permId) }
  return (
    <AdminLayout>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Quản lý Permissions</h1>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1 bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-4">Tạo Permission</h3>
            <input type="text" placeholder="Tên permission" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full border rounded px-3 py-2 mb-2" />
            <input type="text" placeholder="Mô tả" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full border rounded px-3 py-2 mb-2" />
            <button onClick={handleCreatePerm} className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700">Tạo</button>
          </div>
          <div className="col-span-2 bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-4">Danh sách Permissions</h3>
            <div className="space-y-2">
              {permissions.map((p:any)=><div key={p.id} className="p-2 border rounded">
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-gray-600">{p.description}</div>
              </div>)}
            </div>
          </div>
        </div>
        <div className="mt-6 bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-4">Gán Permissions cho Role</h3>
          <select value={selectedRole || ''} onChange={e=>handleSelectRole(parseInt(e.target.value))} className="border rounded px-3 py-2 mb-4">
            <option value="">Chọn Role</option>
            {roles.map((r:any)=><option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          {selectedRole && <div className="grid grid-cols-2 gap-4">
            {permissions.map((p:any)=><button key={p.id} onClick={()=>handleAssignPerm(p.id)} className="p-2 border rounded hover:bg-blue-50">{p.name}</button>)}
          </div>}
        </div>
      </div>
    </AdminLayout>
  )
}
