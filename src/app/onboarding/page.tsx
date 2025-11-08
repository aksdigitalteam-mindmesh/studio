
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
      fitnessGoal: "weight-loss",
      intensity: "beginner",
    },
  });
  
  useEffect(() => {
    if (!loading && !user) {
        router.replace('/login');
    }
    if (!loading && user && profile?.age) {
        router.replace('/dashboard');
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

  if (loading || !user || (user && profile?.age)) {
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
                      name="fitnessGoal"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>What is your primary fitness goal?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="weight-loss" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Weight Loss
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="build-muscle" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Build Muscle
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="endurance" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Improve Endurance
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="intensity"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>What is your current fitness level?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="beginner" />
                                </FormControl>
                                <FormLabel className="font-normal">Beginner</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="intermediate" />
                                </FormControl>
                                <FormLabel className="font-normal">Intermediate</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="advanced" />
                                </FormControl>
                                <FormLabel className="font-normal">Advanced</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
