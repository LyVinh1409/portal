"use client"
import React, { useState, useEffect } from 'react'
import { Categories } from '../lib/api'

type Props = { initial?: { name?: string; slug?: string; parent_id?: number | null }, onSubmit: (v: any)=>Promise<void>, submitLabel?: string }

export default function CategoryForm({ initial, onSubmit, submitLabel = 'Save' }: Props){
  const [name, setName] = useState(initial?.name || '')
  const [slug, setSlug] = useState(initial?.slug || '')
  const [parent, setParent] = useState<number | null | undefined>(initial?.parent_id)
  const [parents, setParents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(()=>{ loadParents() }, [])
  async function loadParents(){ try{ const res = await Categories.list(100,0); setParents(res.data || []) }catch(e){} }

  async function handle(e: React.FormEvent){
    e.preventDefault()
    setError(null)
    if(!name || !slug){ setError('Name and slug required'); return }
    setLoading(true)
    try{ await onSubmit({ name, slug, parent_id: parent }) }catch(err:any){ setError(err?.message || 'Error') }finally{ setLoading(false) }
  }

  return (
    <form onSubmit={handle} className="max-w-lg">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Name</label>
        <input value={name} onChange={e=>setName(e.target.value)} className="w-full border px-3 py-2 rounded" required />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Slug</label>
        <input value={slug} onChange={e=>setSlug(e.target.value)} className="w-full border px-3 py-2 rounded" required />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Parent</label>
        <select value={parent ?? ''} onChange={e=>setParent(e.target.value === '' ? null : Number(e.target.value))} className="w-full border px-3 py-2 rounded">
          <option value="">-- none --</option>
          {parents.map(p=> <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>{submitLabel}</button>
      </div>
    </form>
  )
}
