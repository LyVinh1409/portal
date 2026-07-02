"use client"
import React, { useEffect, useState } from 'react'
import { MediaAPI } from '../../lib/api'
import Link from 'next/link'

export default function MediaPage(){
  const [items, setItems] = useState<any[]>([])
  const [folder, setFolder] = useState('root')
  const [folders, setFolders] = useState<string[]>([])
  useEffect(()=>{ load(); loadFolders() }, [folder])
  async function load(){ const res = await MediaAPI.list(folder, 100, 0); setItems(res.data || []) }
  async function loadFolders(){ const res = await MediaAPI.folders(); setFolders(res.data || []) }
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Media</h1>
        <Link href="/media/upload" className="px-3 py-2 bg-green-600 text-white rounded">Upload</Link>
      </div>
      <div className="mt-4 mb-4">
        <select value={folder} onChange={e=>setFolder(e.target.value)} className="border px-3 py-2 rounded">
          <option value="root">root</option>
          {folders.map(f=> <option key={f} value={f}>{f}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {items.map(m=> (
          <div key={m.id} className="border p-2">
            <img src={m.preview_url || m.url} alt="" className="max-h-40 w-full object-cover" />
            <div className="text-sm mt-2">{m.key}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
