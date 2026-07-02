"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import CategoryForm from '../../../components/CategoryForm'
import { Categories } from '../../../lib/api'

export default function NewCategory(){
  const router = useRouter()
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">New Category</h1>
      <CategoryForm onSubmit={async (v)=>{ await Categories.create(v); router.push('/categories') }} submitLabel="Create" />
    </div>
  )
}
