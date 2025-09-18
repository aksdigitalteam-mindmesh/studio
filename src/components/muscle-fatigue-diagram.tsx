
"use client";

import { cn } from "@/lib/utils";

export type Muscle = "chest" | "biceps" | "abs" | "quads" | "shoulders" | "back" | "triceps" | "glutes" | "hamstrings" | "calves";

interface MuscleFatigueDiagramProps {
  fatiguedMuscles: Partial<Record<Muscle, number>>; // Value from 0 to 100
  gender?: "male" | "female";
}

const MaleDiagram = ({ getMuscleStyle }: { getMuscleStyle: (muscle: Muscle) => any }) => (
    <g>
        {/* Base Body */}
        <g fill="hsl(var(--muted-foreground) / 0.1)" stroke="hsl(var(--muted-foreground) / 0.2)" strokeWidth="0.5">
            {/* Head */}
            <path d="M90 40 a 10 12 0 1 1 20 0 a 10 12 0 1 1 -20 0" />
            {/* Neck */}
            <path d="M95 52 L93 60 L107 60 L105 52 Z" />
            {/* Torso */}
            <path d="M80 62 L120 62 L125 120 L75 120 Z" />
            {/* Legs */}
            <path d="M75 120 L70 200 L95 200 L95 120 Z" />
            <path d="M105 120 L105 200 L130 200 L125 120 Z" />
            {/* Arms */}
            <path d="M80 62 L60 130 L78 130 L88 62 Z" />
            <path d="M120 62 L112 62 L122 130 L140 130 Z" />
        </g>
        {/* Muscles */}
        <g>
            {/* Shoulders */}
            <path d="M80 62 a 12 12 0 0 1 10 -2 h 20 a 12 12 0 0 1 10 2 l -5 10 h -30 z" style={getMuscleStyle("shoulders")} />
            {/* Biceps */}
            <path d="M70 80 a 10 10 0 0 1 10 0 l 5 20 l -15 0 l-5 -20" style={getMuscleStyle("biceps")} />
            <path d="M120 80 a 10 10 0 0 0 -10 0 l -5 20 l 15 0 l 5 -20" style={getMuscleStyle("biceps")} />
            {/* Triceps */}
             <path d="M63 85 l-3 20 l 5 0 l 3 -20" style={getMuscleStyle("triceps")} />
            <path d="M137 85 l 3 20 l -5 0 l -3 -20" style={getMuscleStyle("triceps")} />
            {/* Chest */}
            <path d="M88 72 l 24 0 l 5 20 l -10 0 l-4 -10 l-10 0 l-5 20 Z" style={getMuscleStyle("chest")} />
            {/* Abs */}
            <path d="M90 95 h 20 l 2 23 h -24 z" style={getMuscleStyle("abs")} />
            {/* Back */}
            <path d="M85 70 l 30 0 l 5 50 h-40 Z" style={getMuscleStyle("back")} />
            {/* Quads */}
            <path d="M72 122 h 20 l -5 50 h -15 Z" style={getMuscleStyle("quads")} />
            <path d="M108 122 h 20 l 5 50 h -15 Z" style={getMuscleStyle("quads")} />
            {/* Glutes */}
            <path d="M75 120 l 50 0 l 0 15 l -50 0 Z" style={getMuscleStyle("glutes")} />
             {/* Hamstrings */}
            <path d="M75 170 l 15 0 l 0 30 l -15 0 Z" style={getMuscleStyle("hamstrings")} />
            <path d="M110 170 l 15 0 l 0 30 l -15 0 Z" style={getMuscleStyle("hamstrings")} />
            {/* Calves */}
            <path d="M78 200 l 10 0 l -2 30 l -8 0 Z" style={getMuscleStyle("calves")} />
            <path d="M112 200 l 10 0 l 2 30 l -8 0 Z" style={getMuscleStyle("calves")} />
        </g>
    </g>
);

