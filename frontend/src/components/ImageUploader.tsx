"use client"
import React, { useState } from 'react'
import { Uploads } from '../lib/api'

type Props = { onUploaded: (res: any)=>void }

export default function ImageUploader({ onUploaded }: Props){
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  async function handle(e: React.ChangeEvent<HTMLInputElement>){
    if(!e.target.files || e.target.files.length === 0) return
    const f = e.target.files[0]
    setLoading(true); setError(null)
    try{ const res = await Uploads.uploadFile(f); onUploaded(res) }catch(err:any){ setError(err?.message || 'upload error') }finally{ setLoading(false) }
  }
  return (
    <div>
      <input type="file" accept="image/*" onChange={handle} />
      {loading && <div>Uploading...</div>}
      {error && <div className="text-red-600">{error}</div>}
    </div>
  )
}
