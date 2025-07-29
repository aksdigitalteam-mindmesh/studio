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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b p-3">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <Icons.Logo className="h-7 w-7 text-primary" />
              <h1 className="text-xl font-bold font-headline">
                FitBoost
              </h1>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <DashboardNav />
          </SidebarContent>
        </Sidebar>

        <SidebarInset>
            <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-4 border-b bg-background/95 px-4 backdrop-blur-sm sm:px-6 md:hidden">
                <Link href="/dashboard" className="flex items-center gap-2 font-bold font-headline">
                    <Icons.Logo className="h-6 w-6 text-primary" />
                    <span>FitBoost</span>
                </Link>
                <SidebarTrigger />
            </header>
            <div className="absolute top-4 right-4 hidden md:block">
                <ThemeToggle/>
            </div>

            <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
