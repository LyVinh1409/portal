"use client"
import React from 'react'
import DashboardStats from '../../components/DashboardStats'
import DashboardChart from '../../components/DashboardChart'
import RecentActivity from '../../components/RecentActivity'

export default function DashboardPage(){
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="mb-6"><DashboardStats /></div>
      <div className="mb-6"><DashboardChart /></div>
      <div className="mb-6"><RecentActivity /></div>
    </div>
  )
}
