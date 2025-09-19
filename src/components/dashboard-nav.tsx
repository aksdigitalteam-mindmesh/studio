"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, LineChart, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardNav() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard/workout", label: "Workout", icon: Dumbbell },
    { href: "/dashboard/progress", label: "Progress", icon: LineChart },
    { href: "/dashboard/programs", label: "AI Coach", icon: Bot },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm">
      <div className="grid h-16 grid-cols-3 items-center justify-around">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-primary",
              (pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href))) && "text-primary"
            )}
          >
            <link.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{link.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
