"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Users, User } from '../../lib/api'

export default function UsersPage(){
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{ load() }, [])
  async function load(){
    setLoading(true)
    try{ const res = await Users.list(50,0); setUsers(res.data || []) }finally{ setLoading(false) }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <Link href="/users/new" className="px-3 py-2 bg-green-600 text-white rounded">New</Link>
      </div>
      <div className="mt-6">
        {loading ? <div>Loading...</div> : (
          <table className="w-full table-auto border-collapse">
            <thead><tr className="text-left"><th className="p-2">ID</th><th className="p-2">Email</th><th className="p-2">Created</th><th className="p-2"></th></tr></thead>
            <tbody>
              {users.map(u=> (
                <tr key={u.id} className="border-t">
                  <td className="p-2">{u.id}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{new Date(u.created_at).toLocaleString()}</td>
                  <td className="p-2"><Link href={`/users/${u.id}`} className="text-blue-600">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
