import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null = loading
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'GET', // We'll use this to check if session exists
          credentials: 'include',
        });

        // Since login endpoint is POST-only, we'll make a simple fetch to an authenticated route
        // to check if the session is valid
        const dashboardResponse = await fetch('/admin', {
          method: 'HEAD', // Use HEAD to just check the response
          credentials: 'include',
        });

        // If we get redirected (status 307/302) or get a 401/403, user is not authenticated
        if (dashboardResponse.redirected || dashboardResponse.status === 401 || dashboardResponse.status === 403) {
          setIsAuthenticated(false);
        } else {
          // If we can access the admin page, user is authenticated
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    // Small delay to allow cookie to be set
    const timer = setTimeout(() => {
      checkAuth();
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);

  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
      router.push('/admin/login');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return { isAuthenticated, loading, signOut };
}