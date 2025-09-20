
"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PremiumBadge } from "@/components/premium-badge";
import WorkoutGeneratorPage from "../workout-generator/page";
import DietGeneratorPage from "../diet-generator/page";
import { Lock, Loader2, Info } from "lucide-react";
import { usePremiumStatus } from "@/hooks/use-premium-status";
import { useUsageTracker } from "@/hooks/use-usage-tracker";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


function ProgramsPageContent() {
  const { isPremium, isLoading } = usePremiumStatus();
  const { usagesLeft } = useUsageTracker();

  if (isLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-8 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline md:text-4xl">AI Programs</h1>
          <p className="text-muted-foreground">Your personal AI coach for fitness and nutrition.</p>
        </div>
        <PremiumBadge />
      </div>

      {!isPremium ? (
        <Card className="relative">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-8 text-center rounded-lg">
              <Lock className="h-12 w-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold font-headline mb-2">Unlock AI Programs</h2>
              <p className="text-muted-foreground mb-6">Upgrade to a premium membership to get personalized workout and diet plans from our AI coach.</p>
              <Button asChild>
                <Link href="/dashboard/subscription">Upgrade to Premium</Link>
              </Button>
          </div>
          
          <div className="blur-sm pointer-events-none">
            <Tabs defaultValue="workout" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="workout">Workout Generator</TabsTrigger>
                <TabsTrigger value="diet">Diet Generator</TabsTrigger>
              </TabsList>
              <TabsContent value="workout">
                <WorkoutGeneratorPage />
              </TabsContent>
              <TabsContent value="diet">
                <DietGeneratorPage />
              </TabsContent>
            </Tabs>
          </div>

        </Card>
      ) : (
        <>
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Weekly AI Usage</AlertTitle>
                <AlertDescription>
                    You have <strong>{usagesLeft} of 6</strong> AI generations remaining this week. The count will reset in 7 days after your first use.
                </AlertDescription>
            </Alert>

            <Tabs defaultValue="workout" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="workout">Workout Generator</TabsTrigger>
                <TabsTrigger value="diet">Diet Generator</TabsTrigger>
            </TabsList>
            <TabsContent value="workout">
                <WorkoutGeneratorPage />
            </TabsContent>
            <TabsContent value="diet">
                <DietGeneratorPage />
            </TabsContent>
            </Tabs>
        </>
      )}
    </div>
  );
}

export default function ProgramsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    }>
      <ProgramsPageContent />
    </Suspense>
  )
}
