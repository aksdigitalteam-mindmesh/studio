
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, LineChart, Dumbbell, User, Flame, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardNav() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", label: "Home", icon: Flame },
    { href: "/dashboard/workout", label: "Activity", icon: Dumbbell },
    { href: "/dashboard/recipes", label: "Recipes", icon: Bookmark },
    { href: "/dashboard/fatigue", label: "Fatigue", icon: User },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t bg-background/95 backdrop-blur-sm">
        <div className="grid h-full grid-cols-2 items-center">
            <div className="flex justify-around">
            {navLinks.slice(0, 2).map((link) => {
                const isActive = (link.href === '/dashboard' && pathname === '/dashboard') || (link.href !== '/dashboard' && pathname.startsWith(link.href));
                return (
                <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                    "flex flex-col items-center justify-center gap-1 rounded-full p-2 text-muted-foreground transition-colors hover:text-primary",
                    isActive && "text-primary animate-pulse-shadow shadow-[0_0_15px_2px] shadow-primary/70"
                    )}
                >
                    <link.icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{link.label}</span>
                </Link>
                );
            })}
            </div>

            <div className="flex justify-around">
            {navLinks.slice(2).map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                    "flex flex-col items-center justify-center gap-1 rounded-full p-2 text-muted-foreground transition-colors hover:text-primary",
                    isActive && "text-primary animate-pulse-shadow shadow-[0_0_15px_2px] shadow-primary/70"
                    )}
                >
                    <link.icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{link.label}</span>
                </Link>
                );
            })}
            </div>
        </div>
      </nav>
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50">
        <Link href="/dashboard/programs" className="relative">
            <div className={cn(
                "absolute -top-8 flex h-16 w-16 items-center justify-center rounded-full border-4 border-background transition-all duration-300",
                 pathname.startsWith("/dashboard/programs") 
                    ? "bg-primary text-primary-foreground animate-pulse-shadow shadow-[0_0_15px_2px] shadow-primary/70" 
                    : "bg-muted text-muted-foreground"
            )}>
                <Bot className="h-7 w-7" />
            </div>
        </Link>
      </div>
    </>
  );
}
