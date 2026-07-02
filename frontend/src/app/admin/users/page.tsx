"use client"
import React, { useState, useEffect } from 'react'
import AdminLayout from '../../../components/AdminLayout'
import Link from 'next/link'

interface User {
  id: number
  email: string
  full_name: string
  status: string
  two_fa_enabled: boolean
  roles?: any[]
  last_login?: string
  created_at: string
}

export default function UsersManagementPage(){
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(()=>{ loadUsers() }, [])

  async function loadUsers(){
    setLoading(true)
    try{
      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      })
      if(res.ok){
        const data = await res.json()
        setUsers(data.data || [])
      }
    }catch(err){
      console.error('Lỗi tải người dùng:', err)
    }finally{
      setLoading(false)
    }
  }

  async function handleDeleteUser(id: number){
    if(confirm('Xóa người dùng này?')){
      try{
        const res = await fetch(`/api/admin/users/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        })
        if(res.ok){
          await loadUsers()
        }
      }catch(err){
        alert('Lỗi khi xóa người dùng')
      }
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-yellow-100 text-yellow-800',
      banned: 'bg-red-100 text-red-800'
    }
    const labels = { active: 'Hoạt động', suspended: 'Tạm khóa', banned: 'Cấm' }
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles] || ''}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    )
  }

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Quản lý Người Dùng</h1>
            <p className="text-gray-600 mt-2">Tổng cộng {users.length} người dùng</p>
          </div>
          <Link href="/admin/users/new" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
            + Thêm Người Dùng
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm theo email hoặc tên..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Đang tải...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Không tìm thấy người dùng</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tên Người Dùng</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Vai Trò</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Trạng Thái</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">2FA</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Đăng Nhập Cuối</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((u: User)=>(
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{u.full_name || 'Không có tên'}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-1 flex-wrap">
                        {u.roles?.map(r => (
                          <span key={r.id} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            {r.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(u.status)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {u.two_fa_enabled ? (
                        <span className="text-green-600 font-medium">✓ Bật</span>
                      ) : (
                        <span className="text-gray-500">Tắt</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {u.last_login ? new Date(u.last_login).toLocaleDateString('vi-VN') : 'Chưa đăng nhập'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <Link href={`/admin/users/${u.id}`} className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                          Sửa
                        </Link>
                        <button onClick={()=>handleDeleteUser(u.id)} className="text-red-600 hover:text-red-700 font-medium text-sm">
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
