
"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BrainCircuit, BarChart3, Dumbbell } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { WorkoutLog } from "@/components/activity/workout-log";
import { ProgressTracker } from "@/components/activity/progress-tracker";

// --- Types ---
type View = "hub" | "workout" | "progress";

// --- Main Hub Component ---
function HubView({ setView }: { setView: (view: View) => void }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const bubbleCommonClass = "w-32 h-32 rounded-full flex flex-col items-center justify-center text-center p-2 text-primary-foreground shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl";

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center overflow-hidden">
            <h1 className={cn("text-3xl font-bold font-headline md:text-4xl transition-opacity duration-500", isMounted ? "opacity-100" : "opacity-0")}>Activity Hub</h1>
            <p className={cn("text-muted-foreground mb-12 transition-opacity duration-500 delay-200", isMounted ? "opacity-100" : "opacity-0")}>
                Track your workouts and monitor your progress.
            </p>
            <div className="relative w-full max-w-xs h-72 flex items-center justify-center">
                 <button
                    onClick={() => setView('workout')}
                    className={cn(
                        bubbleCommonClass,
                        "absolute bg-gradient-to-br from-blue-500 to-cyan-500 hover:shadow-blue-400/40 hover:scale-105",
                        isMounted ? "opacity-100 -translate-y-4" : "opacity-0 -translate-y-0"
                    )}
                    style={{ top: '0', left: '50%', transform: 'translateX(-50%)', transitionDelay: '200ms' }}
                >
                    <Dumbbell className="h-10 w-10" />
                    <span className="font-bold mt-2 text-sm">Start Workout</span>
                </button>

                <button
                    onClick={() => setView('progress')}
                    className={cn(
                        bubbleCommonClass,
                        "absolute bg-gradient-to-br from-green-400 to-emerald-500 hover:shadow-green-400/40 hover:scale-105",
                         isMounted ? "opacity-100 translate-y-4 -translate-x-4" : "opacity-0"
                    )}
                    style={{ bottom: '0', left: '0', transitionDelay: '400ms' }}
                >
                    <BarChart3 className="h-10 w-10" />
                    <span className="font-bold mt-2 text-sm">Progress</span>
                </button>
                
                 <Link
                    href="/dashboard/programs?tab=workout"
                    className={cn(
                        bubbleCommonClass,
                        "absolute bg-gradient-to-br from-purple-500 to-indigo-600 hover:shadow-purple-400/40 hover:scale-105",
                        isMounted ? "opacity-100 translate-y-4 translate-x-4" : "opacity-0"
                    )}
                    style={{ bottom: '0', right: '0', transitionDelay: '600ms' }}
                >
                    <BrainCircuit className="h-10 w-10" />
                    <span className="font-bold mt-2 text-sm">AI Coach</span>
                </Link>
            </div>
        </div>
    );
};


// --- Main Page Component ---
function ActivityPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialView = searchParams.get("view") as View | null;
  const [view, setView] = useState<View>("hub");

  useEffect(() => {
    // Only set view from params on initial load if it's valid
    if (initialView && ["hub", "workout", "progress"].includes(initialView)) {
      setView(initialView);
    }
  }, [initialView]);

  const handleSetView = useCallback((newView: View) => {
      setView(newView);
      router.push(`/dashboard/workout?view=${newView}`, { scroll: false });
  }, [router]);

  const handleGoToHub = () => {
    setView('hub');
    router.push('/dashboard/workout', { scroll: false });
  }

  const PageContent = () => {
    switch (view) {
      case "workout":
        return <WorkoutLog />;
      case "progress":
        return <ProgressTracker />;
      default:
        return <HubView setView={handleSetView} />;
    }
  };

  return (
     <div className="p-4 md:p-8 space-y-8 pb-24">
        {view !== 'hub' && (
            <Button variant="outline" onClick={handleGoToHub}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Activity Hub
            </Button>
        )}
        <PageContent />
     </div>
  )
}

export default function WorkoutPage() {
    return (
        <Suspense>
            <ActivityPage />
        </Suspense>
    )
}

    