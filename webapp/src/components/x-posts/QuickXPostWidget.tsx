import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { XIcon } from "./XIcon";
import { Sparkles, Send, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useGeneratedContent } from "@/hooks/use-content";

const statusConfig: Record<string, { label: string; color: string }> = {
  draft: { label: "Draft", color: "bg-zinc-500/20 text-zinc-400" },
  pending_review: { label: "Review", color: "bg-amber-500/20 text-amber-400" },
  approved: { label: "Ready", color: "bg-emerald-500/20 text-emerald-400" },
  scheduled: { label: "Scheduled", color: "bg-blue-500/20 text-blue-400" },
  published: { label: "Published", color: "bg-emerald-500/20 text-emerald-400" },
};

interface QuickXPostWidgetProps {
  onPostDraft?: (text: string) => void;
  onAiGenerate?: () => void;
}

export function QuickXPostWidget({ onPostDraft, onAiGenerate }: QuickXPostWidgetProps) {
  const [text, setText] = useState("");
  const charCount = text.length;
  const isOverLimit = charCount > 280;
  const isNearLimit = charCount > 250;

  // Fetch real X posts from backend
  const { data, isLoading } = useGeneratedContent({
    platform: "x_post",
    limit: 3,
  });

  const recentXPosts = data?.items ?? [];

  const handlePostDraft = () => {
    if (text.trim()) {
      onPostDraft?.(text);
      setText("");
    }
  };

  return (
    <Card className="border-zinc-800 bg-zinc-900/50">
      <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-800 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black">
            <XIcon className="h-4 w-4 text-white" />
          </div>
          Quick X Post
        </CardTitle>
        <Button variant="ghost" asChild className="gap-1 text-sm text-zinc-400 hover:text-white">
          <Link to="/dashboard/studio?tab=xposts">
            All X Posts
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        {/* Quick compose area */}
        <div className="space-y-3">
          <div className="relative">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What would you like to share?"
              className="min-h-[100px] resize-none border-zinc-700 bg-zinc-800 pr-16 text-white placeholder:text-zinc-500"
            />
            {/* Character count */}
            <div className="absolute bottom-2 right-2 flex items-center gap-1">
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
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              onClick={onAiGenerate}
              variant="outline"
              className="flex-1 gap-2 border-zinc-700 text-zinc-300 hover:border-black hover:bg-black hover:text-white"
            >
              <Sparkles className="h-4 w-4" />
              Let AI Write
            </Button>
            <Button
              onClick={handlePostDraft}
              disabled={!text.trim() || isOverLimit}
              className="flex-1 gap-2 bg-black text-white hover:bg-zinc-900"
            >
              <Send className="h-4 w-4" />
              Save as Draft
            </Button>
          </div>
        </div>

        {/* Recent X Posts */}
        <div className="mt-6 space-y-3">
          <p className="flex items-center gap-2 text-sm text-zinc-400">
            <Clock className="h-4 w-4" />
            Recent X Posts
          </p>
          <div className="space-y-2">
            {isLoading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-800/30 p-3">
                    <Skeleton className="h-4 flex-1 bg-zinc-700" />
                    <Skeleton className="h-5 w-16 rounded-full bg-zinc-700" />
                  </div>
                ))}
              </>
            ) : recentXPosts.length === 0 ? (
              <p className="rounded-lg border border-zinc-800 bg-zinc-800/30 p-3 text-center text-sm text-zinc-500">
                No X posts yet. Create your first one!
              </p>
            ) : (
              recentXPosts.map((post) => {
                const st = statusConfig[post.status] ?? statusConfig["draft"];
                return (
                  <Link
                    key={post.id}
                    to="/dashboard/studio?tab=xposts"
                    className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-800/30 p-3 transition-colors hover:border-zinc-700 hover:bg-zinc-800/50"
                  >
                    <p className="flex-1 truncate text-sm text-zinc-300">
                      {post.script || "No content"}
                    </p>
                    <Badge className={st.color}>
                      {st.label}
                    </Badge>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
