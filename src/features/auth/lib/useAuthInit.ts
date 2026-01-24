import { useEffect, useState } from 'react';
import { useAuthStore } from '@entities/user/model';
import { getProfile } from '@shared/api';
import { ROUTES } from '@app/config';
import { useNavigate } from 'react-router';

export const useAuthInit = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const {
    setIsInitialized,
    login,
    logout,
    getIsInitialized,
  } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      if (getIsInitialized()) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await getProfile();

        const currentToken = useAuthStore.getState().getAccessToken();
        login(userData, currentToken || '');

        if (
          location.pathname === ROUTES.login ||
          location.pathname === ROUTES.register
        ) {
          navigate(ROUTES.main, { replace: true });
        }
      } catch (error: any) {
        console.error('Auth initialization error:', error);

        logout();

        if (
          location.pathname !== ROUTES.login &&
          location.pathname !== ROUTES.register
        ) {
          navigate(ROUTES.login, { replace: true });
        }
      } finally {
        setIsInitialized(true);
        setIsLoading(false);
      }
    };

    initAuth();
  }, [getIsInitialized, setIsInitialized, login, logout, navigate]);

  return { isLoading };
};