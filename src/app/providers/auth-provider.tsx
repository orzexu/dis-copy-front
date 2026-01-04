import { useAuthInit } from "@features/auth/lib"

type Props = {
  children: React.ReactNode
}

export const AuthProvider: React.FC<Props> = ({children}) => {
  const { isLoading } = useAuthInit()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

return <>{children}</>
}