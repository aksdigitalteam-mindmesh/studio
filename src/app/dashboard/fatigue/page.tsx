
"use client";

import { useState, useEffect, useTransition, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, Wand } from "lucide-react";
import { generateRecoveryTipsAction } from "@/lib/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { PolarGrid, PolarAngleAxis, Radar, RadarChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";


type FatigueData = Record<string, number>;
const FATIGUE_STORAGE_KEY = 'muscleFatigueData';

const allMuscles = ["chest", "biceps", "abs", "quads", "shoulders", "back", "triceps", "glutes", "hamstrings", "calves"];

const chartConfig = {
  fatigue: {
    label: "Fatigue",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function FatiguePage() {
  const [fatigueData, setFatigueData] = useState<FatigueData>({});
  const [isClient, setIsClient] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [recoveryTips, setRecoveryTips] = useState<{ title: string, description: string }[]>([]);
  const { toast } = useToast();

  const handleDataUpdate = () => {
    const fatigueString = localStorage.getItem(FATIGUE_STORAGE_KEY);
    setFatigueData(fatigueString ? JSON.parse(fatigueString) : {});
  };

  useEffect(() => {
    setIsClient(true);
    handleDataUpdate();

    window.addEventListener('storage', handleDataUpdate);
    return () => {
      window.removeEventListener('storage', handleDataUpdate);
    };
  }, []);

  const chartData = useMemo(() => {
    return allMuscles.map(muscle => ({
      name: muscle.charAt(0).toUpperCase() + muscle.slice(1),
      fatigue: fatigueData[muscle] || 0,
    })).sort((a, b) => b.fatigue - a.fatigue);
  }, [fatigueData]);
  
  const radarChartData = useMemo(() => {
     return allMuscles.map(muscle => ({
      muscle: muscle.charAt(0).toUpperCase() + muscle.slice(1),
      fatigue: fatigueData[muscle] || 0,
    }));
  }, [fatigueData]);

  const handleGenerateTips = () => {
    const fatiguedMuscles = chartData
        .filter(m => m.fatigue > 30) // Get tips for muscles with moderate or higher fatigue
        .map(m => m.name.toLowerCase());

    if (fatiguedMuscles.length === 0) {
        toast({
            title: "No Significant Fatigue",
            description: "You're well-rested! No special recovery tips needed right now.",
        });
        return;
    }

    startTransition(async () => {
        const response = await generateRecoveryTipsAction(fatiguedMuscles);
        if (response.error) {
            toast({
                variant: "destructive",
                title: "Error Generating Tips",
                description: response.error,
            });
        } else if (response.data) {
            setRecoveryTips(response.data.tips);
        }
    });
  };

  const fatigueDescription = "This chart visualizes muscle fatigue based on your completed workouts. Muscles with higher fatigue levels may need more recovery time. Click the button below to get AI-powered recovery tips for your most fatigued areas.";

  return (
    <div className="space-y-8 p-4 md:p-8 pb-24">
       <div>
        <h1 className="text-3xl font-bold font-headline md:text-4xl">Fatigue & Recovery</h1>
        <p className="text-muted-foreground">Monitor muscle fatigue and get recovery advice.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Muscle Fatigue Levels</CardTitle>
          <CardDescription>{fatigueDescription}</CardDescription>
        </CardHeader>
        <CardContent>
            {isClient ? (
                <div className="space-y-4">
                  {chartData.map((muscle) => (
                    <div key={muscle.name}>
                       <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{muscle.name}</span>
                          <span className="text-xs text-muted-foreground">{muscle.fatigue}%</span>
                        </div>
                      <Progress value={muscle.fatigue} />
                    </div>
                  ))}
                </div>
            ) : (
                <div className="flex justify-center items-center h-96">
                    <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                </div>
            )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Fatigue Radar</CardTitle>
          <CardDescription>A holistic view of your muscle recovery balance.</CardDescription>
        </CardHeader>
        <CardContent>
          {isClient ? (
            <ChartContainer config={chartConfig} className="mx-auto w-full max-w-lg h-96">
              <RadarChart data={radarChartData}>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <PolarAngleAxis dataKey="muscle" />
                <PolarGrid />
                <Radar
                  dataKey="fatigue"
                  fill="var(--color-fatigue)"
                  fillOpacity={0.6}
                  dot={{
                    r: 4,
                    fillOpacity: 1,
                  }}
                />
              </RadarChart>
            </ChartContainer>
          ) : (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary"/>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
            <CardHeader>
                <CardTitle className="capitalize flex items-center justify-between">
                    <span>AI Recovery Coach</span>
                </CardTitle>
                <CardDescription>Generate personalized tips for your most fatigued muscles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button onClick={handleGenerateTips} disabled={isPending} className="w-full">
                    {isPending ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Generating...</>
                    ) : (
                        <><Sparkles className="mr-2 h-4 w-4"/> Generate Recovery Tips</>
                    )}
                </Button>

                {recoveryTips.length > 0 && (
                     <Alert>
                        <Wand className="h-4 w-4" />
                        <AlertTitle>AI Recovery Protocol</AlertTitle>
                        <AlertDescription>
                            <ul className="mt-2 space-y-3">
                                {recoveryTips.map(tip => (
                                    <li key={tip.title}>
                                        <h4 className="font-semibold">{tip.title}</h4>
                                        <p className="text-muted-foreground">{tip.description}</p>
                                    </li>
                                ))}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
