import AuthLayout from "./(auth)/layout";
import DashboardNav from "@/components/dashboard-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthLayout>
        <div className="w-full min-h-screen flex flex-col pb-16">
            <main className="flex-1">{children}</main>
            <DashboardNav />
        </div>
    </AuthLayout>
  );
}
