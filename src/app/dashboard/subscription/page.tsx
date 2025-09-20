
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { Ticket, Trophy, Zap, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SubscriptionPage({ searchParams }: { searchParams: { success?: string } }) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(23 * 3600 + 59 * 60 + 59); // 23:59:59

  useEffect(() => {
    if (timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "Offer expired!";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };


  const handleUpgrade = () => {
    // In a real app, you'd handle payment here (e.g., Stripe).
    // For this simulation, we'll set the subscription status in localStorage
    // by redirecting with a query parameter that our hook will detect.
    router.push("/dashboard/programs?upgraded=true");
  };

  const premiumFeatures = [
      {
          icon: Icons.Rocket,
          title: "AI Workout Generator",
          description: "Get hyper-personalized workout plans."
      },
      {
          icon: Icons.Diet,
          title: "AI Diet Planner",
          description: "Custom meal plans to meet your goals."
      },
      {
          icon: Icons.Analytics,
          title: "Advanced Analytics",
          description: "Unlock deeper insights into your progress."
      },
      {
          icon: Icons.AdFree,
          title: "Ad-Free Experience",
          description: "Enjoy the app without interruptions."
      }
  ]

  return (
    <div className="space-y-8 p-4 md:p-8 pb-24">
      <div>
        <h1 className="text-3xl font-bold font-headline md:text-4xl">Go Premium</h1>
        <p className="text-muted-foreground">Unlock your full potential with FitBoost Premium.</p>
      </div>
      
       <Alert className="border-accent/50 bg-accent/10 text-accent-foreground">
          <Zap className="h-5 w-5 text-accent" />
          <AlertTitle className="font-bold">Limited-Time Offer!</AlertTitle>
          <AlertDescription>
            <div className="flex flex-col sm:flex-row justify-between items-center">
                <p>⚡ Beta users get <strong>15% off</strong> the first month of Premium. Don't miss out!</p>
                <div className="flex items-center gap-2 mt-2 sm:mt-0 font-mono text-sm sm:text-base font-bold bg-accent/20 px-3 py-1 rounded-md">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(timeLeft)}</span>
                </div>
            </div>
          </AlertDescription>
        </Alert>

      <div className="grid gap-8 lg:grid-cols-2">
         <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">Premium Membership</CardTitle>
            <CardDescription>Get full access to all FitBoost features for one month.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-between space-y-4">
            <ul className="space-y-4 text-sm">
              {premiumFeatures.map(feature => (
                  <li key={feature.title} className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <feature.icon className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="font-semibold text-foreground">{feature.title}</p>
                        <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </li>
              ))}
            </ul>
             <Button className="w-full mt-4 bg-gradient-to-r from-accent to-orange-400 text-accent-foreground font-bold hover:opacity-90 transition-opacity" onClick={handleUpgrade}>
                Upgrade Now <span className="ml-2 font-light text-primary-foreground/80"> (750 Fit-Coins / week)</span>
             </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Earn Fit-Coins</CardTitle>
            <CardDescription>Complete tasks to earn coins and get your membership for free!</CardDescription>
             <div className="pt-4">
                 <div className="flex items-center gap-2 font-bold text-lg">
                    <Icons.Subscription className="h-6 w-6 text-primary" />
                    <span>Your Fit-Coins: 275</span>
                </div>
            </div>
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
      </div>
    </div>
  );
}
