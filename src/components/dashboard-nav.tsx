"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/icons";
import { UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/dashboard", label: "Diary", icon: Icons.Diet },
    { href: "/dashboard/progress", label: "Progress", icon: Icons.Workout },
    { href: "/dashboard/programs", label: "Programs", icon: Icons.Rocket },
    { href: "/dashboard/subscription", label: "Premium", icon: Icons.Subscription },
    { href: "/dashboard/recipes", label: "Recipes", icon: UtensilsCrossed },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-around p-2 border-t bg-background sticky bottom-0 z-50">
        {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
                <Link 
                    key={item.href}
                    href={item.href} 
                    className={cn(
                        "flex flex-col items-center",
                        isActive ? "text-primary" : "text-muted-foreground"
                    )}
                >
                    <item.icon className="h-6 w-6" />
                    <span className="text-xs">{item.label}</span>
                </Link>
            )
        })}
    </nav>
  );
}
