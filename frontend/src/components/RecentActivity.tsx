"use client"
import React, { useEffect, useState } from 'react'
import { DashboardAPI } from '../lib/dashboardApi'

export default function RecentActivity(){
  const [data, setData] = useState<any>({ users: [], news: [], media: [] })
  useEffect(()=>{ DashboardAPI.recent().then(d=>setData(d)).catch(()=>{}) }, [])
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="p-4 bg-white rounded shadow">
        <h3 className="font-semibold">Recent Users</h3>
        <ul className="text-sm mt-2">
          {data.users.map((u:any)=>(<li key={u.id}>{u.email || u.name}</li>))}
        </ul>
      </div>
      <div className="p-4 bg-white rounded shadow">
        <h3 className="font-semibold">Recent News</h3>
        <ul className="text-sm mt-2">
          {data.news.map((n:any)=>(<li key={n.id}>{n.title}</li>))}
        </ul>
      </div>
      <div className="p-4 bg-white rounded shadow">
        <h3 className="font-semibold">Recent Media</h3>
        <ul className="text-sm mt-2">
          {data.media.map((m:any)=>(<li key={m.id}>{m.key}</li>))}
        </ul>
      </div>
    </div>
  )
}