const FemaleDiagram = ({ getMuscleStyle }: { getMuscleStyle: (muscle: Muscle) => any }) => (
    <g>
        {/* Base Body */}
        <g fill="hsl(var(--muted-foreground) / 0.1)" stroke="hsl(var(--muted-foreground) / 0.2)" strokeWidth="0.5">
            {/* Head */}
            <path d="M92 40 a 8 10 0 1 1 16 0 a 8 10 0 1 1 -16 0" />
            {/* Neck */}
            <path d="M97 50 L96 55 L104 55 L103 50 Z" />
            {/* Torso */}
            <path d="M85 57 L115 57 L120 120 L80 120 Z" />
            {/* Hips/Waist */}
             <path d="M80 100 q-5 10 0 20 l 40 0 q 5 -10 0 -20 Z" />
            {/* Legs */}
            <path d="M80 120 L75 200 L95 200 L95 120 Z" />
            <path d="M105 120 L105 200 L125 200 L120 120 Z" />
            {/* Arms */}
            <path d="M85 57 L70 125 L85 125 L90 57 Z" />
            <path d="M115 57 L110 57 L115 125 L130 125 Z" />
        </g>
         {/* Muscles */}
        <g>
            {/* Shoulders */}
            <path d="M85 57 a 10 10 0 0 1 5 -2 h 20 a 10 10 0 0 1 5 2 l -3 8 h -24 z" style={getMuscleStyle("shoulders")} />
            {/* Biceps */}
            <path d="M78 75 a 8 8 0 0 1 8 0 l 3 15 l -11 0 l-3 -15" style={getMuscleStyle("biceps")} />
            <path d="M114 75 a 8 8 0 0 0 -8 0 l -3 15 l 11 0 l 3 -15" style={getMuscleStyle("biceps")} />
            {/* Triceps */}
             <path d="M75 80 l -2 15 l 4 0 l 2 -15" style={getMuscleStyle("triceps")} />
            <path d="M125 80 l 2 15 l -4 0 l -2 -15" style={getMuscleStyle("triceps")} />
            {/* Chest */}
            <path d="M90 65 h 20 l 3 15 h -26 z" style={getMuscleStyle("chest")} />
            {/* Abs */}
            <path d="M92 82 h 16 l 2 28 h -20 z" style={getMuscleStyle("abs")} />
            {/* Back */}
            <path d="M88 65 l 24 0 l 5 45 h -34 Z" style={getMuscleStyle("back")} />
            {/* Quads */}
            <path d="M78 122 h 15 l -4 50 h -11 Z" style={getMuscleStyle("quads")} />
            <path d="M107 122 h 15 l 4 50 h -11 Z" style={getMuscleStyle("quads")} />
            {/* Glutes */}
            <path d="M80 115 l 40 0 l 5 15 l -50 0 Z" style={getMuscleStyle("glutes")} />
             {/* Hamstrings */}
            <path d="M80 170 l 12 0 l 0 30 l -12 0 Z" style={getMuscleStyle("hamstrings")} />
            <path d="M108 170 l 12 0 l 0 30 l -12 0 Z" style={getMuscleStyle("hamstrings")} />
            {/* Calves */}
            <path d="M80 200 l 8 0 l -2 30 l -6 0 Z" style={getMuscleStyle("calves")} />
            <path d="M112 200 l 8 0 l 2 30 l -6 0 Z" style={getMuscleStyle("calves")} />
        </g>
    </g>
);


export function MuscleFatigueDiagram({ fatiguedMuscles, gender = "male" }: MuscleFatigueDiagramProps) {
  
  const getMuscleStyle = (muscle: Muscle) => {
    const intensity = fatiguedMuscles[muscle] || 0;
    
    let color = 'transparent';
    if (intensity >= 80) color = 'hsl(0, 100%, 50%)';      // Red
    else if (intensity >= 50) color = 'hsl(30, 100%, 50%)'; // Orange
    else if (intensity >= 30) color = 'hsl(48, 100%, 50%)'; // Yellow
    else if (intensity >= 10) color = 'hsl(211, 100%, 50%)';// Blue
    
    if (intensity < 10) {
      return { fill: "transparent" };
    }

    return {
      fill: color,
      stroke: "white",
      strokeWidth: 0.2,
      opacity: intensity / 100 * 0.7 + 0.3, // Min opacity 0.3, max 1.0
    };
  };

  return (
    <div className="flex justify-center items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 250"
        className="max-w-xs"
        aria-label="Muscle fatigue diagram"
      >
        {gender === 'male' ? <MaleDiagram getMuscleStyle={getMuscleStyle} /> : <FemaleDiagram getMuscleStyle={getMuscleStyle} />}
      </svg>
    </div>
  );
}

