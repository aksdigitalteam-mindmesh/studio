
"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

const WaterGlassComponent = ({ filled, onClick }: { filled: boolean, onClick: () => void }) => (
  <button onClick={onClick} className="relative w-20 h-24 group focus:outline-none">
    <svg viewBox="0 0 80 100" className="w-full h-full">
      <defs>
        <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#60a5fa' }} />
          <stop offset="100%" style={{ stopColor: '#3b82f6' }} />
        </linearGradient>
        <clipPath id="glassClip">
          <path d="M10 10 L 70 10 L 75 95 L 5 95 Z" />
        </clipPath>
      </defs>

      {/* Water Fill */}
      <g clipPath="url(#glassClip)">
        <rect
          x="0"
          y="10"
          width="80"
          height="85"
          fill="url(#waterGradient)"
          className={cn(
            "transition-transform duration-700 ease-in-out",
            filled ? "translate-y-0" : "translate-y-[85px]"
          )}
        />
        {/* Water Surface Animation */}
        <path
           d="M -10 20 C 20 10, 60 30, 90 20 L 90 10 L -10 10 Z"
           fill="#bfdbfe"
           className={cn(
            "transition-transform duration-700 ease-in-out",
            filled ? "translate-y-0" : "translate-y-[85px]"
           )}
        />
      </g>

      {/* Glass Outline */}
      <path d="M10 10 L 70 10 L 75 95 L 5 95 Z" fill="hsl(210 40% 98% / 0.1)" stroke="hsl(210 20% 70% / 0.7)" strokeWidth="2"/>
      
      {/* Glass Rim */}
      <ellipse cx="40" cy="10" rx="30" ry="5" fill="hsl(210 40% 98% / 0.1)" stroke="hsl(210 20% 70% / 0.7)" strokeWidth="2" />
      
      {/* Highlights */}
      <path d="M68 15 L 64 85" stroke="white" strokeWidth="3" strokeOpacity="0.7" strokeLinecap="round"/>
      <path d="M20 15 L 22 85" stroke="white" strokeWidth="2" strokeOpacity="0.4" strokeLinecap="round"/>
      
      {/* Plus icon when empty */}
      {!filled && 
        <foreignObject x="25" y="40" width="30" height="30">
          <Plus className="h-full w-full text-gray-400 group-hover:text-blue-400 transition-colors" />
        </foreignObject>
      }
    </svg>
  </button>
);

export const WaterGlass = memo(WaterGlassComponent);
