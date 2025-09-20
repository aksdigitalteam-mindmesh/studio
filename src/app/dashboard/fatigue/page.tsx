
"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Muscle } from "@/components/muscle-fatigue-diagram";
import { Hand, Loader2, BrainCircuit, Lightbulb } from "lucide-react";
import { generateRecoveryTips } from "@/ai/flows/generate-recovery-tips";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

type FatigueData = Partial<Record<Muscle, number>>;
type RecoveryTip = { title: string; description: string };

const FATIGUE_STORAGE_KEY = 'muscleFatigueData';

const initialFatigueData: FatigueData = {
  shoulders: 35,
  chest: 55,
  biceps: 60,
  abs: 45,
  quads: 75,
  triceps: 15,
  back: 25,
  glutes: 85,
  hamstrings: 20,
  calves: 10,
};

const muscleGroupDetails: Record<Muscle, { name: string; lastTrained: string }> = {
    shoulders: { name: 'Shoulders', lastTrained: 'Upper Body Day - 2 days ago' },
    chest: { name: 'Chest', lastTrained: 'Push Day - 1 day ago' },
    biceps: { name: 'Biceps', lastTrained: 'Pull Day - 3 days ago' },
    abs: { name: 'Abs', lastTrained: 'Core Blast - 1 day ago' },
    quads: { name: 'Quads', lastTrained: 'Leg Day - 4 days ago' },
    back: { name: 'Back', lastTrained: 'Pull Day - 3 days ago' },
    triceps: { name: 'Triceps', lastTrained: 'Push Day - 1 day ago' },
    glutes: { name: 'Glutes', lastTrained: 'Leg Day - 4 days ago' },
    hamstrings: { name: 'Hamstrings', lastTrained: 'Leg Day - 4 days ago' },
    calves: { name: 'Calves', lastTrained: 'Full Body - 5 days ago' },
};

const fatigueLegend = [
    { color: "bg-red-500", label: "80-100%: Max fatigue, rest needed" },
    { color: "bg-orange-500", label: "50-79%: High fatigue, consider lighter activity" },
    { color: "bg-yellow-400", label: "30-49%: Moderate fatigue, ready for some work" },
    { color: "bg-blue-500", label: "10-29%: Low fatigue, ready to train" },
    { color: "bg-muted", label: "0-9%: Fully recovered" },
];

export default function FatigueTrackerPage() {
  const [fatigueData, setFatigueData] = useState<FatigueData>({});
  const [isClient, setIsClient] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [recoveryTips, setRecoveryTips] = useState<RecoveryTip[] | null>(null);
  const [isTipsDialogOpen, setIsTipsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const loadFatigueData = () => {
      const savedFatigueData = localStorage.getItem(FATIGUE_STORAGE_KEY);
      if (savedFatigueData) {
        try {
            const parsedData = JSON.parse(savedFatigueData);
            setFatigueData(parsedData);
        } catch {
            setFatigueData(initialFatigueData);
        }
      } else {
        setFatigueData(initialFatigueData);
      }
    }
    loadFatigueData();
    window.addEventListener('storage', loadFatigueData);
    return () => window.removeEventListener('storage', loadFatigueData);
  }, []);

  const handleGetRecoveryTips = () => {
    const mostFatigued = Object.entries(fatigueData)
        .filter(([, value]) => value > 50)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([muscle]) => muscleGroupDetails[muscle as Muscle].name);
    
    if (mostFatigued.length === 0) {
        toast({
            title: "You're not significantly fatigued!",
            description: "No need for special recovery tips right now. Keep up the great work!",
        });
        return;
    }

    startTransition(async () => {
        const result = await generateRecoveryTips({ fatiguedMuscles: mostFatigued });
        setRecoveryTips(result.tips);
        setIsTipsDialogOpen(true);
    });
  }

  const highFatigueMuscle = isClient ? Object.entries(fatigueData).find(([, value]) => value > 70) : undefined;

  const getProgressColor = (value: number) => {
    if (value >= 80) return "bg-red-500";
    if (value >= 50) return "bg-orange-500";
    if (value >= 30) return "bg-yellow-400";
    if (value >= 10) return "bg-blue-500";
    return "bg-primary";
  };

  return (
    <div className="space-y-8 p-4 md:p-8 pb-24">
      <div>
        <h1 className="text-3xl font-bold font-headline md:text-4xl">Fatigue Tracker</h1>
        <p className="text-muted-foreground">Visualize your muscle recovery and train smarter.</p>
      </div>
      
      {isClient && highFatigueMuscle && (
        <Alert variant="destructive">
          <Hand className="h-5 w-5"/>
          <AlertTitle>High Fatigue Warning!</AlertTitle>
          <AlertDescription>
            Your {muscleGroupDetails[highFatigueMuscle[0] as Muscle].name} are at {highFatigueMuscle[1]}% fatigue. Consider resting this muscle group to prevent injury.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-8 lg:grid-cols-1">
        <div className="space-y-4">
             <Card>
                <CardHeader>
                    <CardTitle>Fatigue Legend</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {fatigueLegend.map(item => (
                        <div key={item.label} className="flex items-center gap-3">
                            <div className={`h-4 w-4 rounded-full ${item.color}`}></div>
                            <span className="text-sm text-muted-foreground">{item.label}</span>
                        </div>
                    ))}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Detailed Muscle Groups</CardTitle>
                    <CardDescription>Breakdown of fatigue for each muscle group.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                {isClient ? (Object.entries(fatigueData)
                    .sort(([, a], [, b]) => b - a)
                    .map(([muscle, value]) => (
                    <div key={muscle} className="space-y-1">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium">{muscleGroupDetails[muscle as Muscle].name}</span>
                        <span className="text-muted-foreground">{value}%</span>
                    </div>
                    <Progress value={value} indicatorClassName={getProgressColor(value || 0)} />
                    </div>
                ))) : (
                    <div className="flex justify-center items-center p-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground"/>
                    </div>
                )}
                </CardContent>
            </Card>

            <Button onClick={handleGetRecoveryTips} disabled={isPending} className="w-full">
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                    </>
                ) : (
                    <>
                        <BrainCircuit className="mr-2 h-4 w-4" />
                        Get Fast Recovery Tips
                    </>
                )}
            </Button>
        </div>
      </div>
       <Dialog open={isTipsDialogOpen} onOpenChange={setIsTipsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><Lightbulb className="text-primary"/> AI Recovery Tips</DialogTitle>
              <DialogDescription>
                Here are some personalized tips to help you recover based on your fatigue levels.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {recoveryTips?.map(tip => (
                    <div key={tip.title} className="p-4 rounded-lg bg-muted/50">
                        <h3 className="font-semibold">{tip.title}</h3>
                        <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                ))}
            </div>
             <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
          </DialogContent>
        </Dialog>
    </div>
  );
}
