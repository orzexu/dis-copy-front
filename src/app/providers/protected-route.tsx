import { ROUTES } from '@app/config'
import { useAuthStore } from '@entities/user/model'
import { Navigate, Outlet } from 'react-router'

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated())

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />
  }

  return <Outlet />
}