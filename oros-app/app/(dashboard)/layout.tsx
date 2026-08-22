import { MobileNav } from "@/components/layout/MobileNav";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }: Readonly<{ children: import("react").ReactNode }>) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      <div className="page-shell flex min-h-[calc(100vh-60px)] lg:pl-[260px]">
        <main className="flex-1 px-4 py-6 lg:px-8">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
