import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
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

const stats = [
  {
    title: "Content diese Woche",
    value: "12",
    icon: FileVideo,
    color: "text-violet-400",
    bgColor: "bg-violet-500/10",
  },
  {
    title: "Wartet auf Review",
    value: "5",
    icon: Clock,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
  },
  {
    title: "Veroffentlicht",
    value: "28",
    icon: Check,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  {
    title: "Geplant",
    value: "8",
    icon: Calendar,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
];

const recentActivity = [
  {
    id: 1,
    type: "video",
    title: "5 Tipps fur mehr Produktivitat",
    platform: "Instagram",
    status: "pending",
    time: "vor 2 Stunden",
  },
  {
    id: 2,
    type: "xpost",
    title: "Der grosste Fehler, den du machen kannst?",
    platform: "X",
    status: "approved",
    time: "vor 3 Stunden",
  },
  {
    id: 3,
    type: "video",
    title: "Morning Routine Motivation",
    platform: "TikTok",
    status: "approved",
    time: "vor 5 Stunden",
  },
  {
    id: 4,
    type: "xpost",
    title: "Thread uber Erfolgsgewohnheiten",
    platform: "X",
    status: "pending",
    time: "vor 1 Tag",
  },
];

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-400",
  approved: "bg-emerald-500/20 text-emerald-400",
  scheduled: "bg-blue-500/20 text-blue-400",
  rejected: "bg-red-500/20 text-red-400",
};

const statusLabels: Record<string, string> = {
  pending: "Review ausstehend",
  approved: "Freigegeben",
  scheduled: "Geplant",
  rejected: "Abgelehnt",
};

export default function DashboardOverview() {
  const navigate = useNavigate();

  const handleAiGenerate = () => {
    navigate("/dashboard/studio?tab=xposts");
  };

  const handlePostDraft = (text: string) => {
    console.log("Draft saved:", text);
    // In a real app, this would save to backend
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-violet-500/50">
            <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop" />
            <AvatarFallback className="bg-zinc-800 text-xl text-zinc-400">JD</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">
              Willkommen zuruck, John!
            </h1>
            <p className="text-zinc-400">
              Dein Avatar ist bereit. Lass uns heute Content erstellen.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild className="gap-2 bg-black text-white hover:bg-zinc-900">
            <Link to="/dashboard/studio?tab=xposts">
              <XIcon className="h-4 w-4" />
              Neuer X Post
            </Link>
          </Button>
          <Button asChild className="gap-2 bg-violet-600 hover:bg-violet-700">
            <Link to="/dashboard/studio">
              <Plus className="h-4 w-4" />
              Neues Video
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
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

      {/* Quick X Post Widget - Prominent placement */}
      <QuickXPostWidget onAiGenerate={handleAiGenerate} onPostDraft={handlePostDraft} />

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-800 pb-4">
            <CardTitle className="text-lg font-semibold text-white">
              Letzte Aktivitaten
            </CardTitle>
            <Button variant="ghost" asChild className="gap-1 text-sm text-zinc-400 hover:text-white">
              <Link to="/dashboard/studio">
                Alle anzeigen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
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
                  <Badge className={statusColors[item.status]}>
                    {statusLabels[item.status]}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="border-b border-zinc-800 pb-4">
            <CardTitle className="text-lg font-semibold text-white">
              Schnellaktionen
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
                <p className="font-medium text-white">X Posts erstellen</p>
                <p className="text-sm text-zinc-400">
                  Schreibe Tweets und Threads mit KI
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
                <p className="font-medium text-white">Videos generieren</p>
                <p className="text-sm text-zinc-400">
                  Erstelle neue Videos mit KI
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
                <p className="font-medium text-white">Content reviewen</p>
                <p className="text-sm text-zinc-400">
                  5 Items warten auf dein Feedback
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
                <p className="font-medium text-white">Kalender ansehen</p>
                <p className="text-sm text-zinc-400">
                  Plane deine Content-Strategie
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
