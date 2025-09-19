
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainCircuit, Home, HeartPulse, Activity, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/dashboard/workout", label: "Activity", icon: Activity },
    { href: "/dashboard/programs", label: "Programs", icon: BrainCircuit },
    { href: "/dashboard/fatigue", label: "Fatigue", icon: HeartPulse },
    { href: "/dashboard/profile", label: "Me", icon: User },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm">
      <div className="grid h-16 grid-cols-5 items-center justify-around">
        {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href) && (item.href !== "/dashboard" || pathname === "/dashboard");
            return (
                <Link 
                    key={item.href}
                    href={item.href} 
                    className={cn(
                        "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors duration-200",
                        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <div className="relative">
                      <item.icon className="h-6 w-6" />
                      {isActive && (
                        <span className="absolute -inset-2 rounded-full bg-primary/20 blur-md" />
                      )}
                    </div>
                    <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
            )
        })}
      </div>
    </nav>
  );
}
