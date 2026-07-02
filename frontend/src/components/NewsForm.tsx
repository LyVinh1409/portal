"use client"
import React, { useState } from 'react'
import ImageUploader from './ImageUploader'
import { NewsAPI } from '../lib/api'

type Props = { initial?: any, onSubmit: (v:any)=>Promise<void>, submitLabel?: string }

export default function NewsForm({ initial, onSubmit, submitLabel = 'Save' }: Props){
  const [title, setTitle] = useState(initial?.title || '')
  const [slug, setSlug] = useState(initial?.slug || '')
  const [excerpt, setExcerpt] = useState(initial?.excerpt || '')
  const [body, setBody] = useState(initial?.body || '')
  const [seoTitle, setSeoTitle] = useState(initial?.seo_title || '')
  const [seoDesc, setSeoDesc] = useState(initial?.seo_description || '')
  const [featuredKey, setFeaturedKey] = useState<string | undefined>(initial?.featured_image)
  const [tags, setTags] = useState<number[]>(initial?.tag_ids || [])
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault()
    setLoading(true)
    try{ await onSubmit({ title, slug, excerpt, body, seo_title: seoTitle, seo_description: seoDesc, featured_key: featuredKey, tag_ids: tags }) }finally{ setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="mb-4"><label className="block">Title</label><input value={title} onChange={e=>setTitle(e.target.value)} className="w-full border px-3 py-2 rounded" required /></div>
      <div className="mb-4"><label className="block">Slug</label><input value={slug} onChange={e=>setSlug(e.target.value)} className="w-full border px-3 py-2 rounded" /></div>
      <div className="mb-4"><label className="block">Excerpt</label><textarea value={excerpt} onChange={e=>setExcerpt(e.target.value)} className="w-full border px-3 py-2 rounded" /></div>
      <div className="mb-4"><label className="block">Body</label><textarea value={body} onChange={e=>setBody(e.target.value)} className="w-full border px-3 py-2 rounded h-48" required /></div>
      <div className="mb-4"><label className="block">Featured Image</label><ImageUploader onUploaded={(res)=>setFeaturedKey(res.key)} /></div>
      <div className="mb-4"><label className="block">SEO Title</label><input value={seoTitle} onChange={e=>setSeoTitle(e.target.value)} className="w-full border px-3 py-2 rounded" /></div>
      <div className="mb-4"><label className="block">SEO Description</label><textarea value={seoDesc} onChange={e=>setSeoDesc(e.target.value)} className="w-full border px-3 py-2 rounded" /></div>
      <div className="mb-4"><button className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>{submitLabel}</button></div>
    </form>
  )
}
