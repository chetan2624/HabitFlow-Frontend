import React, { createContext, useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const { getToken } = useAuth();
  
  // Make getToken globally available for Axios interceptor
  window.getClerkToken = getToken;

  const [user, setUser] = useState(null); // This will be the MongoDB user object
  const [loading, setLoading] = useState(true);
  const [hasSynced, setHasSynced] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const syncUser = async () => {
      // Prevent repeated sync calls if already synced
      if (hasSynced && user && clerkUser && user.clerkId === clerkUser.id) {
        return;
      }

      if (isSignedIn && clerkUser) {
        try {
          const token = await getToken();
          // Store token in localStorage for Axios interceptor to use
          const authData = { token };
          localStorage.setItem('user', JSON.stringify(authData));

          // Call backend to sync user
          const email = clerkUser.primaryEmailAddress?.emailAddress;
          const name = clerkUser.fullName || clerkUser.firstName || 'User';
          
          // You could pass customIllustration here if you stored it in localStorage temporarily during onboarding
          const pendingIllustration = localStorage.getItem('pendingIllustration');
          
          const res = await api.post('/auth/sync', { email, name, customIllustration: pendingIllustration });
          
          if (pendingIllustration) {
             localStorage.removeItem('pendingIllustration');
          }

          if (isMounted) {
            setUser(res.data);
            setHasSynced(true);
          }
        } catch (err) {
          console.error("Error syncing user:", err);
        } finally {
          if (isMounted) setLoading(false);
        }
      } else if (isLoaded && !isSignedIn) {
        if (isMounted) {
          setUser(null);
          setHasSynced(false);
          localStorage.removeItem('user');
          setLoading(false);
        }
      }
    };

    if (isLoaded && isMounted) {
      syncUser();
    }
    
    return () => {
      isMounted = false;
    };
  }, [isLoaded, isSignedIn, clerkUser?.id, getToken, hasSynced, user?.clerkId]);

  const updateOnboarding = async (userType) => {
    setLoading(true);
    try {
      const res = await api.put('/auth/onboarding', { userType });
      setUser({ ...user, userType: res.data.userType, onboardingComplete: true });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, updateOnboarding, logout, loading: !isLoaded || loading }}>
      {children}
    </AuthContext.Provider>
  );
};
