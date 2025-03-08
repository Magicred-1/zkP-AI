import { useEffect, useState } from 'react';
import { verifySession } from '@/app/api/verify';
import type { Session } from '@supabase/supabase-js';
import type { Profile } from '@/hooks/useAuth';

export function useProtectedRoute() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verify = async () => {
      try {
        const result = await verifySession();
        if (result) {
          setSession(result.session);
          setProfile(result.profile);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to verify session');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  return {
    session,
    profile,
    loading,
    error,
    jwt: session?.access_token,
  };
}