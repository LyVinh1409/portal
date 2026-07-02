"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import UserForm from '../../../components/UserForm'
import { Users } from '../../../lib/api'

export default function NewUser(){
  const router = useRouter()
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">New User</h1>
      <UserForm onSubmit={async (v)=>{ await Users.create(v); router.push('/users') }} submitLabel="Create" />
    </div>
  )
}
