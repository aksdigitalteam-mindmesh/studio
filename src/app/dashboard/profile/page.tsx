"use client";

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Shield, Crown, Cake, ArrowRightLeft, Ruler, Weight } from 'lucide-react';
import Link from 'next/link';

function ProfilePageContent() {
  const searchParams = useSearchParams();
  const isUpgraded = searchParams.get('upgraded') === 'true';
  const [isPremium] = useState(isUpgraded);

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
