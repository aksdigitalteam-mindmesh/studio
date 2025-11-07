
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/hooks/use-auth';
import DashboardNav from "@/components/dashboard-nav";
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
        if (!user) {
          router.replace('/login');
        } else if (user && (!profile || !profile.age || !profile.height || !profile.weight)) {
          router.replace('/onboarding');
        }
    }
  }, [user, profile, loading, router]);

  if (loading || !user || !profile?.age) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
        <div className="w-full min-h-screen flex flex-col pb-16">
            <main className="flex-1">{children}</main>
            <DashboardNav />
        </div>
  );
}
