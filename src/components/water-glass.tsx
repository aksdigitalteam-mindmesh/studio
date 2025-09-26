
"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

const WaterGlassComponent = ({ filled, onClick }: { filled: boolean, onClick: () => void }) => (
  <button onClick={onClick} className="relative w-full aspect-[9/16] group focus:outline-none" aria-label={filled ? "Glass full" : "Fill glass"}>
    <svg viewBox="0 0 75 100" className="w-full h-full drop-shadow-sm">
      <defs>
        <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(210, 85%, 75%)' }} />
          <stop offset="100%" style={{ stopColor: 'hsl(210, 85%, 55%)' }} />
        </linearGradient>
        <clipPath id="glassClip">
            <path d="M 15,5 L 60,5 L 60,95 L 15,95 Z" />
        </clipPath>
      </defs>

      {/* Water Fill */}
      <g clipPath="url(#glassClip)">
        <rect
          x="15"
          y="5"
          width="45"
          height="90"
          fill="url(#waterGradient)"
          className={cn(
            "transition-transform duration-700 ease-out",
            filled ? "translate-y-0" : "translate-y-[90px]"
          )}
        />
        {/* Water Surface Animation */}
        <path
           d="M 5 15 C 20 5, 45 25, 70 15 L 70 5 L 5 5 Z"
           fill="hsl(210, 85%, 85%)"
           className={cn(
            "transition-transform duration-700 ease-in-out",
            filled ? "translate-y-0 animate-wave" : "translate-y-[90px]"
           )}
           style={{
            animation: filled ? 'wave 2s ease-in-out infinite alternate' : 'none'
           }}
        />
      </g>
      
      {/* Glass Outline */}
      <path 
        d="M 15,5 L 60,5 L 60,95 L 15,95 Z"
        className="fill-muted/20 stroke-muted-foreground/30"
        strokeWidth="2"
        rx="2"
      />
      
      {/* Highlights */}
      <path d="M 55 12 L 55 88" stroke="white" strokeWidth="2" strokeOpacity="0.6" strokeLinecap="round"/>
      
      {/* Plus icon when empty */}
      {!filled && 
        <foreignObject x="27.5" y="45" width="20" height="20">
          <Plus className="h-full w-full text-muted-foreground/40 group-hover:text-primary/70 transition-colors" />
        </foreignObject>
      }
        <style jsx>{`
            @keyframes wave {
                from {
                    transform: translateX(-5px) translateY(0);
                }
                to {
                    transform: translateX(5px) translateY(0);
                }
            }
        `}</style>
    </svg>
  </button>
);

export const WaterGlass = memo(WaterGlassComponent);
