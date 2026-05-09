import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Example: replace T and the fetch logic with your real API
export function useData<T>(key: string[], fetcher: () => Promise<T>) {
  return useQuery({ queryKey: key, queryFn: fetcher })
}

export function useMutate<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  invalidateKeys?: string[][]
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: () => {
      invalidateKeys?.forEach((key) => queryClient.invalidateQueries({ queryKey: key }))
    },
  })
}
