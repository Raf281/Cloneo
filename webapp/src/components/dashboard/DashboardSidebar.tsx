import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Film,
  User,
  UserCircle,
  Calendar,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Ubersicht",
    icon: LayoutDashboard,
    path: "/dashboard",
    exact: true,
  },
  {
    title: "Content Studio",
    icon: Film,
    path: "/dashboard/studio",
    badge: "Neu",
  },
  {
    title: "Mein Avatar",
    icon: User,
    path: "/dashboard/avatar",
  },
  {
    title: "Meine Persona",
    icon: UserCircle,
    path: "/dashboard/persona",
  },
  {
    title: "Kalender",
    icon: Calendar,
    path: "/dashboard/calendar",
  },
  {
    title: "Einstellungen",
    icon: Settings,
    path: "/dashboard/settings",
  },
];

export function DashboardSidebar() {
  const location = useLocation();

  const isActive = (item: typeof menuItems[0]) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <Sidebar className="border-r border-zinc-800/50 bg-zinc-950">
      <SidebarHeader className="border-b border-zinc-800/50 px-4 py-4">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white">CLONEO</span>
            <span className="text-xs text-zinc-500">Content Studio</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item)}
                    tooltip={item.title}
                  >
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                        isActive(item)
                          ? "bg-violet-500/10 text-violet-400"
                          : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                      {item.badge ? (
                        <span className="ml-auto rounded-full bg-violet-500/20 px-2 py-0.5 text-xs font-medium text-violet-400">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-zinc-800/50 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-zinc-700">
            <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" />
            <AvatarFallback className="bg-zinc-800 text-zinc-400">JD</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-white">John Doe</p>
            <p className="truncate text-xs text-zinc-500">Pro Plan</p>
          </div>
          <button className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
