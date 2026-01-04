import { useEffect, useState } from 'react'
import { useAuthStore } from '@entities/user/model'
import { getProfile } from '@shared/api'

export const useAuthInit = () => {
  const [isLoading, setIsLoading] = useState(true)
  const { setIsInitialized, login, logout, getIsInitialized, setAccessToken } = useAuthStore()

  useEffect(() => {
    const initAuth = async () => {
      if (getIsInitialized()) {
        setIsLoading(false)
        return
      }

      try {
        const storedToken = localStorage.getItem('auth-storage')
        let accessToken: string | null = null
        
        if (storedToken) {
          try {
            const parsed = JSON.parse(storedToken)
            accessToken = parsed.state.accessToken
            
            if (accessToken) {
              setAccessToken(accessToken)
            }
          } catch (error) {
            console.error('Error parsing stored token:', error)
            localStorage.removeItem('auth-storage')
          }
        }

        const userData = await getProfile()
        
        if (userData) {
          const currentToken = useAuthStore.getState().getAccessToken()
          
          if (currentToken) {
            login(userData, currentToken)
          } else {
            login(userData, accessToken || '')
          }
        } else {
          logout()
        }
      } catch (error: any) {
        console.error('Auth initialization error:', error)
        
        if (error.response?.status === 401 || error.message === 'Unauthorized') {
          logout()
        } else {
          logout()
        }
      } finally {
        setIsInitialized(true)
        setIsLoading(false)
      }
    }

    initAuth()
  }, [getIsInitialized, setIsInitialized, login, logout, setAccessToken])

  return { isLoading }
}