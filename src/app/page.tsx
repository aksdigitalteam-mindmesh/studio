
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthContext } from '@/hooks/use-auth';

export default function Home() {
  const router = useRouter();
  const { user, profile, loading } = useAuthContext();

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

    // If we have a user, but the profile is still loading, we wait.
    // The profile loading is separate from the initial auth loading.
    if (user && !profile) {
      return;
    }
    
    // Now we have a user and their profile data. We can make a decision.
    if (user && profile) {
      if (profile.age) {
        // If age exists, onboarding is complete. Go to dashboard.
        router.replace('/dashboard');
      } else {
        // If age is missing, they must complete onboarding.
        router.replace('/onboarding');
      }
    }

  }, [user, profile, loading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
}
