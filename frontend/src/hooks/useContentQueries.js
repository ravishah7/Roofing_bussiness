import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

// Generic CRUD hook factory — wires up React Query + Axios for each
// admin-managed resource (blogs, projects, testimonials, gallery, faqs,
// service-areas, settings, messages, newsletter).
export function useResourceList(resource, params) {
  return useQuery({
    queryKey: [resource, params],
    queryFn: async () => (await api.get(`/${resource}`, { params })).data,
  })
}

export function useResourceItem(resource, id) {
  return useQuery({
    queryKey: [resource, id],
    queryFn: async () => (await api.get(`/${resource}/${id}`)).data,
    enabled: !!id,
  })
}

export function useCreateResource(resource) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload) => (await api.post(`/${resource}`, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: [resource] }),
  })
}

export function useUpdateResource(resource) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }) => (await api.put(`/${resource}/${id}`, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: [resource] }),
  })
}

export function useDeleteResource(resource) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id) => (await api.delete(`/${resource}/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: [resource] }),
  })
}

// Example usage once a backend is connected:
// const { data: posts, isLoading } = useResourceList('blogs')
// const createPost = useCreateResource('blogs')
