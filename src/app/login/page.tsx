
"use client";

import { useAuthContext } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { signInWithGoogle, user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);


  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="mx-auto mb-4">
                <Icons.Logo className="h-16 w-16 text-primary"/>
            </div>
          <CardTitle className="text-2xl font-headline">Welcome to FitBoost</CardTitle>
          <CardDescription>Your personal AI fitness and nutrition coach.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={signInWithGoogle} className="w-full">
            Sign In with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
