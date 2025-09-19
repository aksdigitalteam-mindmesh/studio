import DashboardNav from "@/components/dashboard-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen flex flex-col pb-16">
        <main className="flex-1">{children}</main>
        <DashboardNav />
    </div>
  );
}
