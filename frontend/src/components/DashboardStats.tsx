"use client"
import React, { useEffect, useState } from 'react'
import { DashboardAPI } from '../lib/dashboardApi'

export default function DashboardStats(){
  const [stats, setStats] = useState<any>({})
  useEffect(()=>{ DashboardAPI.stats().then(setStats).catch(()=>{}) }, [])
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="p-4 bg-white rounded shadow">
        <div className="text-sm text-gray-500">Users</div>
        <div className="text-2xl font-bold">{stats.users ?? 0}</div>
      </div>
      <div className="p-4 bg-white rounded shadow">
        <div className="text-sm text-gray-500">News</div>
        <div className="text-2xl font-bold">{stats.news ?? 0}</div>
      </div>
      <div className="p-4 bg-white rounded shadow">
        <div className="text-sm text-gray-500">Media</div>
        <div className="text-2xl font-bold">{stats.media ?? 0}</div>
      </div>
    </div>
  )
}
