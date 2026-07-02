"use client"
import React, { useEffect, useState } from 'react'
import PublicLayout from '../../../components/PublicLayout'
import { PublicAPI } from '../../../lib/publicApi'

export default function NewsDetail({ params }: { params: { id: string } }){
  const [news, setNews] = useState<any>(null)
  useEffect(()=>{ PublicAPI.newsDetail(parseInt(params.id)).then(setNews) }, [params.id])
  if(!news) return <PublicLayout><div className="container mx-auto px-4 py-8">Loading...</div></PublicLayout>
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-4xl font-bold mb-4">{news.title}</h1>
        <div className="text-gray-600 mb-6">{new Date(news.created_at).toLocaleDateString('vi-VN')}</div>
        {news.featured_image_url && <img src={news.featured_image_url} alt="" className="w-full rounded mb-6 max-h-96 object-cover" />}
        <div className="prose max-w-none text-gray-700 leading-relaxed">{news.content}</div>
        {news.tags && news.tags.length > 0 && <div className="mt-8 flex gap-2 flex-wrap">
          {news.tags.map((t:any)=><span key={t.id} className="px-3 py-1 bg-gray-200 rounded text-sm">{t.name}</span>)}
        </div>}
      </div>
    </PublicLayout>
  )
}
