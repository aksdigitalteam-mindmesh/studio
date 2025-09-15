"use client";

import { cn } from "@/lib/utils";

type Muscle = "chest" | "biceps" | "abs" | "quads" | "shoulders" | "back" | "triceps" | "glutes" | "hamstrings" | "calves";

interface MuscleFatigueDiagramProps {
  fatiguedMuscles: Partial<Record<Muscle, number>>; // Value from 0 to 1
}

export function MuscleFatigueDiagram({ fatiguedMuscles }: MuscleFatigueDiagramProps) {
  const getMuscleStyle = (muscle: Muscle) => {
    const intensity = fatiguedMuscles[muscle] || 0;
    if (intensity === 0) return { fill: "transparent" };
    return {
      fill: `hsl(var(--primary) / ${intensity})`,
      stroke: `hsl(var(--primary))`,
      strokeWidth: 1,
    };
  };

  return (
    <div className="flex justify-center items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 400"
        className="max-w-xs"
        aria-label="Muscle fatigue diagram"
      >
        {/* Head */}
        <circle cx="100" cy="40" r="20" fill="hsl(var(--muted-foreground) / 0.1)" />
        
        {/* Torso */}
        <path d="M80,60 L120,60 L125,150 L75,150 Z" fill="hsl(var(--muted-foreground) / 0.1)" />
        
        {/* Arms */}
        <path d="M80,65 L60,140 L75,145 L85,70 Z" fill="hsl(var(--muted-foreground) / 0.1)" />
        <path d="M120,65 L140,140 L125,145 L115,70 Z" fill="hsl(var(--muted-foreground) / 0.1)" />
        
        {/* Legs */}
        <path d="M75,150 L65,280 L90,280 L95,150 Z" fill="hsl(var(--muted-foreground) / 0.1)" />
        <path d="M125,150 L135,280 L110,280 L105,150 Z" fill="hsl(var(--muted-foreground) / 0.1)" />

        {/* --- Muscle Highlights --- */}

        {/* Shoulders */}
        <path d="M80,60 Q100,55 120,60 L115,70 Q100,65 85,70 Z" style={getMuscleStyle("shoulders")} />

        {/* Chest */}
        <path d="M85,75 H115 L110,100 H90 Z" style={getMuscleStyle("chest")} />

        {/* Abs */}
        <path d="M90,105 H110 L105,145 H95 Z" style={getMuscleStyle("abs")} />

        {/* Biceps */}
        <path d="M68,80 C75,90 78,110 70,120 L60,110 C68,100 65,85 68,80 Z" style={get_muscle_style("biceps")} />
        <path d="M132,80 C125,90 122,110 130,120 L140,110 C132,100 135,85 132,80 Z" style={get_muscle_style("biceps")} />

        {/* Quads */}
        <path d="M75,150 L95,150 L90,220 L70,220 Z" style={getMuscleStyle("quads")} />
        <path d_1="M105,150 L125,150 L130,220 L110,220 Z" style={getMuscleStyle("quads")} />

      </svg>
    </div>
  );
}
