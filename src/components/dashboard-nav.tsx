
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, HeartPulse, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/dashboard/fatigue", label: "Fatigue", icon: HeartPulse },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm">
      <div className="grid h-16 grid-cols-3 items-center justify-around">
        
        {/* Left Item: Home */}
        <Link 
            href={navItems[0].href} 
            className={cn(
                "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors duration-200",
                pathname === navItems[0].href ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
        >
            <div className="relative">
              <navItems[0].icon className="h-6 w-6" />
              {pathname === navItems[0].href && (
                <span className="absolute -inset-2 rounded-full bg-primary/20 blur-md" />
              )}
            </div>
            <span className="text-[10px] font-medium">{navItems[0].label}</span>
        </Link>
        
        {/* Middle "Activity" Button */}
        <div className="relative flex h-full items-center justify-center">
            <Link 
                href="/dashboard/workout"
                className={cn(
                  "relative z-10 flex h-16 w-16 -translate-y-4 flex-col items-center justify-center gap-1 rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300",
                   pathname.startsWith("/dashboard/workout") && "shadow-primary/50"
                )}
            >
                <Activity className="h-7 w-7" />
                <span className="text-[10px] font-medium">Activity</span>
                 {pathname.startsWith("/dashboard/workout") && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/50 opacity-75"></span>
                )}
          </Link>
          {/* Hemisphere shape */}
          <div className="absolute bottom-0 h-8 w-24 overflow-hidden">
            <div className="h-16 w-24 rounded-t-full border-t bg-background"></div>
          </div>
        </div>

        {/* Right Item: Fatigue */}
         <Link 
            href={navItems[1].href} 
            className={cn(
                "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors duration-200",
                pathname.startsWith(navItems[1].href) ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
        >
            <div className="relative">
              <navItems[1].icon className="h-6 w-6" />
              {pathname.startsWith(navItems[1].href) && (
                <span className="absolute -inset-2 rounded-full bg-primary/20 blur-md" />
              )}
            </div>
            <span className="text-[10px] font-medium">{navItems[1].label}</span>
        </Link>
      </div>
    </nav>
  );
}
