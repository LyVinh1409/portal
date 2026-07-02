"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Categories } from '../../lib/api'

export default function CategoriesPage(){
  const [cats, setCats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(()=>{ load() }, [])
  async function load(){ setLoading(true); try{ const res = await Categories.list(200,0); setCats(res.data || []) }finally{ setLoading(false) } }
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Link href="/categories/new" className="px-3 py-2 bg-green-600 text-white rounded">New</Link>
      </div>
      <div className="mt-6">
        <table className="w-full table-auto border-collapse">
          <thead><tr className="text-left"><th className="p-2">ID</th><th className="p-2">Name</th><th className="p-2">Path</th><th className="p-2"></th></tr></thead>
          <tbody>
            {cats.map(c=> (
              <tr key={c.id} className="border-t">
                <td className="p-2">{c.id}</td>
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.path}</td>
                <td className="p-2"><Link href={`/categories/${c.id}`} className="text-blue-600">View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
