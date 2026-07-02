"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Categories } from '../../../lib/api'

export default function CategoryDetail(){
  const params = useParams()
  const id = Number(params.id)
  const [cat, setCat] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(()=>{ load() }, [id])
  async function load(){ setLoading(true); try{ const res = await Categories.get(id); setCat(res.data) }finally{ setLoading(false) } }
  if(loading) return <div className="p-6">Loading...</div>
  if(!cat) return <div className="p-6">Not found</div>
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">{cat.name}</h1>
      <p className="text-sm text-gray-600">Path: {cat.path}</p>
    </div>
  )
}
