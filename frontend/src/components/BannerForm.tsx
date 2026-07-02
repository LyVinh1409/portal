"use client"
import React, { useState } from 'react'
import ImageUploader from './ImageUploader'

type Props = { initial?: any, onSubmit: (v:any)=>Promise<void>, submitLabel?: string }

export default function BannerForm({ initial, onSubmit, submitLabel = 'Save' }: Props){
  const [title, setTitle] = useState(initial?.title || '')
  const [imageKey, setImageKey] = useState(initial?.image_key || '')
  const [link, setLink] = useState(initial?.link || '')
  const [position, setPosition] = useState(initial?.position || 'hero')
  const [isActive, setIsActive] = useState(initial?.is_active ?? true)
  const [startAt, setStartAt] = useState(initial?.start_at || '')
  const [endAt, setEndAt] = useState(initial?.end_at || '')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault(); setLoading(true)
    await onSubmit({ title, image_key: imageKey, link, position, is_active: isActive, start_at: startAt || null, end_at: endAt || null })
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="mb-4"><label className="block">Title</label><input value={title} onChange={e=>setTitle(e.target.value)} className="w-full border px-3 py-2 rounded" required /></div>
      <div className="mb-4">
        <label className="block">Image</label>
        <ImageUploader onUploaded={(res)=>setImageKey(res.key)} />
        {imageKey && <div className="text-sm text-gray-600 mt-2">Key: {imageKey}</div>}
      </div>
      <div className="mb-4"><label className="block">Link</label><input value={link} onChange={e=>setLink(e.target.value)} className="w-full border px-3 py-2 rounded" /></div>
      <div className="mb-4"><label className="block">Position</label>
        <select value={position} onChange={e=>setPosition(e.target.value)} className="w-full border px-3 py-2 rounded">
          <option value="hero">Hero</option>
          <option value="sidebar">Sidebar</option>
          <option value="footer">Footer</option>
        </select>
      </div>
      <div className="mb-4"><label className="inline-flex items-center"><input type="checkbox" checked={isActive} onChange={e=>setIsActive(e.target.checked)} className="mr-2"/> Active</label></div>
      <div className="mb-4"><label className="block">Start At (ISO)</label><input value={startAt || ''} onChange={e=>setStartAt(e.target.value)} className="w-full border px-3 py-2 rounded" /></div>
      <div className="mb-4"><label className="block">End At (ISO)</label><input value={endAt || ''} onChange={e=>setEndAt(e.target.value)} className="w-full border px-3 py-2 rounded" /></div>
      <div><button className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>{submitLabel}</button></div>
    </form>
  )
}
