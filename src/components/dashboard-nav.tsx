
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

  return (
    <>
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-48 h-24 bg-background rounded-t-[100%] z-40 pointer-events-none" />
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm">
        <div className="grid h-16 grid-cols-3 items-center justify-around">
          {navLinks.map((link, index) => {
            const isActive = (pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href)));
            if (index === middleIndex) {
              return (
                <div key={link.href} className="relative flex justify-center">
                   <Link href={link.href}>
                    <div className={cn(
                      "absolute -top-10 flex h-20 w-20 items-center justify-center rounded-full border-4 border-background transition-all duration-300",
                       isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      <link.icon className="h-8 w-8" />
                    </div>
                    <span className="absolute -bottom-0 text-xs font-medium text-muted-foreground">{link.label}</span>
                   </Link>
                </div>
              );
            }
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
      </nav>
    </>
  );
}
