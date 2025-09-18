
"use client";

import { cn } from "@/lib/utils";

export type Muscle = "chest" | "biceps" | "abs" | "quads" | "shoulders" | "back" | "triceps" | "glutes" | "hamstrings" | "calves";

interface MuscleFatigueDiagramProps {
  fatiguedMuscles: Partial<Record<Muscle, number>>; // Value from 0 to 100
}

export function MuscleFatigueDiagram({ fatiguedMuscles }: MuscleFatigueDiagramProps) {
  
  const getMuscleStyle = (muscle: Muscle) => {
    const intensity = fatiguedMuscles[muscle] || 0;
    
    let color = 'transparent';
    if (intensity >= 80) color = 'hsl(0, 100%, 50%)';      // Red
    else if (intensity >= 50) color = 'hsl(30, 100%, 50%)'; // Orange
    else if (intensity >= 30) color = 'hsl(54, 100%, 50%)'; // Yellow
    else if (intensity >= 10) color = 'hsl(211, 100%, 50%)';// Blue
    
    if (intensity < 10) {
      return { fill: "transparent", stroke: "hsl(var(--muted-foreground) / 0.2)", strokeWidth: 1 };
    }

    return {
      fill: color,
      stroke: color,
      strokeWidth: 1,
      opacity: intensity / 100 * 0.8 + 0.2, // Min opacity 0.2, max 1.0
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
        {/* Base Body Shape */}
        <g fill="hsl(var(--muted-foreground) / 0.1)">
            {/* Head */}
            <circle cx="100" cy="40" r="20" />
            
            {/* Torso */}
            <path d="M80,60 L120,60 L125,150 L75,150 Z" />
            
            {/* Arms */}
            <path d="M80,65 L60,140 L75,145 L85,70 Z" />
            <path d="M120,65 L140,140 L125,145 L115,70 Z" />
            
            {/* Legs */}
            <path d="M75,150 L65,280 L90,280 L95,150 Z" />
            <path d="M125,150 L135,280 L110,280 L105,150 Z" />
            {/* Calves */}
            <path d="M65,280 L90,280 L85,350 L70,350 Z" />
            <path d="M110,280 L135,280 L130,350 L115,350 Z" />
        </g>

        {/* --- Muscle Highlights --- */}
        <g>
          {/* Shoulders */}
          <path d="M80,60 Q100,55 120,60 L115,70 Q100,65 85,70 Z" style={getMuscleStyle("shoulders")} />

          {/* Chest */}
          <path d="M85,75 H115 L110,100 H90 Z" style={getMuscleStyle("chest")} />

          {/* Abs */}
          <path d="M90,105 H110 L105,145 H95 Z" style={getMuscleStyle("abs")} />

          {/* Biceps */}
          <path d="M68,80 C75,90 78,110 70,120 L60,110 C68,100 65,85 68,80 Z" style={getMuscleStyle("biceps")} />
          <path d="M132,80 C125,90 122,110 130,120 L140,110 C132,100 135,85 132,80 Z" style={getMuscleStyle("biceps")} />
          
          {/* Triceps (approximated on the side of the arm) */}
          <path d="M60,90 L63,130 L58,125 L55,95 Z" style={getMuscleStyle("triceps")} />
          <path d="M140,90 L137,130 L142,125 L145,95 Z" style={getMuscleStyle("triceps")} />

          {/* Back (approximated as part of torso) */}
           <path d="M85,70 L115,70 L115,140 L85,140 Z" style={getMuscleStyle("back")} />

          {/* Quads */}
          <path d="M75,150 L95,150 L90,220 L70,220 Z" style={getMuscleStyle("quads")} />
          <path d="M105,150 L125,150 L130,220 L110,220 Z" style={getMuscleStyle("quads")} />
          
          {/* Hamstrings (approximated on back of leg) */}
          <path d="M70,225 L90,225 L90,275 L70,275 Z" style={getMuscleStyle("hamstrings")} />
          <path d="M110,225 L130,225 L130,275 L110,275 Z" style={getMuscleStyle("hamstrings")} />

          {/* Glutes (approximated) */}
          <path d="M80,140 C100,160 120,140 120,140 L125,155 L75,155 Z" style={getMuscleStyle("glutes")} />

          {/* Calves */}
          <path d="M70,285 L85,285 L80,345 L70,340 Z" style={getMuscleStyle("calves")} />
          <path d="M115,285 L130,285 L130,340 L120,345 Z" style={getMuscleStyle("calves")} />
        </g>

      </svg>
    </div>
  );
}
