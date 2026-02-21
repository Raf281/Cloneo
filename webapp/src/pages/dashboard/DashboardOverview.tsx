import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  Plus,
  FileVideo,
  Clock,
  Check,
  Calendar,
  ArrowRight,
  Sparkles,
  Film,
} from "lucide-react";
import { XIcon, QuickXPostWidget } from "@/components/x-posts";
import { GettingStartedGuide } from "@/components/dashboard/GettingStartedGuide";

// Types for backend responses
interface ContentStats {
  thisWeek: number;
  pendingReview: number;
  published: number;
  scheduled: number;
}

interface GeneratedContentItem {
  id: string;
  type: string;
  title: string;
  platform: string;
  status: string;
  createdAt: string;
}

interface GeneratedContentResponse {
  items: GeneratedContentItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

interface UserSession {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

// Helper to format relative time in English
function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-400",
  approved: "bg-emerald-500/20 text-emerald-400",
  published: "bg-emerald-500/20 text-emerald-400",
  scheduled: "bg-blue-500/20 text-blue-400",
  rejected: "bg-red-500/20 text-red-400",
  draft: "bg-zinc-500/20 text-zinc-400",
};

const statusLabels: Record<string, string> = {
  pending: "Pending Review",
  approved: "Approved",
  published: "Published",
  scheduled: "Scheduled",
  rejected: "Rejected",
  draft: "Draft",
};

function StatsLoadingSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="flex items-center gap-4 p-6">
            <Skeleton className="h-12 w-12 rounded-xl bg-zinc-800" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-zinc-800" />
              <Skeleton className="h-7 w-12 bg-zinc-800" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ActivityLoadingSkeleton() {
  return (
    <div className="divide-y divide-zinc-800">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4">
          <Skeleton className="h-10 w-10 rounded-lg bg-zinc-800" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48 bg-zinc-800" />
            <Skeleton className="h-3 w-32 bg-zinc-800" />
          </div>
          <Skeleton className="h-6 w-24 rounded-full bg-zinc-800" />
        </div>
      ))}
    </div>
  );
}

