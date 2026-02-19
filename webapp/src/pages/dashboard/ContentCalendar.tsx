import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Instagram,
  MessageSquare,
  Plus,
  Clock,
  Film,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGeneratedContent } from "@/hooks/use-content";
import type { GeneratedContent, ContentPlatform } from "@/lib/types";

// ============================================
// Mapped calendar item type
// ============================================

type CalendarPlatform = "instagram" | "tiktok" | "x";
type CalendarContentType = "video" | "post";

type ScheduledContent = {
  id: string;
  title: string;
  platform: CalendarPlatform;
  type: CalendarContentType;
  time: string;
  date: Date;
  status: string;
};

// ============================================
// Helpers
// ============================================

function mapPlatform(platform: ContentPlatform): CalendarPlatform {
  switch (platform) {
    case "instagram_reel":
      return "instagram";
    case "tiktok":
      return "tiktok";
    case "x_post":
      return "x";
    default:
      return "instagram";
  }
}

function mapContentType(platform: ContentPlatform): CalendarContentType {
  switch (platform) {
    case "instagram_reel":
    case "tiktok":
      return "video";
    case "x_post":
      return "post";
    default:
      return "video";
  }
}

function extractTitle(script: string | null): string {
  if (!script) return "Untitled Content";
  const firstLine = script.split("\n")[0].trim();
  // Remove markdown-style headers or quotes
  const cleaned = firstLine.replace(/^[#>*-]+\s*/, "").trim();
  return cleaned.length > 0 ? cleaned.slice(0, 80) : "Untitled Content";
}

function extractTime(scheduledFor: string | null): string {
  if (!scheduledFor) return "--:--";
  const d = new Date(scheduledFor);
  if (isNaN(d.getTime())) return "--:--";
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function mapBackendItem(item: GeneratedContent): ScheduledContent | null {
  const dateStr = item.scheduledFor;
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;

  return {
    id: item.id,
    title: extractTitle(item.script),
    platform: mapPlatform(item.platform),
    type: mapContentType(item.platform),
    time: extractTime(item.scheduledFor),
    date: d,
    status: item.status,
  };
}

// ============================================
// Constants
// ============================================

const platformIcons: Record<string, React.ReactNode> = {
  instagram: <Instagram className="h-4 w-4" />,
  tiktok: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  ),
  x: <MessageSquare className="h-4 w-4" />,
};

const platformColors: Record<string, string> = {
  instagram: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  tiktok: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  x: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ============================================
// Component
// ============================================

export default function ContentCalendar() {
  const now = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(now);
  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(now.getFullYear(), now.getMonth(), 1)
  );
  const [view, setView] = useState<"month" | "week">("month");

  // Fetch scheduled + approved content from the backend
  const {
    data: scheduledData,
    isLoading: scheduledLoading,
    isError: scheduledError,
  } = useGeneratedContent({ status: "scheduled", limit: 100 });

  const {
    data: approvedData,
    isLoading: approvedLoading,
    isError: approvedError,
  } = useGeneratedContent({ status: "approved", limit: 100 });

  const isLoading = scheduledLoading || approvedLoading;
  const isError = scheduledError || approvedError;

  // Map backend data to calendar items
  const scheduledContent: ScheduledContent[] = useMemo(() => {
    const allItems: GeneratedContent[] = [
      ...(scheduledData?.items ?? []),
      ...(approvedData?.items ?? []),
    ];

    const mapped = allItems
      .map(mapBackendItem)
      .filter((item): item is ScheduledContent => item !== null);

    // Sort by date ascending
    mapped.sort((a, b) => a.date.getTime() - b.date.getTime());
    return mapped;
  }, [scheduledData, approvedData]);

  const getContentForDate = (date: Date) => {
    return scheduledContent.filter(
      (content) =>
        content.date.getDate() === date.getDate() &&
        content.date.getMonth() === date.getMonth() &&
        content.date.getFullYear() === date.getFullYear()
    );
  };

  const selectedDateContent = getContentForDate(selectedDate);

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === "prev") {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = (firstDay.getDay() + 6) % 7; // Monday = 0

    const days: (Date | null)[] = [];

    // Add empty slots for days before the first day of month
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Upcoming content: items with date >= today, sorted ascending
  const upcomingContent = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return scheduledContent.filter((c) => c.date >= today).slice(0, 5);
  }, [scheduledContent]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white md:text-3xl">Content Calendar</h1>
          <p className="text-zinc-400">Plan and manage your content schedule</p>
        </div>
        <div className="flex gap-2">
          <Select value={view} onValueChange={(v) => setView(v as "month" | "week")}>
            <SelectTrigger className="w-32 border-zinc-700 bg-zinc-800 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-zinc-700 bg-zinc-900">
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gap-2 bg-violet-600 hover:bg-violet-700">
            <Plus className="h-4 w-4" />
            Schedule Content
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <Card className="border-zinc-800 bg-zinc-900/50 lg:col-span-2">
          <CardHeader className="border-b border-zinc-800 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-white">
                {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-zinc-400 hover:text-white"
                  onClick={() => navigateMonth("prev")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-zinc-400 hover:text-white"
                  onClick={() => navigateMonth("next")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="mb-3 h-8 w-8 animate-spin text-violet-400" />
                <p className="text-sm text-zinc-400">Loading calendar...</p>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-20">
                <AlertCircle className="mb-3 h-8 w-8 text-red-400" />
                <p className="text-sm text-red-400">Failed to load content</p>
                <p className="mt-1 text-xs text-zinc-500">Please try refreshing the page</p>
              </div>
            ) : (
              <>
                {/* Week day headers */}
                <div className="mb-2 grid grid-cols-7 gap-1">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="py-2 text-center text-xs font-medium text-zinc-500"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((date, index) => {
                    if (!date) {
                      return <div key={`empty-${index}`} className="aspect-square" />;
                    }

                    const dayContent = getContentForDate(date);
                    const hasContent = dayContent.length > 0;

                    return (
                      <button
                        key={date.toISOString()}
                        onClick={() => setSelectedDate(date)}
                        className={cn(
                          "relative flex aspect-square flex-col items-center justify-start rounded-lg p-1 transition-all hover:bg-zinc-800",
                          isSelected(date) && "bg-violet-500/20 ring-1 ring-violet-500",
                          isToday(date) && !isSelected(date) && "bg-zinc-800/50"
                        )}
                      >
                        <span
                          className={cn(
                            "text-sm",
                            isSelected(date) ? "font-semibold text-violet-400" : "text-zinc-300",
                            isToday(date) && !isSelected(date) && "text-white"
                          )}
                        >
                          {date.getDate()}
                        </span>
                        {hasContent ? (
                          <div className="mt-1 flex flex-wrap justify-center gap-0.5">
                            {dayContent.slice(0, 3).map((content) => (
                              <div
                                key={content.id}
                                className={cn(
                                  "h-1.5 w-1.5 rounded-full",
                                  content.platform === "instagram" && "bg-pink-400",
                                  content.platform === "tiktok" && "bg-cyan-400",
                                  content.platform === "x" && "bg-blue-400"
                                )}
                              />
                            ))}
                            {dayContent.length > 3 ? (
                              <span className="text-[8px] text-zinc-500">+{dayContent.length - 3}</span>
                            ) : null}
                          </div>
                        ) : null}
                      </button>
                    );
                  })}
                </div>

                {/* Platform legend */}
                <div className="mt-4 flex flex-wrap gap-4 border-t border-zinc-800 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-pink-400" />
                    <span className="text-xs text-zinc-400">Instagram</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-cyan-400" />
                    <span className="text-xs text-zinc-400">TikTok</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-400" />
                    <span className="text-xs text-zinc-400">X</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Selected Day Details */}
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="border-b border-zinc-800">
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <CalendarIcon className="h-5 w-5 text-violet-400" />
              {months[selectedDate.getMonth()]} {selectedDate.getDate()}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="mb-3 h-6 w-6 animate-spin text-violet-400" />
                <p className="text-sm text-zinc-400">Loading...</p>
              </div>
            ) : selectedDateContent.length > 0 ? (
              <ScrollArea className="h-[400px]">
                <div className="divide-y divide-zinc-800">
                  {selectedDateContent.map((content) => (
                    <div
                      key={content.id}
                      className="group cursor-pointer p-4 transition-colors hover:bg-zinc-800/30"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <Badge
                          className={cn(
                            "gap-1 border",
                            platformColors[content.platform]
                          )}
                        >
                          {platformIcons[content.platform]}
                          {content.platform === "x" ? "X" : content.platform}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-zinc-500">
                          <Clock className="h-3 w-3" />
                          {content.time}
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
                          {content.type === "video" ? (
                            <Film className="h-5 w-5 text-violet-400" />
                          ) : (
                            <MessageSquare className="h-5 w-5 text-blue-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white group-hover:text-violet-400">
                            {content.title}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {content.type === "video" ? "Video" : "Post"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 rounded-full bg-zinc-800 p-4">
                  <CalendarIcon className="h-6 w-6 text-zinc-500" />
                </div>
                <p className="mb-2 text-sm font-medium text-white">No scheduled content</p>
                <p className="mb-4 text-xs text-zinc-500">
                  Nothing is scheduled for this day yet
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  <Plus className="h-4 w-4" />
                  Schedule Content
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Content */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader className="border-b border-zinc-800">
          <CardTitle className="text-lg text-white">Upcoming Releases</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-violet-400" />
              <p className="text-sm text-zinc-400">Loading upcoming content...</p>
            </div>
          ) : upcomingContent.length > 0 ? (
            <div className="divide-y divide-zinc-800">
              {upcomingContent.map((content) => (
                <div
                  key={content.id}
                  className="flex items-center gap-4 p-4 transition-colors hover:bg-zinc-800/30"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
                    {content.type === "video" ? (
                      <Film className="h-6 w-6 text-violet-400" />
                    ) : (
                      <MessageSquare className="h-6 w-6 text-blue-400" />
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-white">{content.title}</p>
                    <p className="text-xs text-zinc-500">
                      {months[content.date.getMonth()]} {content.date.getDate()} at {content.time}
                    </p>
                  </div>
                  <Badge className={cn("gap-1 border", platformColors[content.platform])}>
                    {platformIcons[content.platform]}
                    {content.platform === "x" ? "X" : content.platform}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-zinc-800 p-4">
                <CalendarIcon className="h-6 w-6 text-zinc-500" />
              </div>
              <p className="mb-2 text-sm font-medium text-white">No upcoming content</p>
              <p className="text-xs text-zinc-500">
                Schedule some content to see it here
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
