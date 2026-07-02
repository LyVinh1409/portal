export const DashboardAPI = {
  stats: async () => {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + '/api/dashboard/stats', { credentials: 'include' })
    return res.json()
  },
  recent: async () => {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + '/api/dashboard/recent', { credentials: 'include' })
    return res.json()
  }
}
