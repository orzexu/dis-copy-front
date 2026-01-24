import { useAuthInit } from "@features/auth/lib"
import { LoadingSpinner } from "@shared/ui"

type Props = {
  children: React.ReactNode
}

export const AuthProvider: React.FC<Props> = ({children}) => {
  const { isLoading } = useAuthInit()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center flex-col">
        <LoadingSpinner />
      </div>
    )
  }

return <>{children}</>
}