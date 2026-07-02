export const PublicAPI = {
  newsList: async (limit = 12, offset = 0) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/news?limit=${limit}&offset=${offset}`)
    return res.json()
  },
  newsDetail: async (id: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/news/${id}`)
    return res.json()
  },
  mediaList: async (folder = 'root', limit = 12, offset = 0) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/dashboard/media?folder=${folder}&limit=${limit}&offset=${offset}`)
    return res.json()
  },
  banners: async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/banners`)
    return res.json()
  }
}
