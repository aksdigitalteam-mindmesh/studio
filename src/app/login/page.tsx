
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export default function LoginPage() {
  const { user, loading, signUpWithEmail, signInWithEmail, sendPasswordReset } = useAuthContext();
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState("login");
  const [isForgotPassDialogOpen, setIsForgotPassDialogOpen] = useState(false);

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
      gender: "male",
      medicalConditions: "",
      workoutDuration: 60,
      workoutDaysPerWeek: 4,
      age: 25,
      height: 175,
      weight: 70,
      targetWeight: 65,
      fitnessGoal: "weight-loss",
      intensity: "medium",
    },
  });
  
  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
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
        router.push('/dashboard');
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
            router.push('/dashboard');
        }
    });
  }
  
  const handleForgotPassword = async (values: z.infer<typeof forgotPasswordSchema>) => {
    startTransition(async () => {
        const error = await sendPasswordReset(values.email);
        if (error) {
             toast({
                variant: "destructive",
                title: "Failed to send email",
                description: error,
            });
        } else {
            toast({
                title: "Password Reset Email Sent",
                description: "Please check your inbox for instructions to reset your password.",
            });
            setIsForgotPassDialogOpen(false);
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
      <Dialog open={isForgotPassDialogOpen} onOpenChange={setIsForgotPassDialogOpen}>
      <Tabs value={tab} onValueChange={setTab} className="w-full max-w-lg">
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
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
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
                     <div className="text-right">
                        <DialogTrigger asChild>
                            <Button type="button" variant="link" className="p-0 h-auto font-normal">
                                Forgot password?
                            </Button>
                        </DialogTrigger>
                    </div>
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
                      name="gender"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Gender</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-row space-x-4"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl><RadioGroupItem value="male" /></FormControl>
                                <FormLabel className="font-normal">Male</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl><RadioGroupItem value="female" /></FormControl>
                                <FormLabel className="font-normal">Female</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl><RadioGroupItem value="other" /></FormControl>
                                <FormLabel className="font-normal">Other</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <FormField
                            control={signupForm.control}
                            name="age"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Age</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="25" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={signupForm.control}
                            name="height"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Height (cm)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="175" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={signupForm.control}
                            name="weight"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Weight (kg)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="70" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                         <FormField
                            control={signupForm.control}
                            name="fitnessGoal"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Primary Goal</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your goal" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    <SelectItem value="weight-loss">Weight Loss</SelectItem>
                                    <SelectItem value="build-muscle">Build Muscle</SelectItem>
                                    <SelectItem value="endurance">Improve Endurance</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        <FormField
                            control={signupForm.control}
                            name="targetWeight"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Target Weight (kg)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="65" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                     </div>
                      <FormField
                          control={signupForm.control}
                          name="intensity"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Your Fitness Level</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="low" /></FormControl>
                                    <FormLabel className="font-normal">Beginner (Low)</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="medium" /></FormControl>
                                    <FormLabel className="font-normal">Intermediate (Medium)</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="high" /></FormControl>
                                    <FormLabel className="font-normal">Advanced (High)</FormLabel>
                                  </FormItem>
                                </RadioGroup>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Forgot Password</DialogTitle>
            <DialogDescription>
              Enter your email address below and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          <Form {...forgotPasswordForm}>
            <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)} className="space-y-4">
              <FormField
                control={forgotPasswordForm.control}
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
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsForgotPassDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Reset Link
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

    