"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import NewsForm from '../../../components/NewsForm'
import { NewsAPI } from '../../../lib/api'

export default function NewNews(){
  const router = useRouter()
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">New Article</h1>
      <NewsForm onSubmit={async (v)=>{ await NewsAPI.create(v); router.push('/news') }} submitLabel="Create" />
    </div>
  )
}
