import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import {
  Plus,
  Play,
  Check,
  X,
  Pencil,
  Instagram,
  Calendar,
  Filter,
  Sparkles,
  Film,
  Loader2,
} from "lucide-react";

// Import X Post components
import {
  XIcon,
  XPostCard,
  XPostDetailView,
  XPostGenerateModal,
} from "@/components/x-posts";

// Import hooks & types
import {
  useGeneratedContent,
  useGenerateContent,
  useApproveContent,
  useRejectContent,
} from "@/hooks/use-content";
import type {
  GeneratedContent,
  ContentPlatform,
  ContentTone,
} from "@/lib/types";

// ============================================
// Helpers
// ============================================

/** Map backend platform to a simpler UI key */
function platformKey(platform: ContentPlatform): string {
  if (platform === "instagram_reel") return "instagram";
  if (platform === "x_post") return "x";
  return platform; // tiktok stays tiktok
}

/** Map a backend status to a UI status key for statusConfig lookup */
function uiStatusKey(status: string): string {
  if (status === "pending_review") return "pending";
  if (status === "published") return "approved";
  return status;
}

/** Relative time string from an ISO date */
function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} hour${diffH > 1 ? "s" : ""} ago`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD} day${diffD > 1 ? "s" : ""} ago`;
}

/** Extract a title-like string from the script */
function titleFromScript(script: string | null): string {
  if (!script) return "No Script";
  const firstLine = script.split("\n")[0].trim();
  if (firstLine.length > 60) return firstLine.slice(0, 57) + "...";
  return firstLine || "No Title";
}

// ============================================
// UI constants
// ============================================

const platformIcons: Record<string, React.ReactNode> = {
  instagram: <Instagram className="h-4 w-4" />,
  tiktok: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  ),
  x: <XIcon className="h-4 w-4" />,
};

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending Review", color: "bg-amber-500/20 text-amber-400" },
  pending_review: { label: "Pending Review", color: "bg-amber-500/20 text-amber-400" },
  approved: { label: "Approved", color: "bg-emerald-500/20 text-emerald-400" },
  scheduled: { label: "Scheduled", color: "bg-blue-500/20 text-blue-400" },
  published: { label: "Published", color: "bg-emerald-500/20 text-emerald-400" },
  rejected: { label: "Rejected", color: "bg-red-500/20 text-red-400" },
  draft: { label: "Draft", color: "bg-zinc-500/20 text-zinc-400" },
};

const tabs = [
  { value: "all", label: "All", icon: null },
  { value: "xposts", label: "X Posts", icon: <XIcon className="h-3.5 w-3.5" /> },
  { value: "video", label: "Videos", icon: <Film className="h-3.5 w-3.5" /> },
  { value: "draft", label: "Drafts", icon: null },
  { value: "approved", label: "Approved", icon: null },
  { value: "rejected", label: "Rejected", icon: null },
];

/** Tone mapping: form value -> backend German tone */
const toneMap: Record<string, ContentTone> = {
  motivational: "motivierend",
  educational: "informativ",
  entertaining: "unterhaltsam",
  controversial: "provokant",
};

// ============================================
// Skeleton Loaders
// ============================================

