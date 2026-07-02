"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import BannerForm from '../../../components/BannerForm'
import { Banners } from '../../../lib/api'

export default function NewBanner(){
  const router = useRouter()
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">New Banner</h1>
      <BannerForm onSubmit={async (v)=>{ await Banners.create(v); router.push('/banners') }} submitLabel="Create" />
    </div>
  )
}
