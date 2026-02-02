import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { XIcon } from "./XIcon";
import { XPostEditor } from "./XPostEditor";
import { XPostPreview } from "./XPostPreview";
import type { XPost } from "./XPostCard";
import {
  Check,
  X,
  Pencil,
  Calendar,
  Clock,
  AlertCircle,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Review ausstehend", color: "bg-amber-500/20 text-amber-400" },
  approved: { label: "Freigegeben", color: "bg-emerald-500/20 text-emerald-400" },
  scheduled: { label: "Geplant", color: "bg-blue-500/20 text-blue-400" },
  rejected: { label: "Abgelehnt", color: "bg-red-500/20 text-red-400" },
  draft: { label: "Entwurf", color: "bg-zinc-500/20 text-zinc-400" },
};

interface XPostDetailViewProps {
  post: XPost;
  threadPosts?: XPost[];
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onSchedule?: (date: string) => void;
  onUpdate?: (post: XPost) => void;
}

const suggestedHashtags = [
  "motivation",
  "erfolg",
  "mindset",
  "productivity",
  "entrepreneur",
  "business",
  "erfolgsgewohnheiten",
  "contentcreator",
];

export function XPostDetailView({
  post,
  threadPosts = [],
  onClose,
  onApprove,
  onReject,
  onSchedule,
  onUpdate,
}: XPostDetailViewProps) {
  const [text, setText] = useState(post.text);
  const [hashtags, setHashtags] = useState<string[]>(post.hashtags);
  const [isEditing, setIsEditing] = useState(false);
  const [currentThreadIndex, setCurrentThreadIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(true);

  const isThread = post.isThread && threadPosts.length > 0;
  const allPosts = isThread ? [post, ...threadPosts] : [post];
  const currentPost = allPosts[currentThreadIndex];

  const handleSave = () => {
    onUpdate?.({ ...post, text, hashtags });
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center rounded-full bg-black p-2 text-white">
          <XIcon className="h-4 w-4" />
        </span>
        <span className="text-sm text-zinc-400">X (Twitter)</span>
        <Badge className={statusConfig[post.status].color}>
          {statusConfig[post.status].label}
        </Badge>
        {post.isThread ? (
          <Badge variant="outline" className="border-zinc-700 text-zinc-400">
            Thread ({post.threadCount} Tweets)
          </Badge>
        ) : null}
      </div>

      {/* Rejection reason */}
      {post.rejectionReason ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
          <p className="flex items-start gap-2 text-sm text-red-400">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>
              <strong>Ablehnungsgrund:</strong> {post.rejectionReason}
            </span>
          </p>
        </div>
      ) : null}

      {/* Scheduled info */}
      {post.scheduledFor ? (
        <div className="flex items-center gap-2 rounded-lg bg-blue-500/10 p-3 text-blue-400">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">Geplant fur: {post.scheduledFor}</span>
        </div>
      ) : null}

      {/* Best posting time suggestion */}
      {post.suggestedTime && post.status !== "scheduled" ? (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
          <Clock className="h-4 w-4 text-emerald-400" />
          <span className="text-sm text-emerald-400">
            Empfohlene Zeit: {post.suggestedTime}
          </span>
        </div>
      ) : null}

      {/* Thread navigation */}
      {isThread ? (
        <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
          <Button
            variant="ghost"
            size="sm"
            disabled={currentThreadIndex === 0}
            onClick={() => setCurrentThreadIndex(currentThreadIndex - 1)}
            className="gap-1 text-zinc-400"
          >
            <ChevronLeft className="h-4 w-4" />
            Zuruck
          </Button>
          <span className="text-sm text-zinc-400">
            Tweet {currentThreadIndex + 1} von {allPosts.length}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={currentThreadIndex === allPosts.length - 1}
            onClick={() => setCurrentThreadIndex(currentThreadIndex + 1)}
            className="gap-1 text-zinc-400"
          >
            Weiter
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      ) : null}

      {/* Content area with tabs for edit/preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setIsEditing(true);
                setShowPreview(false);
              }}
              className={
                isEditing
                  ? "bg-zinc-800 text-white"
                  : "border-zinc-700 text-zinc-400 hover:bg-zinc-800"
              }
            >
              <Pencil className="mr-1 h-3 w-3" />
              Bearbeiten
            </Button>
            <Button
              variant={showPreview && !isEditing ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setShowPreview(true);
                setIsEditing(false);
              }}
              className={
                showPreview && !isEditing
                  ? "bg-zinc-800 text-white"
                  : "border-zinc-700 text-zinc-400 hover:bg-zinc-800"
              }
            >
              <XIcon className="mr-1 h-3 w-3" />
              Vorschau
            </Button>
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setText(post.text);
                  setHashtags(post.hashtags);
                  setIsEditing(false);
                }}
                className="text-zinc-400"
              >
                Abbrechen
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Speichern
              </Button>
            </div>
          ) : null}
        </div>

        {isEditing ? (
          <XPostEditor
            value={text}
            onChange={setText}
            hashtags={hashtags}
            onHashtagsChange={setHashtags}
            suggestedHashtags={suggestedHashtags}
          />
        ) : showPreview ? (
          <XPostPreview text={text} hashtags={hashtags} />
        ) : (
          <div className="whitespace-pre-wrap rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-300">
            {text}
          </div>
        )}
      </div>

      {/* Schedule input */}
      {post.status !== "scheduled" && post.status !== "rejected" ? (
        <div className="space-y-2">
          <Label className="text-zinc-400">Veroffentlichung planen</Label>
          <Input
            type="datetime-local"
            className="border-zinc-700 bg-zinc-800 text-white"
          />
        </div>
      ) : null}

      {/* Action buttons */}
      <div className="flex flex-col gap-3 border-t border-zinc-800 pt-4 sm:flex-row">
        {post.status === "pending" || post.status === "draft" ? (
          <>
            <Button
              onClick={onApprove}
              className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700"
            >
              <Check className="h-4 w-4" />
              Freigeben & Planen
            </Button>
            <Button
              variant="outline"
              onClick={onReject}
              className="flex-1 gap-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              <X className="h-4 w-4" />
              Ablehnen
            </Button>
          </>
        ) : post.status === "rejected" ? (
          <Button className="flex-1 gap-2 bg-violet-600 hover:bg-violet-700">
            <Pencil className="h-4 w-4" />
            Uberarbeiten
          </Button>
        ) : post.status === "approved" ? (
          <Button className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700">
            <Calendar className="h-4 w-4" />
            Jetzt planen
          </Button>
        ) : null}
      </div>
    </div>
  );
}
