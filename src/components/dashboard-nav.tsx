
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Activity, Bookmark, User, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/dashboard", label: "Home", icon: Flame },
  { href: "/dashboard/workout", label: "Activity", icon: Activity },
  { href: "/dashboard/programs", label: "AI Coach", icon: BrainCircuit, central: true },
  { href: "/dashboard/recipes", label: "Recipes", icon: Bookmark },
  { href: "/dashboard/fatigue", label: "Fatigue", icon: User },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 h-16 border-t bg-background/95 backdrop-blur-sm">
      <div className="grid h-full grid-cols-5 items-center">
        {navLinks.map((link) => {
          const isActive = (link.href === '/dashboard' && pathname === '/dashboard') || 
                           (link.href !== '/dashboard' && pathname.startsWith(link.href));
          
          if (link.central) {
            return (
              <div key={link.href} className="flex justify-center items-center">
                <Link
                  href={link.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 rounded-full transition-colors hover:text-primary -mt-8",
                    isActive && "text-primary"
                  )}
                >
                  <div className={cn(
                    "relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow-lg transition-all duration-300",
                    isActive && "bg-primary/90 animate-pulse-shadow"
                  )}>
                    <link.icon className="h-8 w-8" />
                  </div>
                </Link>
              </div>
            );
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 p-2 text-muted-foreground transition-colors hover:text-primary",
                isActive && "text-primary"
              )}
            >
              <div className={cn(
                  "relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300",
                   isActive && "bg-primary/10"
              )}>
                  <link.icon className="h-6 w-6" />
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

    