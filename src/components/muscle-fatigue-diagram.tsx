
"use client";

import { cn } from "@/lib/utils";

export type Muscle = "chest" | "biceps" | "abs" | "quads" | "shoulders" | "back" | "triceps" | "glutes" | "hamstrings" | "calves";

interface MuscleFatigueDiagramProps {
  fatiguedMuscles: Partial<Record<Muscle, number>>;
  gender?: "male" | "female";
  onMuscleClick?: (muscle: Muscle) => void;
  selectedMuscle?: Muscle | null;
}

const getMuscleStyle = (muscle: Muscle, fatiguedMuscles: Partial<Record<Muscle, number>>) => {
    const intensity = fatiguedMuscles[muscle] || 0;
    
    let color = 'hsl(var(--muted-foreground) / 0.1)';
    if (intensity >= 80) color = 'url(#red-gradient)';
    else if (intensity >= 50) color = 'url(#orange-gradient)';
    else if (intensity >= 30) color = 'url(#yellow-gradient)';
    else if (intensity >= 10) color = 'url(#blue-gradient)';
    
    const opacity = intensity > 5 ? (intensity / 100 * 0.8 + 0.2) : 0;

    return {
      fill: color,
      stroke: "hsl(var(--card-foreground))",
      strokeWidth: 0.3,
      opacity: opacity,
      transition: 'all 0.3s ease-in-out',
      cursor: 'pointer',
    };
};

const MuscleGroup = ({ muscle, d, fatiguedMuscles, onMuscleClick, selectedMuscle }: { muscle: Muscle, d: string, fatiguedMuscles: Partial<Record<Muscle, number>>, onMuscleClick?: (muscle: Muscle) => void, selectedMuscle?: Muscle | null }) => {
    const style = getMuscleStyle(muscle, fatiguedMuscles);
    const isSelected = selectedMuscle === muscle;
    return (
        <path
            d={d}
            style={style}
            onClick={() => onMuscleClick?.(muscle)}
            className={cn("transition-all duration-300", isSelected ? 'stroke-[1px] stroke-primary' : '')}
        />
    )
};


