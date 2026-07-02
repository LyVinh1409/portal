"use client"
import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import BannerForm from '../../../../components/BannerForm'
import { Banners } from '../../../../lib/api'

export default function EditBanner(){
  const params = useParams()
  const id = Number(params.id)
  const router = useRouter()
  const [initial, setInitial] = useState<any | null>(null)
  useEffect(()=>{ load() }, [id])
  async function load(){ const res = await Banners.get(id); setInitial(res.data) }
  if(!initial) return <div className="p-6">Loading...</div>
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Banner</h1>
      <BannerForm initial={{ title: initial.title, image_key: initial.image_key, link: initial.link, position: initial.position, is_active: initial.is_active, start_at: initial.start_at, end_at: initial.end_at }} onSubmit={async (v)=>{ await Banners.update(id, v); router.push(`/banners/${id}`) }} submitLabel="Update" />
    </div>
  )
}
