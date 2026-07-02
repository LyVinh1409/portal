"use client"
import React from 'react'
import AdminLayout from '../../components/AdminLayout'
import Link from 'next/link'

export default function AdminHome(){
  return (
    <AdminLayout>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4">CMS Home</h1>
        <div className="grid grid-cols-3 gap-4">
          <Link href="/admin/roles" className="p-4 bg-white rounded shadow">Manage Roles</Link>
          <Link href="/admin/permissions" className="p-4 bg-white rounded shadow">Manage Permissions</Link>
          <Link href="/media" className="p-4 bg-white rounded shadow">Media Library</Link>
        </div>
      </div>
    </AdminLayout>
  )
}
