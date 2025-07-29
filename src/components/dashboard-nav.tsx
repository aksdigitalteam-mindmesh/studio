"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/icons";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Icons.Dashboard },
  { href: "/dashboard/calories", label: "Calorie Tracker", icon: Icons.Calories },
  { href: "/dashboard/water", label: "Water Tracker", icon: Icons.Water },
  { href: "/dashboard/weight", label: "Weight Tracker", icon: Icons.Weight },
  { href: "/dashboard/workout-generator", label: "AI Workout Plan", icon: Icons.Workout },
  { href: "/dashboard/diet-generator", label: "AI Diet Plan", icon: Icons.Diet },
  { href: "/dashboard/subscription", label: "Subscription", icon: Icons.Subscription },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <div className="px-2 py-4">
      <SidebarMenu>
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard')}
              tooltip={{children: item.label}}
            >
              <Link href={item.href}>
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </div>
  );
}
