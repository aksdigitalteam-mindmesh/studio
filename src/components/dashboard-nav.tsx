
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Dumbbell, Bookmark, User, ShoppingCart, Info, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardNav() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", label: "Home", icon: Flame },
    { href: "/dashboard/workout", label: "Activity", icon: Activity },
    { href: "/dashboard/recipes", label: "Recipes", icon: Bookmark },
    { href: "/dashboard/fatigue", label: "Fatigue", icon: User },
  ];
  
  const centralNavLink = { href: "/dashboard/programs", label: "AI", icon: Info };


  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 h-16 border-t bg-background/95 backdrop-blur-sm">
        <div className="grid h-full grid-cols-5 items-center">
            {navLinks.slice(0, 2).map((link) => {
                const isActive = (link.href === '/dashboard' && pathname === '/dashboard') || (link.href !== '/dashboard' && pathname.startsWith(link.href));
                return (
                <Link
                    key={link.label}
                    href={link.href}
                    className={cn(
                    "flex flex-col items-center justify-center gap-1 rounded-full p-2 text-muted-foreground transition-colors hover:text-primary",
                    isActive && "text-primary"
                    )}
                >
                    <div className={cn(
                        "relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300",
                         isActive ? "bg-primary/10 animate-pulse-shadow shadow-[0_0_0_0_hsl(var(--primary)/0.7)]" : ""
                    )}>
                        <link.icon className="h-6 w-6" />
                    </div>
                </Link>
                );
            })}
            
            {/* Central Button */}
            <div className="flex justify-center items-center">
                 <Link
                    href={centralNavLink.href}
                    className={cn(
                        "flex flex-col items-center justify-center gap-1 rounded-full text-muted-foreground transition-colors hover:text-primary -mt-8",
                        pathname.startsWith(centralNavLink.href) && "text-primary"
                    )}
                >
                    <div className={cn(
                        "relative flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300 border-4 border-background bg-primary text-primary-foreground shadow-lg",
                         pathname.startsWith(centralNavLink.href) ? "bg-primary/90 animate-pulse-shadow shadow-[0_0_0_0_hsl(var(--primary)/0.7)]" : ""
                    )}>
                        <centralNavLink.icon className="h-8 w-8" />
                    </div>
                </Link>
            </div>

            {navLinks.slice(2).map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                <Link
                    key={link.label}
                    href={link.href}
                    className={cn(
                    "flex flex-col items-center justify-center gap-1 rounded-full p-2 text-muted-foreground transition-colors hover:text-primary",
                    isActive && "text-primary"
                    )}
                >
                    <div className={cn(
                        "relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300",
                         isActive ? "bg-primary/10 animate-pulse-shadow shadow-[0_0_0_0_hsl(var(--primary)/0.7)]" : ""
                    )}>
                        <link.icon className="h-6 w-6" />
                    </div>
                </Link>
                );
            })}
        </div>
      </nav>
    </>
  );
}
