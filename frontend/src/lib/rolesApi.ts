export const RolesAPI = {
  list: async () => {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + '/api/roles', { credentials: 'include' })
    return res.json()
  },
  create: async (payload: any) => {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + '/api/roles', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    return res.json()
  },
  update: async (id: number, payload: any) => {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + `/api/roles/${id}`, { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    return res.json()
  },
  remove: async (id: number) => {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + `/api/roles/${id}`, { method: 'DELETE', credentials: 'include' })
    return res
  },
  listPerms: async () => {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + '/api/permissions', { credentials: 'include' })
    return res.json()
  },
  createPerm: async (payload:any) => {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + '/api/permissions', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    return res.json()
  },
  assignPerm: async (roleId:number, permissionId:number) => {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + `/api/roles/${roleId}/permissions`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ permission_id: permissionId }) })
    return res
  },
  revokePerm: async (roleId:number, permissionId:number) => {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + `/api/roles/${roleId}/permissions/${permissionId}`, { method: 'DELETE', credentials: 'include' })
    return res
  }
}
