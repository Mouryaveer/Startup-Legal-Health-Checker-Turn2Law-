"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  BarChart3, 
  Users, 
  Settings, 
  LogOut, 
  HelpCircle,
  FileCheck,
  ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { href: "/admin", label: "Analytics Overview", icon: BarChart3 },
  { href: "/admin/leads", label: "Leads & CRM", icon: Users },
  { href: "/admin/assessments", label: "Assessments", icon: FileCheck },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });
      if (response.ok) {
        router.push("/admin/login");
        router.refresh();
      }
    } catch (e) {
      console.error("Failed to sign out", e);
    }
  };

  return (
    <aside className="w-64 border-r border-[#E8E1D5] bg-[#FEFCF9] flex flex-col justify-between shrink-0 hidden lg:flex h-screen sticky top-0">
      {/* Upper panel */}
      <div className="p-6 space-y-8">
        {/* Title branding */}
        <div className="space-y-2">
          <Link href="/" className="inline-block" aria-label="Turn2Law Home">
            <img
              src="/logo.jpeg"
              alt="Turn2Law Logo"
              className="h-7 w-auto object-contain transition-transform duration-300 hover:scale-[1.02]"
            />
          </Link>
          <span className="text-[9px] text-[#8E5F28] uppercase font-bold tracking-wider block pl-1">
            Health Admin Panel
          </span>
        </div>

        {/* Links Navigation */}
        <nav className="space-y-1.5" role="navigation" aria-label="Admin sidebar navigation">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200",
                  isActive
                    ? "bg-[#FDF8EF] border border-[#D8A04C]/20 text-[#8E5F28]"
                    : "text-[#6B6B6B] hover:text-[#0A0A0A] hover:bg-[#F5F1EB]/50"
                )}
              >
                <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-[#D8A04C]" : "text-[#9B9B9B]")} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer log out panel */}
      <div className="p-6 border-t border-[#E8E1D5]/60 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#D8A04C]/10 border border-[#D8A04C]/20 flex items-center justify-center text-[11px] font-bold text-[#8E5F28]">
            AD
          </div>
          <div>
            <span className="text-xs font-bold text-[#0A0A0A] block">Administrator</span>
            <span className="text-[9px] text-[#6B6B6B] block">admin@turn2law.com</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#6B6B6B] hover:text-red-600 rounded-xl hover:bg-red-50 border border-transparent transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0 text-[#9B9B9B] group-hover:text-red-600" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
