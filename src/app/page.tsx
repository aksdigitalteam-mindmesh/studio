
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthContext } from '@/hooks/use-auth';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuthContext();

  useEffect(() => {
    // We should not do anything until the auth state is resolved.
    if (loading) {
      return;
    }

    if (!user) {
      // If there's no user after loading, they need to log in.
      router.replace('/login');
      return;
    }

    // If there is a user, always redirect to the dashboard.
    router.replace('/dashboard');

  }, [user, loading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
}

    