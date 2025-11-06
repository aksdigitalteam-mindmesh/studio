
"use client";

import { useState, Suspense, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Shield, Crown, Cake, ArrowRightLeft, Ruler, Weight, Bell, ShoppingCart, Sparkles, Loader2, Sun, Moon, Monitor, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PremiumBadge } from '@/components/premium-badge';
import { usePremiumStatus } from '@/hooks/use-premium-status';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTheme } from '@/components/theme-provider';
import { useAuthContext } from '@/hooks/use-auth';

function ProfilePageContent() {
  const { user, signOutUser } = useAuthContext();
  const { toast } = useToast();
  const { isPremium, isLoading: isPremiumLoading } = usePremiumStatus();
  const { theme, setTheme } = useTheme();

  const [gender, setGender] = useState('male');
  const [workoutReminder, setWorkoutReminder] = useState({ enabled: false, time: '17:00' });
  const [mealReminder, setMealReminder] = useState(false);
  const [shoppingReminder, setShoppingReminder] = useState(false);
  const [motivationalReminder, setMotivationalReminder] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setGender(localStorage.getItem('userGender') || 'male');
    const savedWR = localStorage.getItem('workoutReminder');
    setWorkoutReminder(savedWR ? JSON.parse(savedWR) : { enabled: false, time: '17:00' });
    setMealReminder(localStorage.getItem('mealReminder') === 'true');
    setShoppingReminder(localStorage.getItem('shoppingReminder') === 'true');
    setMotivationalReminder(localStorage.getItem('motivationalReminder') === 'true');
  }, []);

  useEffect(() => {
    if(isClient) localStorage.setItem('userGender', gender);
  }, [gender, isClient]);

  useEffect(() => {
    if(isClient) localStorage.setItem('workoutReminder', JSON.stringify(workoutReminder));
  }, [workoutReminder, isClient]);

  useEffect(() => {
    if(isClient) localStorage.setItem('mealReminder', String(mealReminder));
  }, [mealReminder, isClient]);

  useEffect(() => {
    if(isClient) localStorage.setItem('shoppingReminder', String(shoppingReminder));
  }, [shoppingReminder, isClient]);

  useEffect(() => {
    if(isClient) localStorage.setItem('motivationalReminder', String(motivationalReminder));
  }, [motivationalReminder, isClient]);


  const handleReminderToggle = (enabled: boolean) => {
    if (enabled && Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setWorkoutReminder(prev => ({...prev, enabled: true}));
          toast({ title: "Reminders Enabled", description: "You'll now receive workout notifications." });
        } else {
          toast({ variant: "destructive", title: "Permission Denied", description: "You need to grant permission to enable notifications." });
        }
      });
    } else {
      setWorkoutReminder(prev => ({...prev, enabled: enabled}));
    }
  };

  const scheduleNotification = useCallback(() => {
    if (!workoutReminder.enabled || typeof window === 'undefined' || !('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }
    
    const motivationalMessages = [
      "Time to crush your workout 💥",
      "Your body is waiting, let’s move 🏋️",
      "Let's get that heart pumping! 💪",
      "Rise and grind! It's workout time!",
    ];

    const [hours, minutes] = workoutReminder.time.split(':').map(Number);
    const now = new Date();
    let reminderDate = new Date();
    reminderDate.setHours(hours, minutes, 0, 0);

    if (reminderDate <= now) {
      reminderDate.setDate(reminderDate.getDate() + 1);
    }

    const timeout = reminderDate.getTime() - now.getTime();
    
    const timerId = setTimeout(() => {
       const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
       new Notification('Fit-Pulse Workout Reminder', {
          body: randomMessage,
          icon: '/logo.svg'
       });
    }, timeout);

    return () => clearTimeout(timerId);
  }, [workoutReminder.enabled, workoutReminder.time]);

  useEffect(() => {
    const clearNotificationTimer = scheduleNotification();
    return clearNotificationTimer;
  }, [scheduleNotification]);

  if (isPremiumLoading || !isClient) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-8 pb-24">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-primary/50">
          <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} data-ai-hint="person portrait" />
          <AvatarFallback>
            <User className="h-12 w-12 md:h-16 md:w-16" />
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold font-headline">{user?.displayName || 'Fitness Enthusiast'}</h1>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>
        <Badge variant={isPremium ? 'default' : 'secondary'} className={isPremium ? 'bg-gradient-to-r from-accent to-orange-400 text-accent-foreground' : ''}>
          {isPremium ? <Crown className="mr-2 h-4 w-4" /> : <Shield className="mr-2 h-4 w-4" />}
          {isPremium ? 'Premium Plan' : 'Free Plan'}
        </Badge>
      </div>
       
       <Card>
          <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the app.</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={theme} onValueChange={(value) => setTheme(value as "light" | "dark" | "system")} className="grid grid-cols-3 gap-2 sm:gap-4">
                <div>
                    <RadioGroupItem value="light" id="light" className="peer sr-only" />
                    <Label
                    htmlFor="light"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                        <Sun className="mb-2 h-6 w-6" />
                        Light
                    </Label>
                </div>
                 <div>
                    <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                    <Label
                    htmlFor="dark"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                        <Moon className="mb-2 h-6 w-6" />
                        Dark
                    </Label>
                </div>
                 <div>
                    <RadioGroupItem value="system" id="system" className="peer sr-only" />
                    <Label
                    htmlFor="system"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                        <Monitor className="mb-2 h-6 w-6" />
                        System
                    </Label>
                </div>
            </RadioGroup>
          </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-muted-foreground">
              <User className="h-5 w-5" />
              <span className="font-medium">Gender</span>
            </div>
            <RadioGroup value={gender} onValueChange={setGender} className="flex gap-4">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="font-normal">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="font-normal">Female</Label>
                </div>
            </RadioGroup>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-muted-foreground">
              <Cake className="h-5 w-5" />
              <span className="font-medium">Age</span>
            </div>
            <span className="font-semibold">28</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-muted-foreground">
              <Ruler className="h-5 w-5" />
              <span className="font-medium">Height</span>
            </div>
            <span className="font-semibold">175 cm</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-muted-foreground">
              <Weight className="h-5 w-5" />
              <span className="font-medium">Weight</span>
            </div>
            <span className="font-semibold">72 kg</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2">
                  <Bell className="text-primary"/>
                  Notification Settings
              </CardTitle>
              <CardDescription>Manage your app notifications and reminders.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                  <Label htmlFor="reminder-toggle" className="font-semibold flex-grow">Enable Workout Reminders</Label>
                  <Switch id="reminder-toggle" checked={workoutReminder.enabled} onCheckedChange={handleReminderToggle} />
              </div>
              {workoutReminder.enabled && (
                  <div className="flex items-center justify-between rounded-lg border p-4">
                       <Label htmlFor="reminder-time" className="font-semibold">Reminder Time</Label>
                       <Input 
                          id="reminder-time"
                          type="time" 
                          value={workoutReminder.time}
                          onChange={(e) => setWorkoutReminder(prev => ({...prev, time: e.target.value}))}
                          className="w-32"
                        />
                  </div>
              )}
               <div className="space-y-2 rounded-lg border p-4 relative">
                  {!isPremium && <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 rounded-lg"></div>}
                  <div className="flex items-center justify-between">
                    <Label htmlFor="meal-reminder-toggle" className="font-semibold flex items-center gap-2">
                        Meal Reminders <PremiumBadge className="h-5 px-1.5 text-[10px]" />
                    </Label>
                    <Switch id="meal-reminder-toggle" disabled={!isPremium} checked={mealReminder} onCheckedChange={setMealReminder} />
                  </div>
                  <p className="text-sm text-muted-foreground">Get notified at meal times with meal name & calories.</p>
               </div>
                <div className="space-y-2 rounded-lg border p-4 relative">
                    {!isPremium && <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 rounded-lg"></div>}
                    <div className="flex items-center justify-between">
                        <Label htmlFor="shopping-reminder-toggle" className="font-semibold flex items-center gap-2">
                           <ShoppingCart className="h-4 w-4"/> Shopping Reminders <PremiumBadge className="h-5 px-1.5 text-[10px]" />
                        </Label>
                        <Switch id="shopping-reminder-toggle" disabled={!isPremium} checked={shoppingReminder} onCheckedChange={setShoppingReminder} />
                    </div>
                    <p className="text-sm text-muted-foreground">Reminds you to buy ingredients you haven't purchased.</p>
               </div>
                <div className="space-y-2 rounded-lg border p-4 relative">
                   {!isPremium && <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 rounded-lg"></div>}
                   <div className="flex items-center justify-between">
                        <Label htmlFor="motivational-reminder-toggle" className="font-semibold flex items-center gap-2">
                           <Sparkles className="h-4 w-4"/> Motivational Nudges <PremiumBadge className="h-5 px-1.5 text-[10px]" />
                        </Label>
                        <Switch id="motivational-reminder-toggle" disabled={!isPremium} checked={motivationalReminder} onCheckedChange={setMotivationalReminder} />
                    </div>
                    <p className="text-sm text-muted-foreground">Get a motivational push if you skip a workout or meal.</p>
               </div>
          </CardContent>
      </Card>

      {!isPremium && (
        <Card className="bg-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="text-primary" />
              Unlock Your Full Potential
            </CardTitle>
            <CardDescription>Upgrade to Premium to get access to AI-powered workout and diet plans, advanced analytics, and more.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard/subscription">Upgrade to Premium</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
          <CardHeader>
              <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button asChild variant="outline" className="w-full justify-between">
                <Link href="/dashboard/subscription">
                    <span>Manage Subscription</span>
                    <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                </Link>
            </Button>
            <Button variant="destructive" className="w-full justify-between" onClick={signOutUser}>
                <span>Sign Out</span>
                <LogOut className="h-4 w-4" />
            </Button>
          </CardContent>
      </Card>
    </div>
  );
}


export default function ProfilePage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        }>
            <ProfilePageContent />
        </Suspense>
    )
}
