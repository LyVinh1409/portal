"use client"
import React, { useEffect, useState } from 'react'
import PublicLayout from '../components/PublicLayout'
import Link from 'next/link'
import { PublicAPI } from '../lib/publicApi'

export default function HomePage(){
  const [news, setNews] = useState<any[]>([])
  const [media, setMedia] = useState<any[]>([])
  const [banners, setBanners] = useState<any[]>([])
  
  useEffect(()=>{
    PublicAPI.newsList(6).then(d=>setNews(d.data || []))
    PublicAPI.mediaList('root', 8).then(d=>setMedia(d.data || []))
    PublicAPI.banners().then(d=>setBanners(d.data || []))
  }, [])
  
  return (
    <PublicLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 600">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Khám phá <span className="text-blue-200">Tin tức</span> & <span className="text-blue-200">Nội dung</span> Mới Nhất
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Cập nhật những bài viết, hình ảnh và video thú vị từ cộng đồng của chúng tôi
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/news" className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition shadow-lg hover:shadow-xl transform hover:scale-105">
                Đọc Tin Tức
              </Link>
              <Link href="/media" className="px-8 py-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-400 transition shadow-lg hover:shadow-xl transform hover:scale-105">
                Xem Thư Viện
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          {/* Latest News Section */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-900">Tin Tức Mới Nhất</h2>
                <p className="text-gray-600 mt-2">Các bài viết được cập nhật hàng ngày</p>
              </div>
              <Link href="/news" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2">
                Xem tất cả →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map(n=>(
                <Link key={n.id} href={`/news/${n.id}`} className="group">
                  <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 overflow-hidden h-full flex flex-col">
                    {/* Image */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 h-48">
                      {n.featured_key ? (
                        <img src={n.featured_key} alt={n.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition duration-300"></div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
                          Tin Tức
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(n.created_at).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition">
                        {n.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                        {n.excerpt || n.body?.substring(0, 120) || 'Không có mô tả'}
                      </p>
                      <div className="text-blue-600 font-semibold text-sm flex items-center gap-1">
                        Đọc thêm →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Featured Media Section */}
          <div>
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-900">Thư Viện Hình Ảnh</h2>
                <p className="text-gray-600 mt-2">Những bộ sưu tập hình ảnh độc đáo</p>
              </div>
              <Link href="/media" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2">
                Xem tất cả →
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {media.map(m=>(
                <div key={m.id} className="group cursor-pointer relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition">
                  <img 
                    src={m.preview_url || m.url} 
                    alt="" 
                    className="w-full h-48 object-cover group-hover:scale-110 transition duration-300" 
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition duration-300 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
