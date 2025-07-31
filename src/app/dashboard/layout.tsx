import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Icons } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { DashboardNav } from "@/components/dashboard-nav";
import { UtensilsCrossed } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
        <nav className="flex items-center justify-around p-2 border-t bg-background sticky bottom-0">
        <Link href="/dashboard" className="flex flex-col items-center text-primary">
          <Icons.Diet className="h-6 w-6" />
          <span className="text-xs">Diary</span>
        </Link>
        <Link href="/dashboard/progress" className="flex flex-col items-center text-muted-foreground">
          <Icons.Workout className="h-6 w-6" />
          <span className="text-xs">Progress</span>
        </Link>
        <Link href="/dashboard/programs" className="flex flex-col items-center text-muted-foreground">
          <Icons.Rocket className="h-6 w-6" />
          <span className="text-xs">Programs</span>
        </Link>
        <Link href="/dashboard/subscription" className="flex flex-col items-center text-muted-foreground">
          <Icons.Subscription className="h-6 w-6" />
          <span className="text-xs">Premium</span>
        </Link>
        <Link href="/dashboard/recipes" className="flex flex-col items-center text-muted-foreground">
          <UtensilsCrossed className="h-6 w-6" />
          <span className="text-xs">Recipes</span>
        </Link>
      </nav>
    </div>
  );
}
