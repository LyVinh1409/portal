"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Banners } from '../../lib/api'

export default function BannersPage(){
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(()=>{ load() }, [])
  async function load(){ setLoading(true); try{ const res = await Banners.list(100,0); setItems(res.data || []) }finally{ setLoading(false) } }
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Banners</h1>
        <Link href="/banners/new" className="px-3 py-2 bg-green-600 text-white rounded">New</Link>
      </div>
      <div className="mt-6">
        <table className="w-full table-auto border-collapse">
          <thead><tr className="text-left"><th className="p-2">ID</th><th className="p-2">Title</th><th className="p-2">Position</th><th className="p-2">Active</th><th className="p-2"></th></tr></thead>
          <tbody>
            {items.map(b=> (
              <tr key={b.id} className="border-t">
                <td className="p-2">{b.id}</td>
                <td className="p-2">{b.title}</td>
                <td className="p-2">{b.position}</td>
                <td className="p-2">{b.is_active ? 'Yes' : 'No'}</td>
                <td className="p-2"><Link href={`/banners/${b.id}`} className="text-blue-600">View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
