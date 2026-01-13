import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "../api"

export function useCrudQuery<T = any>(endpoint: string, key: string) {
  const qc = useQueryClient()

  const { data, error, isLoading, refetch } = useQuery<T[]>({
  queryKey: [key],
  queryFn: () => api.get(endpoint).then(r => r.data),
})
  const create = useMutation({
    mutationFn: (payload: Partial<T>) => api.post(endpoint, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
  })

  const remove = useMutation({
    mutationFn: (id: number | string) => api.delete(`${endpoint}/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
  })

  return { data, error, isLoading, create: create.mutateAsync, remove: remove.mutateAsync,  refetch}
}