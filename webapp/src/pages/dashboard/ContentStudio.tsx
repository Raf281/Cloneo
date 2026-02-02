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
import { useIsMobile } from "@/hooks/use-mobile";
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
} from "lucide-react";

// Import X Post components
import {
  XIcon,
  XPostCard,
  XPostDetailView,
  XPostGenerateModal,
  type XPost,
} from "@/components/x-posts";

// Mock data for video content items
const mockVideoContent = [
  {
    id: 1,
    title: "5 Tipps fur mehr Produktivitat",
    platform: "instagram",
    type: "video",
    status: "pending",
    script:
      "Hey, hier sind 5 Tipps, die deine Produktivitat sofort steigern werden. Erstens: Starte den Tag mit einer klaren Prioritat. Zweitens: Nutze die Pomodoro-Technik. Drittens: Eliminiere Ablenkungen. Viertens: Plane Pausen ein. Funftens: Reflektiere am Abend. Welcher Tipp hilft dir am meisten? Schreib es in die Kommentare!",
    thumbnail: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=300&h=400&fit=crop",
    createdAt: "vor 2 Stunden",
  },
  {
    id: 2,
    title: "Morning Routine Motivation",
    platform: "tiktok",
    type: "video",
    status: "approved",
    script:
      "Deine Morning Routine entscheidet uber deinen ganzen Tag. Steh fruher auf als alle anderen. Trink Wasser. Bewege dich. Meditiere. Lerne etwas Neues. Diese Routine hat mein Leben verandert. Was ist deine?",
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=400&fit=crop",
    createdAt: "vor 5 Stunden",
  },
  {
    id: 4,
    title: "Mindset fur Unternehmer",
    platform: "instagram",
    type: "video",
    status: "scheduled",
    script:
      "Das wichtigste Mindset fur jeden Unternehmer: Scheitern ist Teil des Weges. Jeder Ruckschlag bringt dich naher ans Ziel. Die erfolgreichsten Menschen sind nicht die, die nie gescheitert sind - sondern die, die nie aufgegeben haben.",
    thumbnail: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&h=400&fit=crop",
    createdAt: "vor 1 Tag",
    scheduledFor: "morgen 10:00",
  },
  {
    id: 5,
    title: "3 Investmenttipps",
    platform: "tiktok",
    type: "video",
    status: "rejected",
    script:
      "Diese 3 Investmenttipps haben mein Portfolio verandert...",
    thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&h=400&fit=crop",
    createdAt: "vor 2 Tagen",
    rejectionReason: "Finanzberatung ohne Disclaimer - bitte uberarbeiten",
  },
  {
    id: 6,
    title: "Fokus-Hack",
    platform: "instagram",
    type: "video",
    status: "draft",
    script: "Hier ist ein einfacher Trick fur mehr Fokus...",
    thumbnail: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=300&h=400&fit=crop",
    createdAt: "Entwurf",
  },
];

