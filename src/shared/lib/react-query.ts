import { DefaultOptions, QueryCache, QueryClient } from "@tanstack/react-query";

const queryConfig: DefaultOptions = {
  queries: {
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 1,
    throwOnError: true,
  }
}

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
  queryCache: new QueryCache({
    onError: (error) => {
      console.error('Query Error:', error)
    }
  })
})