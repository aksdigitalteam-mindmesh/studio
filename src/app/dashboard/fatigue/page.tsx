
"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MuscleFatigueDiagram, type Muscle } from "@/components/muscle-fatigue-diagram";
import { Loader2, Sparkles, Wand } from "lucide-react";
import { generateRecoveryTipsAction } from "@/lib/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

type FatigueData = Record<string, number>;
const FATIGUE_STORAGE_KEY = 'muscleFatigueData';
const GENDER_STORAGE_KEY = 'userGender';

export default function FatiguePage() {
  const [fatigueData, setFatigueData] = useState<FatigueData>({});
  const [gender, setGender] = useState<"male" | "female">("male");
  const [selectedMuscle, setSelectedMuscle] = useState<Muscle | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [recoveryTips, setRecoveryTips] = useState<{ title: string, description: string }[]>([]);
  const { toast } = useToast();

  const handleDataUpdate = () => {
    const fatigueString = localStorage.getItem(FATIGUE_STORAGE_KEY);
    setFatigueData(fatigueString ? JSON.parse(fatigueString) : {});
    setGender((localStorage.getItem(GENDER_STORAGE_KEY) as "male" | "female") || 'male');
  };

  useEffect(() => {
    setIsClient(true);
    handleDataUpdate();

    window.addEventListener('storage', handleDataUpdate);
    return () => {
      window.removeEventListener('storage', handleDataUpdate);
    };
  }, []);

  const handleMuscleClick = (muscle: Muscle) => {
    setSelectedMuscle(prev => prev === muscle ? null : muscle);
    setRecoveryTips([]);
  };

  const handleGenerateTips = () => {
    if (!selectedMuscle) return;

    startTransition(async () => {
        const response = await generateRecoveryTipsAction([selectedMuscle]);
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

  const getFatigueLevel = (muscle: Muscle | null): string => {
    if (!muscle) return "None";
    const level = fatigueData[muscle] || 0;
    if (level >= 80) return "Very High";
    if (level >= 50) return "High";
    if (level >= 30) return "Moderate";
    if (level >= 10) return "Low";
    return "None";
  };
  
  const fatigueDescription = "This diagram visualizes muscle fatigue based on your completed workouts. Muscles recover over time. Click a muscle group to get AI-powered recovery tips.";

  return (
    <div className="space-y-8 p-4 md:p-8 pb-24">
       <div>
        <h1 className="text-3xl font-bold font-headline md:text-4xl">Fatigue & Recovery</h1>
        <p className="text-muted-foreground">Monitor muscle fatigue and get recovery advice.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Muscle Fatigue Diagram</CardTitle>
          <CardDescription>{fatigueDescription}</CardDescription>
        </CardHeader>
        <CardContent>
            {isClient ? (
                <MuscleFatigueDiagram fatiguedMuscles={fatigueData} gender={gender} onMuscleClick={handleMuscleClick} selectedMuscle={selectedMuscle}/>
            ) : (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                </div>
            )}
             <div className="flex justify-center pt-4">
                <RadioGroup value={gender} onValueChange={(val) => setGender(val as "male" | "female")} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Female</Label>
                    </div>
                </RadioGroup>
            </div>
        </CardContent>
      </Card>
      
      {selectedMuscle && (
        <Card>
            <CardHeader>
                <CardTitle className="capitalize flex items-center justify-between">
                    <span>{selectedMuscle} Recovery</span>
                    <span className="text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">{getFatigueLevel(selectedMuscle)}</span>
                </CardTitle>
                <CardDescription>Fatigue Level: {fatigueData[selectedMuscle] || 0}%</CardDescription>
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
      )}
    </div>
  );
}
