// src/components/AuthWrapper.tsx
import { useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { createUserIfNotExists } from '../../amplify/data/resolvers/createUser';

/**
 * Wrapper component that handles user creation after authentication
 */
export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { user, authStatus } = useAuthenticator();

  useEffect(() => {
    const syncUser = async () => {
      if (authStatus === 'authenticated' && user) {
        try {
          const attributes = await fetchUserAttributes();
          await createUserIfNotExists(
            user.userId,
            attributes.preferred_username || user.username
          );
        } catch (error) {
          console.error('Error syncing user:', error);
        }
      }
    };

    syncUser();
  }, [user, authStatus]);

  return <>{children}</>;
};