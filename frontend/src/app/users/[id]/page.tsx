"use client"
import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Users, User } from '../../../lib/api'
import Link from 'next/link'

export default function UserDetail(){
  const params = useParams()
  const id = Number(params.id)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(()=>{ load() }, [id])
  async function load(){ setLoading(true); try{ const res = await Users.get(id); setUser(res.data) }finally{ setLoading(false) } }
  if(loading) return <div className="p-6">Loading...</div>
  if(!user) return <div className="p-6">Not found</div>
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User {user.id}</h1>
        <div>
          <Link href={`/users/${user.id}/edit`} className="px-3 py-2 bg-yellow-500 text-white rounded mr-2">Edit</Link>
        </div>
      </div>
      <div className="mt-4">
        <p><strong>Email:</strong> {user.email}</p>
        <p className="text-sm text-gray-600">Created: {new Date(user.created_at).toLocaleString()}</p>
      </div>
    </div>
  )
}
