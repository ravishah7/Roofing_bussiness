import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api'

/**
 * Generic React Query bindings for a REST resource, matching the backend's
 * { success, data, meta } envelope and ApiFeatures query params
 * (page, limit, sort, search, fields, plus arbitrary filters).
 *
 * Usage: const blogs = useResourceList('blogs', { page, search, status })
 */
export function useResourceList(resource, params = {}, options = {}) {
  return useQuery({
    queryKey: [resource, 'list', params],
    queryFn: async () => {
      const { data } = await api.get(`/${resource}`, { params })
      return data // { success, data: [...], meta: {...} }
    },
    placeholderData: (prev) => prev,
    ...options,
  })
}

export function useResourceItem(resource, id, options = {}) {
  return useQuery({
    queryKey: [resource, 'item', id],
    queryFn: async () => (await api.get(`/${resource}/${id}`)).data.data,
    enabled: !!id,
    ...options,
  })
}

export function useCreateResource(resource, { successMessage } = {}) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload) => {
      const isForm = payload instanceof FormData
      const { data } = await api.post(`/${resource}`, payload, {
        headers: isForm ? { 'Content-Type': 'multipart/form-data' } : undefined,
      })
      return data.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [resource] })
      toast.success(successMessage || 'Created successfully')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })
}

export function useUpdateResource(resource, { successMessage } = {}) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data: payload }) => {
      const isForm = payload instanceof FormData
      const { data } = await api.patch(`/${resource}/${id}`, payload, {
        headers: isForm ? { 'Content-Type': 'multipart/form-data' } : undefined,
      })
      return data.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [resource] })
      toast.success(successMessage || 'Updated successfully')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })
}

export function useDeleteResource(resource, { successMessage } = {}) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id) => (await api.delete(`/${resource}/${id}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [resource] })
      toast.success(successMessage || 'Deleted successfully')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })
}

/**
 * Bulk delete — the backend doesn't expose a batch endpoint, so this fires
 * individual DELETE requests in parallel and reports partial failures.
 */
export function useBulkDeleteResource(resource) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (ids) => {
      const results = await Promise.allSettled(ids.map((id) => api.delete(`/${resource}/${id}`)))
      const failed = results.filter((r) => r.status === 'rejected').length
      return { total: ids.length, failed }
    },
    onSuccess: ({ total, failed }) => {
      qc.invalidateQueries({ queryKey: [resource] })
      if (failed) toast.warning(`Deleted ${total - failed} of ${total} items (${failed} failed)`)
      else toast.success(`Deleted ${total} item${total > 1 ? 's' : ''}`)
    },
  })
}

export function useCustomMutation(fn, { successMessage, invalidate = [] } = {}) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      invalidate.forEach((key) => qc.invalidateQueries({ queryKey: [key] }))
      if (successMessage) toast.success(successMessage)
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })
}
