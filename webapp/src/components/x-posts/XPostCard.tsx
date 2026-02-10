import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { XIcon } from "./XIcon";
import { Hash, Clock, MessageCircle } from "lucide-react";

export interface XPost {
  id: string | number;
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

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Review ausstehend", color: "bg-amber-500/20 text-amber-400" },
  approved: { label: "Freigegeben", color: "bg-emerald-500/20 text-emerald-400" },
  scheduled: { label: "Geplant", color: "bg-blue-500/20 text-blue-400" },
  rejected: { label: "Abgelehnt", color: "bg-red-500/20 text-red-400" },
  draft: { label: "Entwurf", color: "bg-zinc-500/20 text-zinc-400" },
};

interface XPostCardProps {
  post: XPost;
  onClick: () => void;
}

export function XPostCard({ post, onClick }: XPostCardProps) {
  const charCount = post.text.length;
  const charPercentage = Math.min((charCount / 280) * 100, 100);
  const isNearLimit = charCount > 250;
  const isOverLimit = charCount > 280;

  return (
    <Card
      className="group cursor-pointer overflow-hidden border-zinc-800 bg-zinc-900/50 transition-all hover:border-zinc-700 hover:bg-zinc-800/50"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="flex flex-col p-4">
          {/* Header with X icon and status */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center rounded-full bg-black p-1.5 text-white">
                <XIcon className="h-3.5 w-3.5" />
              </span>
              {post.isThread ? (
                <Badge variant="outline" className="gap-1 border-zinc-700 text-xs text-zinc-400">
                  <MessageCircle className="h-3 w-3" />
                  Thread ({post.threadCount})
                </Badge>
              ) : null}
            </div>
            <Badge className={statusConfig[post.status].color}>
              {statusConfig[post.status].label}
            </Badge>
          </div>

          {/* Tweet text preview */}
          <p className="mb-3 text-sm text-zinc-300 line-clamp-4 whitespace-pre-wrap">
            {post.text}
          </p>

          {/* Hashtags */}
          {post.hashtags.length > 0 ? (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {post.hashtags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-0.5 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs text-blue-400"
                >
                  <Hash className="h-3 w-3" />
                  {tag}
                </span>
              ))}
              {post.hashtags.length > 3 ? (
                <span className="text-xs text-zinc-500">+{post.hashtags.length - 3} mehr</span>
              ) : null}
            </div>
          ) : null}

          {/* Footer with character count and time */}
          <div className="mt-auto flex items-center justify-between border-t border-zinc-800 pt-3">
            <div className="flex items-center gap-2">
              {/* Character count indicator */}
              <div className="relative h-5 w-5">
                <svg className="h-5 w-5 -rotate-90" viewBox="0 0 20 20">
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    fill="none"
                    strokeWidth="2"
                    className="stroke-zinc-700"
                  />
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    fill="none"
                    strokeWidth="2"
                    strokeDasharray={`${charPercentage * 0.502} 50.2`}
                    className={
                      isOverLimit
                        ? "stroke-red-500"
                        : isNearLimit
                        ? "stroke-amber-500"
                        : "stroke-blue-400"
                    }
                  />
                </svg>
              </div>
              <span
                className={`text-xs ${
                  isOverLimit
                    ? "text-red-400"
                    : isNearLimit
                    ? "text-amber-400"
                    : "text-zinc-500"
                }`}
              >
                {charCount}/280
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs text-zinc-500">
              <Clock className="h-3 w-3" />
              {post.scheduledFor ? post.scheduledFor : post.createdAt}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
