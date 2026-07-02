"use client"
import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import UserForm from '../../../../components/UserForm'
import { Users } from '../../../../lib/api'

export default function EditUser(){
  const params = useParams()
  const id = Number(params.id)
  const router = useRouter()
  const [initial, setInitial] = useState<{ email?: string } | null>(null)
  useEffect(()=>{ load() }, [id])
  async function load(){ const res = await Users.get(id); setInitial(res.data) }
  if(!initial) return <div className="p-6">Loading...</div>
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit User</h1>
      <UserForm initial={initial} onSubmit={async (v)=>{ await Users.update(id, v); router.push(`/users/${id}`) }} submitLabel="Update" />
    </div>
  )
}
