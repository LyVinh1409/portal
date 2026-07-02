"use client"
import React, { useEffect, useState } from 'react'
import PublicLayout from '../components/PublicLayout'
import Link from 'next/link'
import { PublicAPI } from '../lib/publicApi'

export default function HomePage(){
  const [news, setNews] = useState<any[]>([])
  const [media, setMedia] = useState<any[]>([])
  useEffect(()=>{
    PublicAPI.newsList(6).then(d=>setNews(d.data || []))
    PublicAPI.mediaList('root', 6).then(d=>setMedia(d.data || []))
  }, [])
  return (
    <PublicLayout>
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome</h1>
          <p className="text-lg mb-6">Latest news and media content</p>
          <Link href="/news" className="px-6 py-3 bg-white text-blue-600 rounded font-semibold hover:bg-gray-100">Read News</Link>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {news.map(n=><Link key={n.id} href={`/news/${n.id}`} className="bg-white rounded shadow hover:shadow-lg transition">
            <div className="text-sm text-gray-500">{new Date(n.created_at).toLocaleDateString()}</div>
            <h3 className="font-semibold text-lg mt-2">{n.title}</h3>
            <p className="text-gray-600 text-sm mt-2">{n.content?.substring(0, 100) || ''}</p>
          </Link>)}
        </div>
        <h2 className="text-2xl font-bold mb-6">Featured Media</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {media.map(m=><div key={m.id} className="rounded overflow-hidden shadow">
            <img src={m.preview_url || m.url} alt="" className="w-full h-40 object-cover" />
          </div>)}
        </div>
      </div>
    </PublicLayout>
  )
}
