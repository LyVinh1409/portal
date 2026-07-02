"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { NewsAPI } from '../../../lib/api'

export default function NewsDetail(){
  const params = useParams()
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug || ''
  const [item, setItem] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(()=>{ load() }, [slug])
  async function load(){ setLoading(true); try{ const res = await NewsAPI.getBySlug(slug); setItem(res.data) }finally{ setLoading(false) } }
  if(loading) return <div className="p-6">Loading...</div>
  if(!item) return <div className="p-6">Not found</div>
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">{item.title}</h1>
      {item.featured_image && <img src={item.featured_image} alt="" className="my-4 max-w-full" />}
      <div className="prose" dangerouslySetInnerHTML={{ __html: item.body }} />
    </div>
  )
}
