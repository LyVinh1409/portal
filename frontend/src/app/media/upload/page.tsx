"use client"
import React from 'react'
import MediaUploader from '../../../components/MediaUploader'
import { useRouter } from 'next/navigation'

export default function MediaUpload(){
  const router = useRouter()
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Upload Media</h1>
      <MediaUploader onUploaded={(res)=>{ router.push('/media') }} />
    </div>
  )
}
