import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";

export function DashboardLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-zinc-950">
        <DashboardSidebar />
        <SidebarInset className="bg-zinc-950">
          <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-zinc-800/50 bg-zinc-950/80 px-4 backdrop-blur-xl md:hidden">
            <SidebarTrigger className="text-zinc-400 hover:text-white" />
            <span className="text-sm font-semibold text-white">CLONEO</span>
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
