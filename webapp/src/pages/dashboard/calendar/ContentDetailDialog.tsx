import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Instagram,
  MessageSquare,
  Film,
  Clock,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { GeneratedContent, ContentPlatform } from "@/lib/types";

// ============================================
// Props
// ============================================

interface ContentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: GeneratedContent | null;
  onReschedule?: (content: GeneratedContent) => void;
}

// ============================================
// Helpers
// ============================================

const platformLabels: Record<ContentPlatform, string> = {
  instagram_reel: "Instagram Reel",
  tiktok: "TikTok",
  x_post: "X Post",
};

const platformColors: Record<ContentPlatform, string> = {
  instagram_reel: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  tiktok: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  x_post: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const platformIcons: Record<ContentPlatform, React.ReactNode> = {
  instagram_reel: <Instagram className="h-4 w-4" />,
  tiktok: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  ),
  x_post: <MessageSquare className="h-4 w-4" />,
};

const statusColors: Record<string, string> = {
  draft: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  pending_review: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  approved: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  scheduled: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  published: "bg-green-500/20 text-green-400 border-green-500/30",
  rejected: "bg-red-500/20 text-red-400 border-red-500/30",
};

function extractTitle(script: string | null): string {
  if (!script) return "Untitled Content";
  const firstLine = script.split("\n")[0].trim();
  const cleaned = firstLine.replace(/^[#>*-]+\s*/, "").trim();
  return cleaned.length > 0 ? cleaned.slice(0, 80) : "Untitled Content";
}

function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return "Not set";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "Invalid date";
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ============================================
// Component
// ============================================

export default function ContentDetailDialog({
  open,
  onOpenChange,
  content,
  onReschedule,
}: ContentDetailDialogProps) {
  if (!content) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-zinc-800 bg-zinc-900 text-white sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-start gap-3 text-lg text-white">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
              {content.type === "video" ? (
                <Film className="h-5 w-5 text-violet-400" />
              ) : (
                <MessageSquare className="h-5 w-5 text-blue-400" />
              )}
            </div>
            <span className="min-w-0 truncate pt-1">
              {extractTitle(content.script)}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Meta info row */}
          <div className="flex flex-wrap gap-2">
            <Badge
              className={cn("gap-1 border", platformColors[content.platform])}
            >
              {platformIcons[content.platform]}
              {platformLabels[content.platform]}
            </Badge>
            <Badge
              className={cn(
                "border capitalize",
                statusColors[content.status] ?? statusColors.draft
              )}
            >
              {content.status.replace("_", " ")}
            </Badge>
            <Badge className="gap-1 border border-zinc-700 bg-zinc-800 text-zinc-400">
              {content.type === "video" ? "Video" : "Text"}
            </Badge>
          </div>

          {/* Dates row */}
          <div className="space-y-2 rounded-lg border border-zinc-800 bg-zinc-800/40 p-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-zinc-500" />
              <span className="text-zinc-400">Scheduled:</span>
              <span className="text-white">
                {formatDateTime(content.scheduledFor)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-zinc-500" />
              <span className="text-zinc-400">Created:</span>
              <span className="text-white">
                {formatDateTime(content.createdAt)}
              </span>
            </div>
            {content.publishedAt ? (
              <div className="flex items-center gap-2 text-sm">
                <ExternalLink className="h-4 w-4 text-zinc-500" />
                <span className="text-zinc-400">Published:</span>
                <span className="text-white">
                  {formatDateTime(content.publishedAt)}
                </span>
              </div>
            ) : null}
          </div>

          {/* Script content */}
          {content.script ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-300">Script</p>
              <ScrollArea className="max-h-[200px] rounded-lg border border-zinc-800 bg-zinc-800/40 p-3">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
                  {content.script}
                </p>
              </ScrollArea>
            </div>
          ) : null}

          {/* Video URL if available */}
          {content.videoUrl ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-300">Video</p>
              <div className="overflow-hidden rounded-lg border border-zinc-800">
                <video
                  src={content.videoUrl}
                  controls
                  className="max-h-[200px] w-full bg-black"
                />
              </div>
            </div>
          ) : null}

          {/* Actions */}
          <div className="flex justify-end gap-2 border-t border-zinc-800 pt-4">
            {onReschedule && (content.status === "scheduled" || content.status === "approved" || content.status === "draft") ? (
              <Button
                variant="outline"
                size="sm"
                className="gap-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                onClick={() => {
                  onReschedule(content);
                  onOpenChange(false);
                }}
              >
                <Calendar className="h-4 w-4" />
                Reschedule
              </Button>
            ) : null}
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-white"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
