"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/icons";
import { UtensilsCrossed, BarChart3, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/dashboard/progress", label: "Progress", icon: BarChart3 },
    { href: "/dashboard/programs", label: "Programs", icon: Icons.Rocket },
    { href: "/dashboard/recipes", label: "Recipes", icon: UtensilsCrossed },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => {
            const isActive = pathname === item.href;
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
