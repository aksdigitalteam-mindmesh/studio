
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
import { loginSchema, signupSchema } from '@/lib/schemas';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';

export default function LoginPage() {
  const { user, loading, signUpWithEmail, signInWithEmail } = useAuthContext();
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState("login");

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      medicalConditions: "",
      workoutDuration: 60,
      workoutDaysPerWeek: 4,
    },
  });

  useEffect(() => {
    if (!loading && user) {
      router.replace('/onboarding');
    }
  }, [user, loading, router]);

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    startTransition(async () => {
      const error = await signInWithEmail(values.email, values.password);
      if (error) {
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: error,
        });
      } else {
        toast({
            title: "Login Successful",
            description: "Redirecting...",
        })
        router.push('/onboarding');
      }
    });
  }

  const handleSignup = async (values: z.infer<typeof signupSchema>) => {
    startTransition(async () => {
        const { email, password, ...profileData } = values;
        const error = await signUpWithEmail(email, password, profileData);
        if (error) {
            toast({
              variant: "destructive",
              title: "Authentication Failed",
              description: error,
            });
        } else {
            toast({
                title: "Signup Successful",
                description: "Redirecting...",
            })
            router.push('/onboarding');
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
      <Tabs value={tab} onValueChange={setTab} className="w-full max-w-md">
        <Card>
            <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                    <Icons.Logo className="h-16 w-16 text-primary"/>
                </div>
              <CardTitle className="text-2xl font-headline">Welcome to Fit-Pulse</CardTitle>
              <CardDescription>Your personal AI fitness and nutrition coach.</CardDescription>
            </CardHeader>
            <CardContent>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-6">
                    <FormField
                      control={loginForm.control}
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
                      control={loginForm.control}
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
                    <Button type="submit" disabled={isPending} className="w-full">
                      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Login
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value="signup">
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                    <FormField
                      control={signupForm.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Jane Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
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
                      control={signupForm.control}
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
                     <FormField
                        control={signupForm.control}
                        name="medicalConditions"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Any medical conditions? (optional)</FormLabel>
                            <FormControl>
                                <Textarea placeholder="e.g., Diabetes, high BP, allergies" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                       <FormField
                            control={signupForm.control}
                            name="workoutDuration"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Workout time (min)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="e.g., 60" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={signupForm.control}
                            name="workoutDaysPerWeek"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Days / week</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="e.g., 5" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit" disabled={isPending} className="w-full">
                       {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Account
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
