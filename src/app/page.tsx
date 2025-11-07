
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthContext } from '@/hooks/use-auth';

export default function Home() {
  const router = useRouter();
  const { user, loading, profile } = useAuthContext();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // If user is logged in, check if they completed onboarding
        if (profile && profile.age && profile.height && profile.weight) {
          router.replace('/dashboard');
        } else {
          router.replace('/onboarding');
        }
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading, profile, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
}
