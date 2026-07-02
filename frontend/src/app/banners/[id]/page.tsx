"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Banners } from '../../../lib/api'

export default function BannerDetail(){
  const params = useParams()
  const id = Number(params.id)
  const [b, setB] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(()=>{ load() }, [id])
  async function load(){ setLoading(true); try{ const res = await Banners.get(id); setB(res.data) }finally{ setLoading(false) } }
  if(loading) return <div className="p-6">Loading...</div>
  if(!b) return <div className="p-6">Not found</div>
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">{b.title}</h1>
      {b.image_url && <img src={b.image_url} alt="" className="my-4 max-w-full" />}
      <p>Position: {b.position}</p>
      <p>Active: {b.is_active ? 'Yes' : 'No'}</p>
      {b.link && <p>Link: <a href={b.link} className="text-blue-600">{b.link}</a></p>}
    </div>
  )
}
