"use client"
import React, { useState } from 'react'
import PublicLayout from '../../components/PublicLayout'

export default function ContactPage(){
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){ setForm({ ...form, [e.target.name]: e.target.value }) }
  function handleSubmit(e: React.FormEvent){ e.preventDefault(); setSent(true); setTimeout(()=>setSent(false), 3000); setForm({ name: '', email: '', message: '' }) }
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Liên hệ</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Thông tin liên hệ</h3>
            <div className="space-y-4 text-gray-700">
              <div><strong>Địa chỉ:</strong> 123 Đường chính, Thành phố</div>
              <div><strong>Điện thoại:</strong> +84 123 456 789</div>
              <div><strong>Email:</strong> info@website.com</div>
              <div><strong>Giờ làm việc:</strong> 09:00 - 18:00</div>
            </div>
          </div>
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="name" placeholder="Tên" value={form.name} onChange={handleChange} required className="w-full border rounded px-4 py-2" />
              <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full border rounded px-4 py-2" />
              <textarea name="message" placeholder="Tin nhắn" value={form.message} onChange={handleChange} required rows={5} className="w-full border rounded px-4 py-2"></textarea>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700">Gửi</button>
              {sent && <div className="text-green-600">Cảm ơn! Chúng tôi sẽ liên hệ sớm.</div>}
            </form>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
