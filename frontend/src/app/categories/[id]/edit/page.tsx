"use client"
import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import CategoryForm from '../../../../components/CategoryForm'
import { Categories } from '../../../../lib/api'

export default function EditCategory(){
  const params = useParams()
  const id = Number(params.id)
  const router = useRouter()
  const [initial, setInitial] = useState<any | null>(null)
  useEffect(()=>{ load() }, [id])
  async function load(){ const res = await Categories.get(id); setInitial(res.data) }
  if(!initial) return <div className="p-6">Loading...</div>
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Category</h1>
      <CategoryForm initial={{ name: initial.name, slug: initial.slug, parent_id: initial.parent_id }} onSubmit={async (v)=>{ await Categories.update(id, v); router.push(`/categories/${id}`) }} submitLabel="Update" />
    </div>
  )
}
