
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { onboardingSchema } from "@/lib/schemas";
import { useAuthContext } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/icons";

export default function OnboardingPage() {
  const { user, profile, loading, updateUserProfile, refreshProfile } = useAuthContext();
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      age: 25,
      height: 175,
      weight: 70,
    },
  });
  
  // If user is not logged in or has already completed onboarding, redirect them
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (profile && profile.age && profile.height && profile.weight) {
        router.replace('/dashboard');
      }
    }
  }, [user, profile, loading, router]);


  function onSubmit(values: z.infer<typeof onboardingSchema>) {
    if (!user) {
        toast({ variant: "destructive", title: "Not authenticated", description: "You must be logged in to update your profile." });
        return;
    }
    startTransition(async () => {
      const error = await updateUserProfile(user.uid, values);
      if (error) {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: error,
        });
      } else {
        toast({
          title: "Profile Updated!",
          description: "Let's get started on your fitness journey.",
        });
        refreshProfile(); // Refresh profile to get new data
        router.push("/dashboard");
      }
    });
  }

  if (loading || !user || (profile && profile.age)) {
     return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
             <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                    <Icons.Logo className="h-16 w-16 text-primary"/>
                </div>
              <CardTitle className="text-2xl font-headline">Just a few more details...</CardTitle>
              <CardDescription>This will help us personalize your experience.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 25" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Height (in cm)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 175" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Weight (in kg)</FormLabel>
                        <FormControl>
                            <Input type="number" step="0.1" placeholder="e.g., 70.5" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? (
                        <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                        </>
                    ) : "Continue to Dashboard"}
                    </Button>
                </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
}