export default function DashboardOverview() {
  const navigate = useNavigate();

  // Fetch user session
  const { data: session } = useQuery<UserSession>({
    queryKey: ["auth", "session"],
    queryFn: () => api.get<UserSession>("/api/auth/get-session"),
  });

  // Fetch content stats
  const { data: statsData, isLoading: statsLoading } = useQuery<ContentStats>({
    queryKey: ["stats", "content"],
    queryFn: () => api.get<ContentStats>("/api/stats/content"),
  });

  // Fetch recent content
  const { data: contentData, isLoading: contentLoading } = useQuery<GeneratedContentResponse>({
    queryKey: ["generated-content", "recent"],
    queryFn: () => api.get<GeneratedContentResponse>("/api/generated-content?limit=4"),
  });

  const userName = session?.user?.name ?? "Creator";
  const userImage = session?.user?.image;
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Build stats array from real data
  const stats = [
    {
      title: "Content This Week",
      value: String(statsData?.thisWeek ?? 0),
      icon: FileVideo,
      color: "text-violet-400",
      bgColor: "bg-violet-500/10",
    },
    {
      title: "Pending Review",
      value: String(statsData?.pendingReview ?? 0),
      icon: Clock,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Published",
      value: String(statsData?.published ?? 0),
      icon: Check,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Scheduled",
      value: String(statsData?.scheduled ?? 0),
      icon: Calendar,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
  ];

  // Map backend content items to activity format
  const recentActivity = (contentData?.items ?? []).map((item) => ({
    id: item.id,
    type: item.type === "xpost" ? "xpost" : "video",
    title: item.title,
    platform: item.platform,
    status: item.status,
    time: formatRelativeTime(item.createdAt),
  }));

  const pendingCount = statsData?.pendingReview ?? 0;

  const handleAiGenerate = () => {
    navigate("/dashboard/studio?tab=xposts");
  };

  const handlePostDraft = (text: string) => {
    console.log("Draft saved:", text);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-violet-500/50">
            {userImage ? <AvatarImage src={userImage} /> : null}
            <AvatarFallback className="bg-zinc-800 text-xl text-zinc-400">{userInitials}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">
              Welcome back, {userName}!
            </h1>
            <p className="text-zinc-400">
              Your avatar is ready. Let's create some content today.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild className="gap-2 bg-black text-white hover:bg-zinc-900">
            <Link to="/dashboard/studio?tab=xposts">
              <XIcon className="h-4 w-4" />
              New X Post
            </Link>
          </Button>
          <Button asChild className="gap-2 bg-violet-600 hover:bg-violet-700">
            <Link to="/dashboard/studio">
              <Plus className="h-4 w-4" />
              New Video
            </Link>
          </Button>
        </div>
      </div>

      {/* Getting Started Guide */}
      <GettingStartedGuide />

      {/* Stats Grid */}
      {statsLoading ? (
        <StatsLoadingSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-zinc-800 bg-zinc-900/50">
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`rounded-xl p-3 ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick X Post Widget - Prominent placement */}
      <QuickXPostWidget onAiGenerate={handleAiGenerate} onPostDraft={handlePostDraft} />

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-800 pb-4">
            <CardTitle className="text-lg font-semibold text-white">
              Recent Activity
            </CardTitle>
            <Button variant="ghost" asChild className="gap-1 text-sm text-zinc-400 hover:text-white">
              <Link to="/dashboard/studio">
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {contentLoading ? (
              <ActivityLoadingSkeleton />
            ) : recentActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Film className="mb-2 h-8 w-8 text-zinc-600" />
                <p className="text-sm text-zinc-500">No activity yet</p>
                <p className="text-xs text-zinc-600">Create your first content in the Studio</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-800">
                {recentActivity.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 transition-colors hover:bg-zinc-800/30"
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      item.type === "xpost" ? "bg-black" : "bg-zinc-800"
                    }`}>
                      {item.type === "video" ? (
                        <Film className="h-5 w-5 text-violet-400" />
                      ) : (
                        <XIcon className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-sm font-medium text-white">{item.title}</p>
                      <p className="text-xs text-zinc-500">
                        {item.platform} - {item.time}
                      </p>
                    </div>
                    <Badge className={statusColors[item.status] ?? "bg-zinc-500/20 text-zinc-400"}>
                      {statusLabels[item.status] ?? item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="border-b border-zinc-800 pb-4">
            <CardTitle className="text-lg font-semibold text-white">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 p-6">
            <Link
              to="/dashboard/studio?tab=xposts"
              className="group flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-800/30 p-4 transition-all hover:border-zinc-600 hover:bg-black/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black">
                <XIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">Create X Posts</p>
                <p className="text-sm text-zinc-400">
                  Write tweets and threads with AI
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-white" />
            </Link>

            <Link
              to="/dashboard/studio"
              className="group flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-800/30 p-4 transition-all hover:border-violet-500/50 hover:bg-violet-500/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">Generate Videos</p>
                <p className="text-sm text-zinc-400">
                  Create new videos with AI
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-violet-400" />
            </Link>

            <Link
              to="/dashboard/studio"
              className="group flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-800/30 p-4 transition-all hover:border-amber-500/50 hover:bg-amber-500/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">Review Content</p>
                <p className="text-sm text-zinc-400">
                  {pendingCount} {pendingCount === 1 ? "item waiting" : "items waiting"} for your review
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-amber-400" />
            </Link>

            <Link
              to="/dashboard/calendar"
              className="group flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-800/30 p-4 transition-all hover:border-blue-500/50 hover:bg-blue-500/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">View Calendar</p>
                <p className="text-sm text-zinc-400">
                  Plan your content strategy
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-blue-400" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
