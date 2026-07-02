"use client"
import React, { useState, useEffect } from 'react'
import AdminLayout from '../../../components/AdminLayout'

export default function DashboardPage(){
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalNews: 0,
    totalViews: 0,
    pendingReviews: 0,
    activeUsers: 0,
    newsPublished: 0
  })
  const [topContent, setTopContent] = useState<any[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(()=>{ loadDashboard() }, [])

  async function loadDashboard(){
    try{
      const token = localStorage.getItem('accessToken')
      const res = await fetch('/api/admin/analytics/overview', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if(res.ok){
        const data = await res.json()
        setStats(data.data?.stats || stats)
        setTopContent(data.data?.topContent || [])
        setRecentActivity(data.data?.recentActivity || [])
      }
    }catch(err){
      console.error('Lỗi tải dashboard:', err)
    }
  }

  const StatCard = ({ label, value, icon }: any) => (
    <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value.toLocaleString()}</p>
        </div>
        <div className="text-4xl text-blue-100">{icon}</div>
      </div>
    </div>
  )

  return (
    <AdminLayout>
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Tổng quan hệ thống</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard label="Tổng Người Dùng" value={stats.totalUsers} icon="👥" />
          <StatCard label="Bài Viết Đã Xuất Bản" value={stats.newsPublished} icon="📰" />
          <StatCard label="Lượt Xem Tổng" value={stats.totalViews} icon="👁️" />
          <StatCard label="Chờ Duyệt" value={stats.pendingReviews} icon="⏳" />
          <StatCard label="Người Dùng Hoạt Động" value={stats.activeUsers} icon="🟢" />
          <StatCard label="Tổng Bài Viết" value={stats.totalNews} icon="📚" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Content */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Bài Viết Nổi Bật</h2>
            <div className="space-y-4">
              {topContent.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Chưa có dữ liệu</p>
              ) : (
                topContent.map((item: any, idx: number) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 truncate">{item.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{item.view_count} lượt xem</p>
                    </div>
                    <div className="text-right ml-4">
                      <span className="text-2xl font-bold text-blue-600">#{idx + 1}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Hoạt Động Gần Đây</h2>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Chưa có hoạt động</p>
              ) : (
                recentActivity.map((activity: any) => (
                  <div key={activity.id} className="flex items-start gap-4 border-b pb-4 last:border-b-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                      {activity.action === 'create' && '✏️'}
                      {activity.action === 'update' && '🔄'}
                      {activity.action === 'delete' && '🗑️'}
                      {activity.action === 'publish' && '📤'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {activity.action === 'create' && 'Tạo'}
                        {activity.action === 'update' && 'Cập nhật'}
                        {activity.action === 'delete' && 'Xóa'}
                        {activity.action === 'publish' && 'Xuất bản'}
                        {' '} {activity.entity}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(activity.created_at).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