// Mock data for X Posts
const mockXPosts: XPost[] = [
  {
    id: 101,
    text: "Erfolgreiche Menschen haben diese 7 Gewohnheiten gemeinsam:\n\n1. Sie stehen fruher auf als andere\n2. Sie lesen taglich\n3. Sie trainieren ihren Korper\n4. Sie umgeben sich mit den Richtigen\n5. Sie setzen klare Ziele\n6. Sie bleiben diszipliniert\n7. Sie geben niemals auf\n\nWelche Gewohnheit mochtest du entwickeln?",
    hashtags: ["erfolg", "mindset", "gewohnheiten"],
    status: "pending",
    isThread: true,
    threadCount: 7,
    createdAt: "vor 1 Tag",
    suggestedTime: "18:00 - Peak Engagement",
  },
  {
    id: 102,
    text: "Der grosste Fehler, den du machen kannst?\n\nNicht anzufangen.\n\nJeder Experte war einmal ein Anfanger. Jeder erfolgreiche Mensch hat irgendwann den ersten Schritt gemacht.\n\nDein Moment ist JETZT.",
    hashtags: ["motivation", "anfangen", "erfolg"],
    status: "approved",
    isThread: false,
    createdAt: "vor 3 Stunden",
    suggestedTime: "12:00 - Mittagspause",
  },
  {
    id: 103,
    text: "3 Bucher, die mein Leben verandert haben:\n\n1. Atomic Habits - James Clear\n2. Deep Work - Cal Newport\n3. The Psychology of Money - Morgan Housel\n\nWelches Buch hat dein Leben verandert?",
    hashtags: ["bucher", "lernen", "persoenlichkeitsentwicklung"],
    status: "scheduled",
    isThread: false,
    createdAt: "vor 2 Tagen",
    scheduledFor: "morgen 08:00",
  },
  {
    id: 104,
    text: "Unpopular Opinion:\n\nWork-Life-Balance ist ein Mythos.\n\nWas du brauchst ist Work-Life-Integration.\n\nFinde eine Arbeit, die sich nicht wie Arbeit anfuhlt, und du wirst nie wieder einen Tag \"arbeiten\".",
    hashtags: ["worklife", "karriere"],
    status: "pending",
    isThread: false,
    createdAt: "vor 5 Stunden",
    suggestedTime: "21:00 - Abend-Engagement",
  },
  {
    id: 105,
    text: "Dein Netzwerk ist dein Nettowert.\n\nAber nicht so, wie du denkst.\n\nEs geht nicht darum, Menschen zu \"nutzen\".\n\nEs geht darum, Mehrwert zu geben. Verbindungen aufzubauen. Gemeinsam zu wachsen.\n\nDie besten Deals entstehen aus echten Beziehungen.",
    hashtags: ["networking", "business", "beziehungen"],
    status: "draft",
    isThread: false,
    createdAt: "Entwurf",
  },
  {
    id: 106,
    text: "Investitionstipp: Kauf Krypto X jetzt, es wird 100x gehen!",
    hashtags: ["crypto", "investment"],
    status: "rejected",
    isThread: false,
    createdAt: "vor 1 Tag",
    rejectionReason: "Finanzberatung ohne Disclaimer - bitte uberarbeiten oder loschen",
  },
];

type VideoContentItem = typeof mockVideoContent[0];

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
  pending: { label: "Review ausstehend", color: "bg-amber-500/20 text-amber-400" },
  approved: { label: "Freigegeben", color: "bg-emerald-500/20 text-emerald-400" },
  scheduled: { label: "Geplant", color: "bg-blue-500/20 text-blue-400" },
  rejected: { label: "Abgelehnt", color: "bg-red-500/20 text-red-400" },
  draft: { label: "Entwurf", color: "bg-zinc-500/20 text-zinc-400" },
};

const tabs = [
  { value: "all", label: "Alle", icon: null },
  { value: "xposts", label: "X Posts", icon: <XIcon className="h-3.5 w-3.5" /> },
  { value: "video", label: "Videos", icon: <Film className="h-3.5 w-3.5" /> },
  { value: "draft", label: "Entwurfe", icon: null },
  { value: "approved", label: "Freigegeben", icon: null },
  { value: "rejected", label: "Abgelehnt", icon: null },
];

