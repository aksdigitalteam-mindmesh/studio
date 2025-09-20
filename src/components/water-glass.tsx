
"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

const WaterGlassComponent = ({ filled, onClick }: { filled: boolean, onClick: () => void }) => (
  <button onClick={onClick} className="relative w-16 h-20 bg-gray-200/50 dark:bg-gray-700/50 rounded-t-lg overflow-hidden flex items-center justify-center group">
    {/* Water fill */}
    <div 
      className={cn(
        "absolute bottom-0 w-full bg-blue-400 transition-all duration-500 ease-in-out",
        filled ? "h-full" : "h-0"
      )} 
    />
    {/* Glass outline and shine effect */}
    <div className="absolute inset-0 border-2 border-gray-300/50 dark:border-gray-600/50 rounded-t-lg " />
    <div className="absolute top-2 left-2 w-1 h-[calc(100%-1rem)] bg-white/20 rounded-full transform -rotate-12 opacity-50" />
    <div className="absolute top-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent" />
    
    {/* Plus icon when empty */}
    {!filled && <Plus className="h-6 w-6 text-gray-400 group-hover:text-gray-500 transition-colors" />}
  </button>
);

export const WaterGlass = memo(WaterGlassComponent);
