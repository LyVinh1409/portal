"use client"
import React, { useEffect, useState } from 'react'
import PublicLayout from '../../components/PublicLayout'
import Link from 'next/link'
import { PublicAPI } from '../../lib/publicApi'

export default function NewsPage(){
  const [news, setNews] = useState<any[]>([])
  const [page, setPage] = useState(0)
  useEffect(()=>{ PublicAPI.newsList(12, page * 12).then(d=>setNews(d.data || [])) }, [page])
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Tin tức</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map(n=><Link key={n.id} href={`/news/${n.id}`} className="bg-white rounded shadow hover:shadow-lg transition p-4">
            <div className="text-sm text-gray-500">{new Date(n.created_at).toLocaleDateString('vi-VN')}</div>
            <h3 className="font-semibold text-lg mt-2">{n.title}</h3>
            <p className="text-gray-600 text-sm mt-2">{n.content?.substring(0, 150) || ''}</p>
            <div className="mt-4 text-blue-600 text-sm">Chi tiết →</div>
          </Link>)}
        </div>
        <div className="flex justify-center gap-2 mt-8">
          {page > 0 && <button onClick={()=>setPage(p=>p-1)} className="px-4 py-2 border rounded">Trước</button>}
          <button onClick={()=>setPage(p=>p+1)} className="px-4 py-2 border rounded">Tiếp</button>
        </div>
      </div>
    </PublicLayout>
  )
}
