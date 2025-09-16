
"use client";

import { useState, Suspense, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Shield, Crown, Cake, ArrowRightLeft, Ruler, Weight, Bell, ShoppingCart, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PremiumBadge } from '@/components/premium-badge';

function ProfilePageContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const isUpgraded = searchParams.get('upgraded') === 'true';

  const [isPremium, setIsPremium] = useState(() => {
     if (typeof window === 'undefined') return isUpgraded;
     return isUpgraded || localStorage.getItem('isPremium') === 'true';
  });

  // Notification states
  const [workoutReminder, setWorkoutReminder] = useState(() => {
    if (typeof window === 'undefined') return { enabled: false, time: '17:00' };
    const saved = localStorage.getItem('workoutReminder');
    return saved ? JSON.parse(saved) : { enabled: false, time: '17:00' };
  });
  const [mealReminder, setMealReminder] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('mealReminder') === 'true';
  });
  const [shoppingReminder, setShoppingReminder] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('shoppingReminder') === 'true';
  });
  const [motivationalReminder, setMotivationalReminder] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('motivationalReminder') === 'true';
  });


  useEffect(() => {
    if (isUpgraded) {
      localStorage.setItem('isPremium', 'true');
      setIsPremium(true);
    }
  }, [isUpgraded]);
  
  useEffect(() => {
    localStorage.setItem('workoutReminder', JSON.stringify(workoutReminder));
  }, [workoutReminder]);

  useEffect(() => {
    localStorage.setItem('mealReminder', String(mealReminder));
  }, [mealReminder]);

  useEffect(() => {
    localStorage.setItem('shoppingReminder', String(shoppingReminder));
  }, [shoppingReminder]);
  
  useEffect(() => {
    localStorage.setItem('motivationalReminder', String(motivationalReminder));
  }, [motivationalReminder]);


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

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkoutReminder(prev => ({...prev, time: e.target.value}));
  };
  
  const scheduleNotification = useCallback(() => {
    const motivationalMessages = [
      "Time to crush your workout 💥",
      "Your body is waiting, let’s move 🏋️",
      "Let's get that heart pumping! 💪",
      "Rise and grind! It's workout time!",
    ];

    if (workoutReminder.enabled && 'Notification' in window && Notification.permission === 'granted') {
      const [hours, minutes] = workoutReminder.time.split(':').map(Number);
      const now = new Date();
      const reminderDate = new Date();
      reminderDate.setHours(hours, minutes, 0, 0);

      // If the time is already past, schedule it for tomorrow
      if (reminderDate < now) {
        reminderDate.setDate(reminderDate.getDate() + 1);
      }

      const timeout = reminderDate.getTime() - now.getTime();
      
      const timer = setTimeout(() => {
         const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
         new Notification('FitBoost Workout Reminder', {
            body: randomMessage,
            icon: '/logo.svg' // Make sure you have a logo here
         });
         // Schedule for next day
         scheduleNotification();
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [workoutReminder.enabled, workoutReminder.time]);

  useEffect(() => {
    const clearNotification = scheduleNotification();
    return clearNotification;
  }, [scheduleNotification]);


  const user = {
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
    avatar: 'https://placehold.co/128x128.png',
    age: 28,
    height: '175 cm',
    weight: '72 kg',
  };

  return (
    <div className="space-y-8 p-4 md:p-8 pb-24">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-32 w-32 border-4 border-primary/50">
          <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person portrait" />
          <AvatarFallback>
            <User className="h-16 w-16" />
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h1 className="text-3xl font-bold font-headline">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
        <Badge variant={isPremium ? 'default' : 'secondary'} className={isPremium ? 'bg-gradient-to-r from-accent to-orange-400 text-accent-foreground' : ''}>
          {isPremium ? <Crown className="mr-2 h-4 w-4" /> : <Shield className="mr-2 h-4 w-4" />}
          {isPremium ? 'Premium Plan' : 'Free Plan'}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-muted-foreground">
              <Cake className="h-5 w-5" />
              <span className="font-medium">Age</span>
            </div>
            <span className="font-semibold">{user.age}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-muted-foreground">
              <Ruler className="h-5 w-5" />
              <span className="font-medium">Height</span>
            </div>
            <span className="font-semibold">{user.height}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-muted-foreground">
              <Weight className="h-5 w-5" />
              <span className="font-medium">Weight</span>
            </div>
            <span className="font-semibold">{user.weight}</span>
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
                          onChange={handleTimeChange}
                          className="w-32"
                        />
                  </div>
              )}
              {/* Premium Features */}
               <div className="space-y-2 rounded-lg border p-4 relative">
                  {!isPremium && <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] z-10 rounded-lg"></div>}
                  <div className="flex items-center justify-between">
                    <Label htmlFor="meal-reminder-toggle" className="font-semibold flex items-center gap-2">
                        Meal Reminders <PremiumBadge className="h-5 px-1.5 text-[10px]" />
                    </Label>
                    <Switch id="meal-reminder-toggle" disabled={!isPremium} checked={mealReminder} onCheckedChange={setMealReminder} />
                  </div>
                  <p className="text-sm text-muted-foreground">Get notified at meal times with meal name & calories.</p>
               </div>
                <div className="space-y-2 rounded-lg border p-4 relative">
                    {!isPremium && <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] z-10 rounded-lg"></div>}
                    <div className="flex items-center justify-between">
                        <Label htmlFor="shopping-reminder-toggle" className="font-semibold flex items-center gap-2">
                           <ShoppingCart className="h-4 w-4"/> Shopping Reminders <PremiumBadge className="h-5 px-1.5 text-[10px]" />
                        </Label>
                        <Switch id="shopping-reminder-toggle" disabled={!isPremium} checked={shoppingReminder} onCheckedChange={setShoppingReminder} />
                    </div>
                    <p className="text-sm text-muted-foreground">Reminds you to buy ingredients you haven't purchased.</p>
               </div>
                <div className="space-y-2 rounded-lg border p-4 relative">
                   {!isPremium && <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] z-10 rounded-lg"></div>}
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
          <CardContent>
            <Button variant="outline" className="w-full justify-between">
                <span>Manage Subscription</span>
                <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
            </Button>
          </CardContent>
      </Card>
    </div>
  );
}


export default function ProfilePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProfilePageContent />
        </Suspense>
    )
}

    