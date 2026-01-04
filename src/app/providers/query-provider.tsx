import { queryClient } from "@shared/lib/react-query"
import { QueryClientProvider } from "@tanstack/react-query"

type Props = {
  children: React.ReactNode
}

export const QueryProvider: React.FC<Props> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
