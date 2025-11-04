"use client";

import { useAuthContext } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { loginSchema } from '@/lib/schemas';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const { user, loading, signUpWithEmail, signInWithEmail } = useAuthContext();
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  const handleAuthAction = async (values: z.infer<typeof loginSchema>, action: 'login' | 'signup') => {
    startTransition(async () => {
      let error;
      if (action === 'login') {
        error = await signInWithEmail(values.email, values.password);
      } else {
        error = await signUpWithEmail(values.email, values.password);
      }

      if (error) {
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: error,
        });
      } else {
        toast({
            title: action === 'login' ? "Login Successful" : "Signup Successful",
            description: "Redirecting to your dashboard...",
        })
        router.push('/dashboard');
      }
    });
  }

  if (loading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

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
          <Form {...form}>
            <form className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col sm:flex-row gap-2">
                 <Button onClick={form.handleSubmit(v => handleAuthAction(v, 'login'))} disabled={isPending} className="w-full">
                   {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                   Login
                  </Button>
                  <Button onClick={form.handleSubmit(v => handleAuthAction(v, 'signup'))} disabled={isPending} variant="outline" className="w-full">
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign Up
                  </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