const MaleDiagram = ({ onMuscleClick, selectedMuscle, fatiguedMuscles }: Omit<MuscleFatigueDiagramProps, 'gender'>) => (
    <g transform="translate(0, 15)">
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
            <MuscleGroup muscle="shoulders" d="M80 62 a 12 12 0 0 1 10 -2 h 20 a 12 12 0 0 1 10 2 l -5 10 h -30 z" fatiguedMuscles={fatiguedMuscles} onMuscleClick={onMuscleClick} selectedMuscle={selectedMuscle} />
            <MuscleGroup muscle="biceps" d="M70 80 a 10 10 0 0 1 10 0 l 5 20 l -15 0 l-5 -20" fatiguedMuscles={fatiguedMuscles} onMuscleClick={onMuscleClick} selectedMuscle={selectedMuscle} />
            <MuscleGroup muscle="biceps" d="M120 80 a 10 10 0 0 0 -10 0 l -5 20 l 15 0 l 5 -20" fatiguedMuscles={fatiguedMuscles} onMuscleClick={onMuscleClick} selectedMuscle={selectedMuscle} />
            <MuscleGroup muscle="triceps" d="M63 85 l-3 20 l 5 0 l 3 -20" fatiguedMuscles={fatiguedMuscles} onMuscleClick={onMuscleClick} selectedMuscle={selectedMuscle} />
            <MuscleGroup muscle="triceps" d="M137 85 l 3 20 l -5 0 l -3 -20" fatiguedMuscles={fatiguedMuscles} onMuscleClick={onMuscleClick} selectedMuscle={selectedMuscle} />
            <MuscleGroup muscle="chest" d="M88 72 l 24 0 l 5 20 l -10 0 l-4 -10 l-10 0 l-5 20 Z" fatiguedMuscles={fatigues} onMuscleClick={onMuscleClick} selectedMuscle={selectedMuscle} />
            <MuscleGroup muscle="abs" d="M90 95 h 20 l 2 23 h -24 z" fatiguedMuscles={fatiguedMuscles} onMuscleClick={onMuscleClick} selectedMuscle={selectedMuscle} />
            <MuscleGroup muscle="back" d="M85 70 l 30 0 l 5 50 h -40 Z" fatiguedMuscles={fatiguedMuscles} onMuscleClick={onMuscleClick} selectedMuscle={selectedMuscle} />
            <MuscleGroup muscle="quads" d="M72 122 h 20 l -5 50 h -15 Z" fatiguedMuscles={fatiguedMuscles} onMuscleClick={onMuscleClick} selectedMuscle={selectedMuscle} />
            <MuscleGroup muscle="quads" d="M108 122 h 20 l 5 50 h -15 Z" fatiguedMuscles={fatiguedMuscles} onMuscleClick={onMuscleClick} selectedMuscle={selectedMuscle} />
            <MuscleGroup muscle="glutes" d="M75 120 l 50 0 l 0 15 l -50 0 Z" fatiguedMuscles={fatiguedMuscles} onMuscleClick={onMuscleClick} selectedMuscle={selectedMuscle} />
            <MuscleGroup muscle="hamstrings" d="M75 170 l 15 0 l 0 30 l -15 0 Z" fatiguedMuscles={fatiguedMuscles} onMuscleClick={onMuscleClick} selectedMuscle={selectedMuscle} />
            <MuscleGroup muscle="hamstrings" d="M110 170 l 15 0 l 0 30 l -15 0 Z" fatiguedMuscles={fatiguedMuscles} onMuscleClick={onMuscleClick} selectedMuscle={selectedMuscle} />
            <MuscleGroup muscle="calves" d="M78 200 l 10 0 l -2 30 l -8 0 Z" fatiguedMuscles={fatiguedMuscles} onMuscleClick={onMuscleClick} selectedMuscle={selectedMuscle} />
            <MuscleGroup muscle="calves" d="M112 200 l 10 0 l 2 30 l -8 0 Z" fatiguedMuscles={fatiguedMuscles} onMuscleClick={onMuscleClick} selectedMuscle={selectedMuscle} />
        </g>
    </g>
);

