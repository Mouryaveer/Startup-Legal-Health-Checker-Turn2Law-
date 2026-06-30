import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AdminSidebar } from "@/components/admin/sidebar";

export const metadata: Metadata = {
  title: "Admin Dashboard | Turn2Law Health Checker",
  description: "Management panel for compliance assessments, CRM leads, and custom question bank.",
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const cookieStore = await cookies();
  const session = cookieStore.get("t2l_health_admin")?.value;

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex">
      {/* Sidebar navigation */}
      <AdminSidebar />
      
      {/* Main Workspace content */}
      <div className="flex-1 min-w-0 flex flex-col pt-16 lg:pt-0">
        <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
