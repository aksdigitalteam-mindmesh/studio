
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, LineChart, Dumbbell, User, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardNav() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", label: "Home", icon: Flame },
    { href: "/dashboard/workout", label: "Activity", icon: Dumbbell },
    { href: "/dashboard/fatigue", label: "Fatigue", icon: User },
  ];

  const middleIndex = Math.floor(navLinks.length / 2);
  const leftLinks = navLinks.slice(0, middleIndex);
  const rightLinks = navLinks.slice(middleIndex + 1);
  const middleLink = navLinks[middleIndex];


  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm">
        <div className="grid h-16 grid-cols-3 items-center">
            <div className="flex justify-around">
            {leftLinks.map((link) => {
                const isActive = (pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href)));
                return (
                <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                    "flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-primary",
                    isActive && "text-primary"
                    )}
                >
                    <link.icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{link.label}</span>
                </Link>
                );
            })}
            </div>

            <div className="relative flex justify-center">
                <Link href={middleLink.href}>
                <div className={cn(
                    "absolute -top-8 flex h-16 w-16 items-center justify-center rounded-full border-4 border-background transition-all duration-300",
                    (pathname === middleLink.href || pathname.startsWith(middleLink.href)) ? "bg-primary text-primary-foreground shadow-[0_0_15px_2px] shadow-primary/70" : "bg-muted text-muted-foreground"
                )}>
                    <middleLink.icon className="h-7 w-7" />
                </div>
                </Link>
            </div>

            <div className="flex justify-around">
            {rightLinks.map((link) => {
                const isActive = (pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href)));
                return (
                <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                    "flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-primary",
                    isActive && "text-primary"
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
    </>
  );
}