function VideoContentCard({ item, onClick }: { item: VideoContentItem; onClick: () => void }) {
  return (
    <Card
      className="group cursor-pointer overflow-hidden border-zinc-800 bg-zinc-900/50 transition-all hover:border-zinc-700 hover:bg-zinc-800/50"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={item.thumbnail}
            alt={item.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex items-center justify-center rounded-full bg-white/20 p-1.5 text-white backdrop-blur-sm">
                {platformIcons[item.platform]}
              </span>
              <Badge className={statusConfig[item.status].color}>
                {statusConfig[item.status].label}
              </Badge>
            </div>
            <h3 className="line-clamp-2 text-sm font-medium text-white">{item.title}</h3>
            <p className="mt-1 text-xs text-zinc-400">{item.createdAt}</p>
          </div>
          <button className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 p-4 opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100">
            <Play className="h-6 w-6 text-white" fill="white" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

function VideoContentDetailContent({
  item,
  onClose,
}: {
  item: VideoContentItem;
  onClose: () => void;
}) {
  const [script, setScript] = useState(item.script);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* Preview */}
      <div className="relative aspect-[9/16] max-h-[400px] overflow-hidden rounded-xl bg-zinc-900">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="h-full w-full object-cover"
        />
        <button className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 p-4 backdrop-blur-sm transition-all hover:bg-white/30">
          <Play className="h-8 w-8 text-white" fill="white" />
        </button>
      </div>

      {/* Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center rounded-full bg-zinc-800 p-2 text-zinc-300">
            {platformIcons[item.platform]}
          </span>
          <span className="text-sm capitalize text-zinc-400">
            {item.platform}
          </span>
          <Badge className={statusConfig[item.status].color}>
            {statusConfig[item.status].label}
          </Badge>
        </div>

        <h2 className="text-xl font-semibold text-white">{item.title}</h2>

        {item.rejectionReason ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
            <p className="text-sm text-red-400">
              <strong>Ablehnungsgrund:</strong> {item.rejectionReason}
            </p>
          </div>
        ) : null}

        {item.scheduledFor ? (
          <div className="flex items-center gap-2 rounded-lg bg-blue-500/10 p-3 text-blue-400">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">Geplant fur: {item.scheduledFor}</span>
          </div>
        ) : null}
      </div>

      {/* Script */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-zinc-400">Skript</Label>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-zinc-400 hover:text-white"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Pencil className="h-3 w-3" />
            {isEditing ? "Abbrechen" : "Bearbeiten"}
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
            {script}
          </div>
        )}
      </div>

      {/* Schedule */}
      {item.status !== "scheduled" && item.status !== "rejected" ? (
        <div className="space-y-2">
          <Label className="text-zinc-400">Veroffentlichung planen</Label>
          <Input
            type="datetime-local"
            className="border-zinc-700 bg-zinc-800 text-white"
          />
        </div>
      ) : null}

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-4 sm:flex-row">
        {item.status === "pending" || item.status === "draft" ? (
          <>
            <Button className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700">
              <Check className="h-4 w-4" />
              Freigeben & Planen
            </Button>
            <Button variant="outline" className="flex-1 gap-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800">
              <X className="h-4 w-4" />
              Ablehnen
            </Button>
          </>
        ) : item.status === "rejected" ? (
          <Button className="flex-1 gap-2 bg-violet-600 hover:bg-violet-700">
            <Pencil className="h-4 w-4" />
            Uberarbeiten
          </Button>
        ) : item.status === "approved" ? (
          <Button className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700">
            <Calendar className="h-4 w-4" />
            Jetzt planen
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function GenerateVideoContentModal() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const content = (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-zinc-300">Plattform</Label>
        <Select defaultValue="instagram">
          <SelectTrigger className="border-zinc-700 bg-zinc-800 text-white">
            <SelectValue placeholder="Plattform wahlen" />
          </SelectTrigger>
          <SelectContent className="border-zinc-700 bg-zinc-900">
            <SelectItem value="instagram">Instagram Reel</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-zinc-300">Thema / Idee (optional)</Label>
        <Textarea
          placeholder="z.B. 5 Tipps fur produktiveres Arbeiten im Home Office..."
          className="min-h-[100px] border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-zinc-300">Tonalitat</Label>
        <Select defaultValue="motivational">
          <SelectTrigger className="border-zinc-700 bg-zinc-800 text-white">
            <SelectValue placeholder="Tonalitat wahlen" />
          </SelectTrigger>
          <SelectContent className="border-zinc-700 bg-zinc-900">
            <SelectItem value="motivational">Motivierend</SelectItem>
            <SelectItem value="educational">Lehrreich</SelectItem>
            <SelectItem value="entertaining">Unterhaltsam</SelectItem>
            <SelectItem value="controversial">Kontrovers</SelectItem>
            <SelectItem value="storytelling">Storytelling</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button className="w-full gap-2 bg-violet-600 hover:bg-violet-700">
        <Sparkles className="h-4 w-4" />
        Video generieren
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
            Neues Video
          </Button>
        </DrawerTrigger>
        <DrawerContent className="border-zinc-800 bg-zinc-950 px-4 pb-8">
          <DrawerHeader className="px-0">
            <DrawerTitle className="text-white">Neues Video erstellen</DrawerTitle>
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
          Neues Video
        </Button>
      </DialogTrigger>
      <DialogContent className="border-zinc-800 bg-zinc-950 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Neues Video erstellen</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}

// X Posts Stats Banner
function XPostsStatsBanner() {
  const xPostStats = {
    total: mockXPosts.length,
    pending: mockXPosts.filter((p) => p.status === "pending").length,
    scheduled: mockXPosts.filter((p) => p.status === "scheduled").length,
    threads: mockXPosts.filter((p) => p.isThread).length,
  };

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 sm:grid-cols-4">
      <div className="text-center">
        <p className="text-2xl font-bold text-white">{xPostStats.total}</p>
        <p className="text-xs text-zinc-500">X Posts gesamt</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-amber-400">{xPostStats.pending}</p>
        <p className="text-xs text-zinc-500">Warten auf Review</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-blue-400">{xPostStats.scheduled}</p>
        <p className="text-xs text-zinc-500">Geplant</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-violet-400">{xPostStats.threads}</p>
        <p className="text-xs text-zinc-500">Threads</p>
      </div>
    </div>
  );
}

export default function ContentStudio() {
  const isMobile = useIsMobile();
  const [selectedVideoItem, setSelectedVideoItem] = useState<VideoContentItem | null>(null);
  const [selectedXPost, setSelectedXPost] = useState<XPost | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Filter content based on active tab
  const getFilteredContent = () => {
    if (activeTab === "xposts") {
      return { videos: [], xPosts: mockXPosts };
    }
    if (activeTab === "video") {
      return { videos: mockVideoContent, xPosts: [] };
    }
    if (activeTab === "all") {
      return { videos: mockVideoContent, xPosts: mockXPosts };
    }
    // Filter by status
    return {
      videos: mockVideoContent.filter((item) => item.status === activeTab),
      xPosts: mockXPosts.filter((item) => item.status === activeTab),
    };
  };

  const { videos: filteredVideos, xPosts: filteredXPosts } = getFilteredContent();
  const totalFilteredCount = filteredVideos.length + filteredXPosts.length;

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
          <p className="text-zinc-400">Verwalte und genehmige deinen KI-generierten Content</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <XPostGenerateModal />
          <GenerateVideoContentModal />
        </div>
      </div>

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
          <Button variant="outline" size="sm" className="gap-2 border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        <TabsContent value={activeTab} className="mt-6">
          {/* X Posts Stats Banner - show when on X Posts tab */}
          {activeTab === "xposts" ? <XPostsStatsBanner /> : null}

          {totalFilteredCount > 0 ? (
            <div className="space-y-8">
              {/* X Posts Section */}
              {filteredXPosts.length > 0 ? (
                <div>
                  {activeTab !== "xposts" ? (
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black">
                        <XIcon className="h-4 w-4 text-white" />
                      </div>
                      <h2 className="text-lg font-semibold text-white">X Posts</h2>
                      <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                        {filteredXPosts.length}
                      </Badge>
                    </div>
                  ) : null}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredXPosts.map((post) => (
                      <XPostCard
                        key={post.id}
                        post={post}
                        onClick={() => setSelectedXPost(post)}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Videos Section */}
              {filteredVideos.length > 0 ? (
                <div>
                  {activeTab !== "video" ? (
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/20">
                        <Film className="h-4 w-4 text-violet-400" />
                      </div>
                      <h2 className="text-lg font-semibold text-white">Videos</h2>
                      <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                        {filteredVideos.length}
                      </Badge>
                    </div>
                  ) : null}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredVideos.map((item) => (
                      <VideoContentCard
                        key={item.id}
                        item={item}
                        onClick={() => setSelectedVideoItem(item)}
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
              <h3 className="mb-2 text-lg font-medium text-white">Kein Content gefunden</h3>
              <p className="mb-6 text-zinc-400">
                Es gibt noch keinen Content in dieser Kategorie
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
              post={selectedXPost}
              onClose={() => setSelectedXPost(null)}
            />
          ) : null}
        </XPostDetailContent>
      </XPostDetailWrapper>
    </div>
  );
}
