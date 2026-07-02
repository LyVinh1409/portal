"use client"
import React, { useState } from 'react'
import { MediaAPI } from '../lib/api'

type Props = { folder?: string, onUploaded?: (res:any)=>void }

export default function MediaUploader({ folder = 'root', onUploaded }: Props){
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onChange(e: React.ChangeEvent<HTMLInputElement>){
    if(!e.target.files || e.target.files.length === 0) return
    const f = e.target.files[0]
    const fd = new FormData()
    fd.append('file', f)
    fd.append('folder', folder)
    setLoading(true); setError(null)
    try{ const res = await MediaAPI.uploadForm(fd); if(onUploaded) onUploaded(res) }catch(err:any){ setError(err?.message || 'Upload failed') }finally{ setLoading(false) }
  }

  return (
    <div>
      <input type="file" onChange={onChange} />
      {loading && <div>Uploading...</div>}
      {error && <div className="text-red-600">{error}</div>}
    </div>
  )
}
