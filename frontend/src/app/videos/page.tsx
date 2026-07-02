"use client"
import React, { useEffect, useState } from 'react'
import PublicLayout from '../../components/PublicLayout'
import { PublicAPI } from '../../lib/publicApi'

export default function VideosPage(){
  const [media, setMedia] = useState<any[]>([])
  useEffect(()=>{ PublicAPI.mediaList('videos', 24).then(d=>setMedia(d.data || [])) }, [])
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Video</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {media.map(m=><div key={m.id} className="rounded overflow-hidden shadow hover:shadow-lg transition group cursor-pointer">
            <img src={m.preview_url || m.url} alt="" className="w-full h-40 object-cover group-hover:scale-105 transition" />
            <div className="p-2 text-sm text-gray-700 truncate">{m.key}</div>
          </div>)}
        </div>
      </div>
    </PublicLayout>
  )
}
