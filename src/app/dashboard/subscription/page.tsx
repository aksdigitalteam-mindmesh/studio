"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { CheckCircle2, Ticket, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SubscriptionPage({ searchParams }: { searchParams: { success?: string } }) {
  const router = useRouter();

  const handleUpgrade = () => {
    // In a real app, you'd handle payment here.
    // We'll simulate success by redirecting with a query param.
    router.push("/dashboard/progress?upgraded=true");
  };

  return (
    <div className="space-y-8 p-4 md:p-8 pb-24">
      <div>
        <h1 className="text-3xl font-bold font-headline md:text-4xl">Subscription</h1>
        <p className="text-muted-foreground">Manage your membership and unlock premium features.</p>
      </div>

      <Card className="bg-gradient-to-r from-primary/10 via-background to-background">
        <CardHeader className="grid gap-2 md:grid-cols-3">
          <div className="md:col-span-2">
            <CardTitle className="font-headline text-2xl">Current Plan: Free Tier</CardTitle>
            <CardDescription>Upgrade to Premium to unlock AI features and remove ads.</CardDescription>
          </div>
          <div className="flex items-center justify-start md:justify-end">
            <div className="flex items-center gap-2 font-bold text-lg">
                <Icons.Subscription className="h-6 w-6 text-primary" />
                <span>Your Fit-Coins: 275</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Earn Fit-Coins</CardTitle>
            <CardDescription>Complete tasks to earn coins and get your membership for free!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-semibold">Watch an ad</p>
                <p className="text-sm text-muted-foreground">Earn 10 coins per ad view.</p>
              </div>
              <Button variant="outline"><Ticket className="mr-2 h-4 w-4" /> Watch Ad</Button>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-semibold">Burn calories</p>
                <p className="text-sm text-muted-foreground">Earn 25 coins for every 250 calories burnt.</p>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <Trophy className="h-5 w-5" />
                <span className="font-semibold">Keep working out!</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Premium Membership</CardTitle>
            <CardDescription>Get full access to FitBoost features.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> AI Workout Generator</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> AI Diet Plan Generator</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Ad-free experience</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Advanced statistics</li>
            </ul>
             <Button className="w-full" onClick={handleUpgrade}>
                Upgrade Now <span className="ml-2 font-light text-primary-foreground/80"> (750 Fit-Coins / week)</span>
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
