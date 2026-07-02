"use client"
import React, { useEffect, useState } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { DashboardAPI } from '../lib/dashboardApi'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function DashboardChart(){
  const [data, setData] = useState<any>(null)
  useEffect(()=>{
    async function load(){
      const stats = await DashboardAPI.stats()
      // sample timeseries mock based on total counts
      const labels = ['-4d','-3d','-2d','-1d','now']
      const users = [1,2,3,4, (stats.users || 0)]
      const news = [0,1,2,3, (stats.news || 0)]
      setData({ labels, datasets: [ { label: 'Users', data: users, borderColor: 'rgba(37,99,235,1)', backgroundColor: 'rgba(37,99,235,0.1)' }, { label: 'News', data: news, borderColor: 'rgba(16,185,129,1)', backgroundColor: 'rgba(16,185,129,0.08)' } ] })
    }
    load()
  }, [])
  if(!data) return <div>Loading chart...</div>
  return <div className="p-4 bg-white rounded shadow"><Line data={data} /></div>
}
