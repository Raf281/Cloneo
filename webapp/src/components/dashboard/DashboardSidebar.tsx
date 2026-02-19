import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UserSession {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

const menuItems = [
  {
    title: "Overview",
    icon: LayoutDashboard,
    path: "/dashboard",
    exact: true,
  },
  {
    title: "Content Studio",
    icon: Film,
    path: "/dashboard/studio",
    badge: "New",
  },
  {
    title: "My Avatar",
    icon: User,
    path: "/dashboard/avatar",
  },
  {
    title: "My Persona",
    icon: UserCircle,
    path: "/dashboard/persona",
  },
  {
    title: "Calendar",
    icon: Calendar,
    path: "/dashboard/calendar",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/dashboard/settings",
  },
];

export function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: session } = useQuery<UserSession>({
    queryKey: ["auth", "session"],
    queryFn: () => api.get<UserSession>("/api/auth/get-session"),
  });

  const userName = session?.user?.name ?? "User";
  const userEmail = session?.user?.email ?? "";
  const userImage = session?.user?.image;
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isActive = (item: (typeof menuItems)[0]) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/sign-out");
    } catch {
      // Even if the request fails, clear local state and redirect
    }
    queryClient.clear();
    navigate("/");
  };

  return (
    <Sidebar className="border-r border-zinc-800/50 bg-zinc-950">
      <SidebarHeader className="border-b border-zinc-800/50 px-4 py-5">
        <Link to="/dashboard" className="flex items-center">
          <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
            CLONEO
          </span>
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
            {userImage ? (
              <AvatarImage src={userImage} />
            ) : null}
            <AvatarFallback className="bg-zinc-800 text-zinc-400">{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-white">{userName}</p>
            <p className="truncate text-xs text-zinc-500">{userEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
