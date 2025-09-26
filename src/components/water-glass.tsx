
"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

const WaterGlassComponent = ({ filled, onClick }: { filled: boolean, onClick: () => void }) => (
  <button onClick={onClick} className="relative w-full aspect-[3/4] group focus:outline-none" aria-label={filled ? "Glass full" : "Fill glass"}>
    <svg viewBox="0 0 75 100" className="w-full h-full drop-shadow-sm">
      <defs>
        <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(210, 85%, 75%)' }} />
          <stop offset="100%" style={{ stopColor: 'hsl(210, 85%, 55%)' }} />
        </linearGradient>
        <clipPath id="glassClip">
            <path d="M 10,10 L 65,10 L 70,95 L 5,95 Z" />
        </clipPath>
      </defs>

      {/* Water Fill */}
      <g clipPath="url(#glassClip)">
        <rect
          x="0"
          y="10"
          width="75"
          height="85"
          fill="url(#waterGradient)"
          className={cn(
            "transition-transform duration-700 ease-out",
            filled ? "translate-y-0" : "translate-y-[85px]"
          )}
        />
        {/* Water Surface Animation */}
        <path
           d="M -10 20 C 15 10, 50 30, 85 20 L 85 10 L -10 10 Z"
           fill="hsl(210, 85%, 85%)"
           className={cn(
            "transition-transform duration-700 ease-in-out",
            filled ? "translate-y-0 animate-wave" : "translate-y-[85px]"
           )}
           style={{
            animation: filled ? 'wave 2s ease-in-out infinite alternate' : 'none'
           }}
        />
      </g>
      
      {/* Glass Outline */}
      <path 
        d="M 10,10 L 65,10 L 70,95 L 5,95 Z" 
        className="fill-muted/20 stroke-muted-foreground/30"
        strokeWidth="2"
      />
      
      {/* Highlights */}
      <path d="M 60 18 L 57 80" stroke="white" strokeWidth="2.5" strokeOpacity="0.5" strokeLinecap="round"/>
      
      {/* Plus icon when empty */}
      {!filled && 
        <foreignObject x="22.5" y="40" width="30" height="30">
          <Plus className="h-full w-full text-muted-foreground/50 group-hover:text-primary/70 transition-colors" />
        </foreignObject>
      }
        <style jsx>{`
            @keyframes wave {
                from {
                    transform: translateX(-10px) translateY(0);
                }
                to {
                    transform: translateX(0px) translateY(0);
                }
            }
        `}</style>
    </svg>
  </button>
);

export const WaterGlass = memo(WaterGlassComponent);
