
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthContext } from '@/hooks/use-auth';

export default function Home() {
  const router = useRouter();
  const { user, profile, loading } = useAuthContext();

  useEffect(() => {
    // We should not do anything until the loading is complete
    if (loading) {
      return;
    }

    if (user) {
      // If we have a user, we need to check their profile to see if onboarding is complete.
      // The `profile` object might still be loading even if the `user` object is available.
      // A complete profile is determined by the presence of the `age` field.
      if (profile) {
        if (profile.age) {
          router.replace('/dashboard');
        } else {
          // If the profile is loaded but age is missing, go to onboarding.
          router.replace('/onboarding');
        }
      }
      // If profile is not yet loaded, the effect will re-run when it is.
      // We don't do anything here to prevent a premature redirect.
    } else {
      // If there's no user after loading, go to login.
      router.replace('/login');
    }
  }, [user, profile, loading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
}
