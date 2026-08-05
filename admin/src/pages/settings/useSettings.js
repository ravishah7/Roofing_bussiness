import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api'

export function useSettingsQuery() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => (await api.get('/settings')).data.data,
  })
}

export function useUpdateSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload) => (await api.patch('/settings', payload)).data.data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings'] })
      toast.success('Settings saved')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to save settings'),
  })
}

export function useUploadBrand(field) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (file) => {
      const form = new FormData()
      form.append(field, file)
      return (await api.patch(`/settings/${field}`, form)).data.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings'] })
      toast.success(`${field === 'logo' ? 'Logo' : 'Favicon'} updated`)
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Upload failed'),
  })
}
