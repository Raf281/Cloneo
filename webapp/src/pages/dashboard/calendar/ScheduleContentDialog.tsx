import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Instagram,
  MessageSquare,
  Film,
  Loader2,
  Search,
  Calendar,
  Clock,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSchedulableContent, useScheduleContent } from "@/hooks/use-content";
import type { GeneratedContent, ContentPlatform } from "@/lib/types";

// ============================================
// Props
// ============================================

interface ScheduleContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: Date;
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

function extractTitle(script: string | null): string {
  if (!script) return "Untitled Content";
  const firstLine = script.split("\n")[0].trim();
  const cleaned = firstLine.replace(/^[#>*-]+\s*/, "").trim();
  return cleaned.length > 0 ? cleaned.slice(0, 80) : "Untitled Content";
}

function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// ============================================
// Component
// ============================================

export default function ScheduleContentDialog({
  open,
  onOpenChange,
  defaultDate,
}: ScheduleContentDialogProps) {
  const [step, setStep] = useState<"select" | "datetime">("select");
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [date, setDate] = useState(
    defaultDate ? formatDateForInput(defaultDate) : formatDateForInput(new Date())
  );
  const [time, setTime] = useState("12:00");

  const { data: schedulableItems, isLoading } = useSchedulableContent();
  const scheduleMutation = useScheduleContent();

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return schedulableItems;
    const q = searchQuery.toLowerCase();
    return schedulableItems.filter((item) => {
      const title = extractTitle(item.script).toLowerCase();
      const platform = platformLabels[item.platform].toLowerCase();
      return title.includes(q) || platform.includes(q);
    });
  }, [schedulableItems, searchQuery]);

  const selectedItem = useMemo(
    () => schedulableItems.find((item) => item.id === selectedContentId) ?? null,
    [schedulableItems, selectedContentId]
  );

  function handleSelectContent(item: GeneratedContent) {
    setSelectedContentId(item.id);
    setStep("datetime");
  }

  function handleBack() {
    setStep("select");
  }

  async function handleSchedule() {
    if (!selectedContentId) return;

    const scheduledFor = new Date(`${date}T${time}:00`).toISOString();

    scheduleMutation.mutate(
      { id: selectedContentId, scheduledFor },
      {
        onSuccess: () => {
          onOpenChange(false);
          resetState();
        },
      }
    );
  }

  function resetState() {
    setStep("select");
    setSelectedContentId(null);
    setSearchQuery("");
    setTime("12:00");
    setDate(defaultDate ? formatDateForInput(defaultDate) : formatDateForInput(new Date()));
  }

  function handleOpenChange(val: boolean) {
    if (!val) resetState();
    onOpenChange(val);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg border-zinc-800 bg-zinc-900 text-white sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-lg text-white">
            {step === "select" ? "Select Content to Schedule" : "Pick Date & Time"}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {step === "select"
              ? "Choose from your draft or approved content"
              : "Set when this content should be published"}
          </DialogDescription>
        </DialogHeader>

        {step === "select" ? (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-zinc-700 bg-zinc-800 pl-10 text-white placeholder:text-zinc-500"
              />
            </div>

            {/* Content list */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="mr-2 h-5 w-5 animate-spin text-violet-400" />
                <span className="text-sm text-zinc-400">Loading content...</span>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="py-12 text-center">
                <Calendar className="mx-auto mb-3 h-8 w-8 text-zinc-600" />
                <p className="text-sm text-zinc-400">
                  {searchQuery ? "No matching content found" : "No content available to schedule"}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  {searchQuery
                    ? "Try adjusting your search"
                    : "Generate some content first, then come back to schedule it"}
                </p>
              </div>
            ) : (
              <ScrollArea className="max-h-[360px]">
                <div className="space-y-2 pr-3">
                  {filteredItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectContent(item)}
                      className="group flex w-full items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-800/40 p-3 text-left transition-all hover:border-violet-500/50 hover:bg-zinc-800"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-700/50">
                        {item.type === "video" ? (
                          <Film className="h-5 w-5 text-violet-400" />
                        ) : (
                          <MessageSquare className="h-5 w-5 text-blue-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white group-hover:text-violet-300">
                          {extractTitle(item.script)}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge
                            className={cn(
                              "border text-[10px]",
                              platformColors[item.platform]
                            )}
                          >
                            {platformIcons[item.platform]}
                            <span className="ml-1">{platformLabels[item.platform]}</span>
                          </Badge>
                          <span className="text-[10px] capitalize text-zinc-500">
                            {item.status.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {/* Selected content preview */}
            {selectedItem ? (
              <div className="flex items-start gap-3 rounded-lg border border-zinc-700 bg-zinc-800/60 p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-700/50">
                  {selectedItem.type === "video" ? (
                    <Film className="h-5 w-5 text-violet-400" />
                  ) : (
                    <MessageSquare className="h-5 w-5 text-blue-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {extractTitle(selectedItem.script)}
                  </p>
                  <Badge
                    className={cn(
                      "mt-1 border text-[10px]",
                      platformColors[selectedItem.platform]
                    )}
                  >
                    {platformIcons[selectedItem.platform]}
                    <span className="ml-1">{platformLabels[selectedItem.platform]}</span>
                  </Badge>
                </div>
                <Check className="h-5 w-5 text-emerald-400" />
              </div>
            ) : null}

            {/* Date & Time pickers */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-zinc-300">
                  <Calendar className="mr-1 inline h-3.5 w-3.5 text-zinc-400" />
                  Date
                </Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border-zinc-700 bg-zinc-800 text-white [color-scheme:dark]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-zinc-300">
                  <Clock className="mr-1 inline h-3.5 w-3.5 text-zinc-400" />
                  Time
                </Label>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="border-zinc-700 bg-zinc-800 text-white [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between gap-3">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="text-zinc-400 hover:text-white"
              >
                Back
              </Button>
              <Button
                onClick={handleSchedule}
                disabled={scheduleMutation.isPending || !date || !time}
                className="gap-2 bg-violet-600 hover:bg-violet-700"
              >
                {scheduleMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Calendar className="h-4 w-4" />
                )}
                Schedule Content
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