function VideoCardSkeleton() {
  return (
    <Card className="overflow-hidden border-zinc-800 bg-zinc-900/50">
      <CardContent className="p-0">
        <div className="relative aspect-[3/4]">
          <Skeleton className="h-full w-full bg-zinc-800" />
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            <div className="flex gap-2">
              <Skeleton className="h-7 w-7 rounded-full bg-zinc-700" />
              <Skeleton className="h-5 w-24 rounded-full bg-zinc-700" />
            </div>
            <Skeleton className="h-4 w-3/4 bg-zinc-700" />
            <Skeleton className="h-3 w-1/2 bg-zinc-700" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function XPostCardSkeleton() {
  return (
    <Card className="overflow-hidden border-zinc-800 bg-zinc-900/50">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-7 rounded-full bg-zinc-700" />
          <Skeleton className="h-5 w-24 rounded-full bg-zinc-700" />
        </div>
        <Skeleton className="h-4 w-full bg-zinc-700" />
        <Skeleton className="h-4 w-5/6 bg-zinc-700" />
        <Skeleton className="h-4 w-2/3 bg-zinc-700" />
        <div className="flex gap-1.5 pt-1">
          <Skeleton className="h-5 w-16 rounded-full bg-zinc-700" />
          <Skeleton className="h-5 w-20 rounded-full bg-zinc-700" />
        </div>
        <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
          <Skeleton className="h-5 w-5 rounded-full bg-zinc-700" />
          <Skeleton className="h-3 w-20 bg-zinc-700" />
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// Video Content Card
// ============================================

interface VideoCardItem {
  id: string;
  title: string;
  platform: string;
  type: string;
  status: string;
  script: string;
  thumbnail: string | null;
  videoUrl: string | null;
  createdAt: string;
  scheduledFor: string | null;
}

function VideoContentCard({ item, onClick }: { item: VideoCardItem; onClick: () => void }) {
  const st = statusConfig[item.status] ?? statusConfig["draft"];

  return (
    <Card
      className="group cursor-pointer overflow-hidden border-zinc-800 bg-zinc-900/50 transition-all hover:border-zinc-700 hover:bg-zinc-800/50"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative aspect-[3/4] overflow-hidden">
          {item.thumbnail ? (
            <img
              src={item.thumbnail}
              alt={item.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-900/40 to-zinc-900">
              <Film className="h-12 w-12 text-zinc-600" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex items-center justify-center rounded-full bg-white/20 p-1.5 text-white backdrop-blur-sm">
                {platformIcons[item.platform]}
              </span>
              <Badge className={st.color}>
                {st.label}
              </Badge>
            </div>
            <h3 className="line-clamp-2 text-sm font-medium text-white">{item.title}</h3>
            <p className="mt-1 text-xs text-zinc-400">{item.createdAt}</p>
          </div>
          {item.videoUrl ? (
            <button className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 p-4 opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100">
              <Play className="h-6 w-6 text-white" fill="white" />
            </button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// Video Detail Content
// ============================================

function VideoContentDetailContent({
  item,
  onClose,
}: {
  item: GeneratedContent;
  onClose: () => void;
}) {
  const [script, setScript] = useState(item.script ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");

  const approveMutation = useApproveContent();
  const rejectMutation = useRejectContent();

  const pKey = platformKey(item.platform);
  const sKey = uiStatusKey(item.status);
  const st = statusConfig[item.status] ?? statusConfig["draft"];

  const handleApprove = () => {
    approveMutation.mutate(
      { id: item.id, scheduledFor: scheduleDate || undefined },
      {
        onSuccess: () => {
          toast.success("Content approved!");
          onClose();
        },
        onError: (err) => {
          toast.error(`Error: ${err.message}`);
        },
      }
    );
  };

  const handleReject = () => {
    rejectMutation.mutate(
      { id: item.id },
      {
        onSuccess: () => {
          toast.success("Content rejected.");
          onClose();
        },
        onError: (err) => {
          toast.error(`Error: ${err.message}`);
        },
      }
    );
  };

  const isActioning = approveMutation.isPending || rejectMutation.isPending;

  return (
    <div className="flex flex-col gap-6">
      {/* Preview */}
      <div className="relative aspect-[9/16] max-h-[400px] overflow-hidden rounded-xl bg-zinc-900">
        {item.videoUrl ? (
          <video
            src={item.videoUrl}
            className="h-full w-full object-cover"
            controls
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-900/40 to-zinc-900">
            <div className="rounded-full bg-white/10 p-4">
              <Film className="h-8 w-8 text-zinc-500" />
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center rounded-full bg-zinc-800 p-2 text-zinc-300">
            {platformIcons[pKey]}
          </span>
          <span className="text-sm capitalize text-zinc-400">
            {pKey}
          </span>
          <Badge className={st.color}>
            {st.label}
          </Badge>
        </div>

        <h2 className="text-xl font-semibold text-white">{titleFromScript(item.script)}</h2>

        {item.status === "rejected" ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
            <p className="text-sm text-red-400">
              <strong>Status:</strong> Rejected
            </p>
          </div>
        ) : null}

        {item.scheduledFor ? (
          <div className="flex items-center gap-2 rounded-lg bg-blue-500/10 p-3 text-blue-400">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">Scheduled for: {new Date(item.scheduledFor).toLocaleString("en-US")}</span>
          </div>
        ) : null}
      </div>

      {/* Script */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-zinc-400">Script</Label>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-zinc-400 hover:text-white"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Pencil className="h-3 w-3" />
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </div>
        {isEditing ? (
          <Textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            className="min-h-[200px] border-zinc-700 bg-zinc-800 text-white"
          />
        ) : (
          <div className="whitespace-pre-wrap rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-300">
            {script || "No script available"}
          </div>
        )}
      </div>

      {/* Schedule */}
      {item.status !== "scheduled" && item.status !== "rejected" && item.status !== "published" ? (
        <div className="space-y-2">
          <Label className="text-zinc-400">Schedule Publication</Label>
          <Input
            type="datetime-local"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            className="border-zinc-700 bg-zinc-800 text-white"
          />
        </div>
      ) : null}

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-4 sm:flex-row">
        {sKey === "pending" || item.status === "draft" ? (
          <>
            <Button
              className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700"
              onClick={handleApprove}
              disabled={isActioning}
            >
              {approveMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Approve & Schedule
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              onClick={handleReject}
              disabled={isActioning}
            >
              {rejectMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
              Reject
            </Button>
          </>
        ) : item.status === "rejected" ? (
          <Button className="flex-1 gap-2 bg-violet-600 hover:bg-violet-700">
            <Pencil className="h-4 w-4" />
            Revise
          </Button>
        ) : item.status === "approved" ? (
          <Button
            className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700"
            onClick={handleApprove}
            disabled={isActioning}
          >
            {approveMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Calendar className="h-4 w-4" />
            )}
            Schedule Now
          </Button>
        ) : null}
      </div>
    </div>
  );
}

// ============================================
// Generate Video Content Modal
// ============================================

function GenerateVideoContentModal() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState<string>("instagram_reel");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("motivational");

  const generateMutation = useGenerateContent();

  const handleGenerate = () => {
    const mappedTone = toneMap[tone] ?? ("motivierend" as ContentTone);
    generateMutation.mutate(
      {
        platform: platform as ContentPlatform,
        topic: topic || undefined,
        tone: mappedTone,
      },
      {
        onSuccess: () => {
          toast.success("Video is being generated!");
          setOpen(false);
          setTopic("");
        },
        onError: (err) => {
          toast.error(`Error: ${err.message}`);
        },
      }
    );
  };

  const content = (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-zinc-300">Platform</Label>
        <Select value={platform} onValueChange={setPlatform}>
          <SelectTrigger className="border-zinc-700 bg-zinc-800 text-white">
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent className="border-zinc-700 bg-zinc-900">
            <SelectItem value="instagram_reel">Instagram Reel</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-zinc-300">Topic / Idea (optional)</Label>
        <Textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. 5 tips for more productive remote work..."
          className="min-h-[100px] border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-zinc-300">Tone</Label>
        <Select value={tone} onValueChange={setTone}>
          <SelectTrigger className="border-zinc-700 bg-zinc-800 text-white">
            <SelectValue placeholder="Select tone" />
          </SelectTrigger>
          <SelectContent className="border-zinc-700 bg-zinc-900">
            <SelectItem value="motivational">Motivational</SelectItem>
            <SelectItem value="educational">Educational</SelectItem>
            <SelectItem value="entertaining">Entertaining</SelectItem>
            <SelectItem value="controversial">Controversial</SelectItem>
            <SelectItem value="storytelling">Storytelling</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        className="w-full gap-2 bg-violet-600 hover:bg-violet-700"
        onClick={handleGenerate}
        disabled={generateMutation.isPending}
      >
        {generateMutation.isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Generate Video
          </>
        )}
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button className="gap-2 bg-violet-600 hover:bg-violet-700">
            <Plus className="h-4 w-4" />
            <Film className="h-4 w-4" />
            New Video
          </Button>
        </DrawerTrigger>
        <DrawerContent className="border-zinc-800 bg-zinc-950 px-4 pb-8">
          <DrawerHeader className="px-0">
            <DrawerTitle className="text-white">Create New Video</DrawerTitle>
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-violet-600 hover:bg-violet-700">
          <Plus className="h-4 w-4" />
          <Film className="h-4 w-4" />
          New Video
        </Button>
      </DialogTrigger>
      <DialogContent className="border-zinc-800 bg-zinc-950 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Video</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// X Posts Stats Banner
// ============================================

function XPostsStatsBanner({ xPosts }: { xPosts: GeneratedContent[] }) {
  const total = xPosts.length;
  const pending = xPosts.filter((p) => p.status === "pending_review").length;
  const scheduled = xPosts.filter((p) => p.status === "scheduled").length;

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 sm:grid-cols-4">
      <div className="text-center">
        <p className="text-2xl font-bold text-white">{total}</p>
        <p className="text-xs text-zinc-500">Total X Posts</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-amber-400">{pending}</p>
        <p className="text-xs text-zinc-500">Pending Review</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-blue-400">{scheduled}</p>
        <p className="text-xs text-zinc-500">Scheduled</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-violet-400">0</p>
        <p className="text-xs text-zinc-500">Threads</p>
      </div>
    </div>
  );
}

// ============================================
// Map GeneratedContent to XPost-like UI shape
// ============================================

interface XPostUI {
  id: string;
  text: string;
  hashtags: string[];
  status: "draft" | "pending" | "approved" | "scheduled" | "rejected";
  isThread: boolean;
  threadCount?: number;
  createdAt: string;
  scheduledFor?: string;
  rejectionReason?: string;
  suggestedTime?: string;
}

function toXPostUI(item: GeneratedContent): XPostUI {
  let uiStatus: XPostUI["status"];
  if (item.status === "pending_review") {
    uiStatus = "pending";
  } else if (item.status === "published") {
    uiStatus = "approved";
  } else {
    uiStatus = item.status as XPostUI["status"];
  }

  return {
    id: item.id,
    text: item.script ?? "",
    hashtags: [],
    status: uiStatus,
    isThread: false,
    createdAt: relativeTime(item.createdAt),
    scheduledFor: item.scheduledFor
      ? new Date(item.scheduledFor).toLocaleString("en-US")
      : undefined,
  };
}

// ============================================
// Main Component
// ============================================

export default function ContentStudio() {
  const isMobile = useIsMobile();
  const [selectedVideoItem, setSelectedVideoItem] = useState<GeneratedContent | null>(null);
  const [selectedXPost, setSelectedXPost] = useState<GeneratedContent | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  // Fetch all content
  const { data, isLoading, isError, error } = useGeneratedContent({ limit: 100 });

  const allContent = data?.items ?? [];

  // Split by type
  const allVideos = allContent.filter(
    (c) => c.platform === "instagram_reel" || c.platform === "tiktok"
  );
  const allXPosts = allContent.filter((c) => c.platform === "x_post");

  // Active filter count for badge
  const activeFilterCount = [platformFilter !== "all", dateFilter !== "all"].filter(Boolean).length;

  // Filter content based on active tab + platform/date filters
  const getFilteredContent = () => {
    let filtered = allContent;

    // Apply platform filter
    if (platformFilter !== "all") {
      filtered = filtered.filter((c) => c.platform === platformFilter);
    }

    // Apply date filter
    if (dateFilter !== "all") {
      const now = Date.now();
      const cutoff = dateFilter === "7d" ? now - 7 * 86400000 : now - 30 * 86400000;
      filtered = filtered.filter((c) => new Date(c.createdAt).getTime() > cutoff);
    }

    // Then apply tab filters on the filtered set
    const videos = filtered.filter(
      (c) => c.platform === "instagram_reel" || c.platform === "tiktok"
    );
    const xPosts = filtered.filter((c) => c.platform === "x_post");

    if (activeTab === "xposts") return { videos: [] as GeneratedContent[], xPosts };
    if (activeTab === "video") return { videos, xPosts: [] as GeneratedContent[] };
    if (activeTab === "all") return { videos, xPosts };

    // Filter by status
    const statusMatch = (item: GeneratedContent) => {
      if (activeTab === "pending") {
        return item.status === "pending_review";
      }
      return item.status === activeTab;
    };
    return {
      videos: videos.filter(statusMatch),
      xPosts: xPosts.filter(statusMatch),
    };
  };

  const { videos: filteredVideos, xPosts: filteredXPosts } = getFilteredContent();
  const totalFilteredCount = filteredVideos.length + filteredXPosts.length;

  // Approve / reject for X Posts detail
  const approveMutation = useApproveContent();
  const rejectMutation = useRejectContent();

  const handleXPostApprove = () => {
    if (!selectedXPost) return;
    approveMutation.mutate(
      { id: selectedXPost.id },
      {
        onSuccess: () => {
          toast.success("X Post approved!");
          setSelectedXPost(null);
        },
        onError: (err) => {
          toast.error(`Error: ${err.message}`);
        },
      }
    );
  };

  const handleXPostReject = () => {
    if (!selectedXPost) return;
    rejectMutation.mutate(
      { id: selectedXPost.id },
      {
        onSuccess: () => {
          toast.success("X Post rejected.");
          setSelectedXPost(null);
        },
        onError: (err) => {
          toast.error(`Error: ${err.message}`);
        },
      }
    );
  };

  // Map video items for the card UI
  const videoCardItems: VideoCardItem[] = filteredVideos.map((v) => ({
    id: v.id,
    title: titleFromScript(v.script),
    platform: platformKey(v.platform),
    type: v.type,
    status: uiStatusKey(v.status),
    script: v.script ?? "",
    thumbnail: null,
    videoUrl: v.videoUrl,
    createdAt: relativeTime(v.createdAt),
    scheduledFor: v.scheduledFor,
  }));

  // Map X posts for the card UI
  const xPostUIItems: XPostUI[] = filteredXPosts.map(toXPostUI);

  const VideoDetailWrapper = isMobile ? Drawer : Dialog;
  const VideoDetailContent = isMobile ? DrawerContent : DialogContent;
  const VideoDetailHeader = isMobile ? DrawerHeader : DialogHeader;
  const VideoDetailTitle = isMobile ? DrawerTitle : DialogTitle;

  const XPostDetailWrapper = isMobile ? Drawer : Dialog;
  const XPostDetailContent = isMobile ? DrawerContent : DialogContent;
  const XPostDetailHeader = isMobile ? DrawerHeader : DialogHeader;
  const XPostDetailTitle = isMobile ? DrawerTitle : DialogTitle;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Content Studio</h1>
          <p className="text-zinc-400">Manage and approve your AI-generated content</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <XPostGenerateModal />
          <GenerateVideoContentModal />
        </div>
      </div>

      {/* Error state */}
      {isError ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 flex items-center justify-between">
          <p className="text-sm text-red-400">
            Error loading content: {error?.message ?? "Unknown error"}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      ) : null}

      {/* Tabs & Filter */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <ScrollArea className="w-full sm:w-auto">
            <TabsList className="inline-flex h-10 bg-zinc-900 p-1">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={`gap-1.5 px-4 text-zinc-400 data-[state=active]:bg-zinc-800 data-[state=active]:text-white ${
                    tab.value === "xposts" ? "data-[state=active]:bg-black" : ""
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white">
                <Filter className="h-4 w-4" />
                Filter
                {activeFilterCount > 0 ? (
                  <Badge className="ml-1 h-5 w-5 rounded-full bg-violet-500 p-0 text-xs text-white">
                    {activeFilterCount}
                  </Badge>
                ) : null}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 border-zinc-800 bg-zinc-950 p-4" align="end">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm text-zinc-400">Platform</Label>
                  <Select value={platformFilter} onValueChange={setPlatformFilter}>
                    <SelectTrigger className="border-zinc-700 bg-zinc-800 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-zinc-700 bg-zinc-900">
                      <SelectItem value="all">All Platforms</SelectItem>
                      <SelectItem value="instagram_reel">Instagram</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="x_post">X</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-zinc-400">Time Period</Label>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="border-zinc-700 bg-zinc-800 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-zinc-700 bg-zinc-900">
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="7d">Last 7 Days</SelectItem>
                      <SelectItem value="30d">Last 30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {activeFilterCount > 0 ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-zinc-400 hover:text-white"
                    onClick={() => { setPlatformFilter("all"); setDateFilter("all"); }}
                  >
                    Clear Filters
                  </Button>
                ) : null}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <TabsContent value={activeTab} className="mt-6">
          {/* X Posts Stats Banner - show when on X Posts tab */}
          {activeTab === "xposts" ? <XPostsStatsBanner xPosts={allXPosts} /> : null}

          {/* Loading state */}
          {isLoading ? (
            <div className="space-y-8">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <XPostCardSkeleton />
                <XPostCardSkeleton />
                <XPostCardSkeleton />
                <XPostCardSkeleton />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <VideoCardSkeleton />
                <VideoCardSkeleton />
                <VideoCardSkeleton />
              </div>
            </div>
          ) : totalFilteredCount > 0 ? (
            <div className="space-y-8">
              {/* X Posts Section */}
              {xPostUIItems.length > 0 ? (
                <div>
                  {activeTab !== "xposts" ? (
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black">
                        <XIcon className="h-4 w-4 text-white" />
                      </div>
                      <h2 className="text-lg font-semibold text-white">X Posts</h2>
                      <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                        {xPostUIItems.length}
                      </Badge>
                    </div>
                  ) : null}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {xPostUIItems.map((post, idx) => (
                      <XPostCard
                        key={post.id}
                        post={post}
                        onClick={() => setSelectedXPost(filteredXPosts[idx])}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Videos Section */}
              {videoCardItems.length > 0 ? (
                <div>
                  {activeTab !== "video" ? (
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/20">
                        <Film className="h-4 w-4 text-violet-400" />
                      </div>
                      <h2 className="text-lg font-semibold text-white">Videos</h2>
                      <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                        {videoCardItems.length}
                      </Badge>
                    </div>
                  ) : null}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {videoCardItems.map((item, idx) => (
                      <VideoContentCard
                        key={item.id}
                        item={item}
                        onClick={() => setSelectedVideoItem(filteredVideos[idx])}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-zinc-800 p-4">
                <Sparkles className="h-8 w-8 text-zinc-500" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-white">No Content Found</h3>
              <p className="mb-6 text-zinc-400">
                There is no content in this category yet
              </p>
              <div className="flex gap-2">
                <XPostGenerateModal />
                <GenerateVideoContentModal />
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Video Detail View */}
      <VideoDetailWrapper
        open={!!selectedVideoItem}
        onOpenChange={(open: boolean) => !open && setSelectedVideoItem(null)}
      >
        <VideoDetailContent
          className={
            isMobile
              ? "border-zinc-800 bg-zinc-950 px-4 pb-8"
              : "max-h-[90vh] overflow-y-auto border-zinc-800 bg-zinc-950 sm:max-w-lg"
          }
        >
          <VideoDetailHeader className={isMobile ? "px-0" : ""}>
            <VideoDetailTitle className="text-white">Video Details</VideoDetailTitle>
          </VideoDetailHeader>
          {selectedVideoItem ? (
            <VideoContentDetailContent
              item={selectedVideoItem}
              onClose={() => setSelectedVideoItem(null)}
            />
          ) : null}
        </VideoDetailContent>
      </VideoDetailWrapper>

      {/* X Post Detail View */}
      <XPostDetailWrapper
        open={!!selectedXPost}
        onOpenChange={(open: boolean) => !open && setSelectedXPost(null)}
      >
        <XPostDetailContent
          className={
            isMobile
              ? "border-zinc-800 bg-zinc-950 px-4 pb-8"
              : "max-h-[90vh] overflow-y-auto border-zinc-800 bg-zinc-950 sm:max-w-lg"
          }
        >
          <XPostDetailHeader className={isMobile ? "px-0" : ""}>
            <XPostDetailTitle className="flex items-center gap-2 text-white">
              <XIcon className="h-5 w-5" />
              X Post Details
            </XPostDetailTitle>
          </XPostDetailHeader>
          {selectedXPost ? (
            <XPostDetailView
              post={toXPostUI(selectedXPost)}
              onClose={() => setSelectedXPost(null)}
              onApprove={handleXPostApprove}
              onReject={handleXPostReject}
            />
          ) : null}
        </XPostDetailContent>
      </XPostDetailWrapper>
    </div>
  );
}