const FemaleDiagram = ({ onMuscleClick, selectedMuscle, fatiguedMuscles }: Omit<MuscleFatigueDiagramProps, 'gender'>) => (
     <g transform="translate(0, 15)">
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
            <MuscleGroup muscle="shoulders" d="M85 57 a 10 10 0 0 1 5 -2 h 20 a 10 10 0 0 1 5 2 l -3 8 h -24 z" fatiguedMuscles={fatiguedMuscles} onMuscleClick={onMuscleClick} selectedMuscle={selectedMuscle} />
            <MuscleGroup muscle="biceps" d="M78 75 a 8 8 0 0 1 8 0 l 3 15 l -11 0 l-3 -15" fatiguedMuscles={fatiguedMuscles} onMuscleClick={onMuscleClick} selectedMuscle={selectedMuscle} />
            <MuscleGroup muscle="biceps" d="M114 75 a 8 8 0 0 0 -8 0 l -3 15 l 11 0 l 3 -15" fatiguedMuscles={fatiguedMuscles} onMuscleClick={onMuscleClick} selectedMuscle={selectedMuscle} />
            <MuscleGroup muscle="triceps" d="M75 80 l -2 15 l 4 0 l 2 -15" fatiguedMuscles={fatiguedMuscles} onMuscleClick={onMuscleClick} selectedMuscle={selectedMuscle} />
            <MuscleGroup muscle="triceps" d="M125 80 l 2 15 l -4 0 l -2 -15" fatiguedMuscles={fatiguedMuscles} onMuscleClick={onMuscleClick} selectedMuscle={selectedMuscle} />
            <MuscleGroup muscle="chest" d="M90 65 h 20 l 3 15 h -26 z" fatiguedMuscles={fatiguedMuscles} onMuscleClick={onMuscleClick} selectedMuscle={selectedMuscle} />
            <MuscleGroup muscle="abs" d="M92 82 h 16 l 2 28 h -20 z" fatiguedMuscles={fatiguedMuscles} onMuscleClick={onMuscleClick} selectedMuscle={selectedMuscle} />
            <MuscleGroup muscle="back" d="M88 65 l 24 0 l 5 45 h -34 Z" fatiguedMuscles={fatigues} onMuscleClick={onMuscleClick} selectedMuscle={selectedMuscle} />
            <MuscleGroup muscle="quads" d="M78 122 h 15 l -4 50 h -11 Z" fatiguedMuscles={fatiguedMuscles} onMuscleClick={onMuscleClick} selectedMuscle={selectedMuscle} />
            <MuscleGroup muscle="quads" d="M107 122 h 15 l 4 50 h -11 Z" fatiguedMuscles={fatiguedMuscles} onMuscleClick={onMuscleClick} selectedMuscle={selectedMuscle} />
            <MuscleGroup muscle="glutes" d="M80 115 l 40 0 l 5 15 l -50 0 Z" fatiguedMuscles={fatiguedMuscles} onMuscleClick={onMuscleClick} selectedMuscle={selectedMuscle} />
            <MuscleGroup muscle="hamstrings" d="M80 170 l 12 0 l 0 30 l -12 0 Z" fatiguedMuscles={fatiguedMuscles} onMuscleClick={onMuscleClick} selectedMuscle={selectedMuscle} />
            <MuscleGroup muscle="hamstrings" d="M108 170 l 12 0 l 0 30 l -12 0 Z" fatiguedMuscles={fatiguedMuscles} onMuscleClick={onMuscleClick} selectedMuscle={selectedMuscle} />
            <MuscleGroup muscle="calves" d="M80 200 l 8 0 l -2 30 l -6 0 Z" fatiguedMuscles={fatiguedMuscles} onMuscleClick={onMuscleClick} selectedMuscle={selectedMuscle} />
            <MuscleGroup muscle="calves" d="M112 200 l 8 0 l 2 30 l -6 0 Z" fatiguedMuscles={fatiguedMuscles} onMuscleClick={onMuscleClick} selectedMuscle={selectedMuscle} />
        </g>
    </g>
);


export function MuscleFatigueDiagram({ fatiguedMuscles = {}, gender = "male", onMuscleClick, selectedMuscle }: MuscleFatigueDiagramProps) {
  
  const diagramProps = { onMuscleClick, selectedMuscle, fatiguedMuscles };

  return (
    <div className="flex justify-center items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 250"
        className="max-w-xs"
        aria-label="Muscle fatigue diagram"
      >
        <defs>
            <radialGradient id="blue-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{stopColor: 'hsl(211, 100%, 70%)', stopOpacity: 0.8}} />
                <stop offset="100%" style={{stopColor: 'hsl(211, 90%, 50%)', stopOpacity: 1}} />
            </radialGradient>
            <radialGradient id="yellow-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{stopColor: 'hsl(45, 100%, 70%)', stopOpacity: 0.8}} />
                <stop offset="100%" style={{stopColor: 'hsl(45, 93%, 47%)', stopOpacity: 1}} />
            </radialGradient>
            <radialGradient id="orange-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{stopColor: 'hsl(30, 100%, 70%)', stopOpacity: 0.8}} />
                <stop offset="100%" style={{stopColor: 'hsl(30, 95%, 52%)', stopOpacity: 1}} />
            </radialGradient>
            <radialGradient id="red-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{stopColor: 'hsl(0, 100%, 70%)', stopOpacity: 0.8}} />
                <stop offset="100%" style={{stopColor: 'hsl(0, 72%, 51%)', stopOpacity: 1}} />
            </radialGradient>
        </defs>
        {gender === 'male' ? <MaleDiagram {...diagramProps} /> : <FemaleDiagram {...diagramProps} />}
      </svg>
    </div>
  );
}

    