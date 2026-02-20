import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Instagram,
  MessageSquare,
  Film,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// Types
// ============================================

type CalendarPlatform = "instagram" | "tiktok" | "x";
type CalendarContentType = "video" | "post";

export type ScheduledContent = {
  id: string;
  title: string;
  platform: CalendarPlatform;
  type: CalendarContentType;
  time: string;
  date: Date;
  status: string;
};

interface WeekViewProps {
  currentDate: Date;
  scheduledContent: ScheduledContent[];
  onContentClick: (contentId: string) => void;
  onSlotClick?: (date: Date) => void;
}

// ============================================
// Constants
// ============================================

const platformIcons: Record<string, React.ReactNode> = {
  instagram: <Instagram className="h-3 w-3" />,
  tiktok: (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  ),
  x: <MessageSquare className="h-3 w-3" />,
};

const platformColors: Record<string, string> = {
  instagram: "border-pink-500/30 bg-pink-500/10 text-pink-400",
  tiktok: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
  x: "border-blue-500/30 bg-blue-500/10 text-blue-400",
};

const platformDotColors: Record<string, string> = {
  instagram: "bg-pink-400",
  tiktok: "bg-cyan-400",
  x: "bg-blue-400",
};

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const timeSlots = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00", "22:00",
];

// ============================================
// Helpers
// ============================================

function getWeekDays(currentDate: Date): Date[] {
  const date = new Date(currentDate);
  const dayOfWeek = date.getDay();
  // Adjust so Monday = 0
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(date);
  monday.setDate(date.getDate() + mondayOffset);

  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
}

function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

function getSlotHour(slot: string): number {
  return parseInt(slot.split(":")[0], 10);
}

// ============================================
// Component
// ============================================

export default function WeekView({
  currentDate,
  scheduledContent,
  onContentClick,
  onSlotClick,
}: WeekViewProps) {
  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);

  // Group content by day and hour
  const contentByDayHour = useMemo(() => {
    const map = new Map<string, ScheduledContent[]>();
    for (const item of scheduledContent) {
      for (const day of weekDays) {
        if (isSameDay(item.date, day)) {
          const hour = item.date.getHours();
          const key = `${day.toISOString().slice(0, 10)}-${hour}`;
          const arr = map.get(key) ?? [];
          arr.push(item);
          map.set(key, arr);
        }
      }
    }
    return map;
  }, [scheduledContent, weekDays]);

  return (
    <div className="flex flex-col">
      {/* Day headers */}
      <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-zinc-800">
        <div className="p-2" />
        {weekDays.map((day, i) => (
          <div
            key={i}
            className={cn(
              "flex flex-col items-center border-l border-zinc-800 py-2",
              isToday(day) && "bg-violet-500/5"
            )}
          >
            <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              {dayLabels[i]}
            </span>
            <span
              className={cn(
                "mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold",
                isToday(day)
                  ? "bg-violet-500 text-white"
                  : "text-zinc-300"
              )}
            >
              {day.getDate()}
            </span>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <ScrollArea className="h-[480px]">
        <div className="grid grid-cols-[60px_repeat(7,1fr)]">
          {timeSlots.map((slot) => {
            const slotHour = getSlotHour(slot);
            return (
              <div key={slot} className="contents">
                {/* Time label */}
                <div className="flex h-16 items-start justify-end border-b border-zinc-800/50 pr-2 pt-1">
                  <span className="text-[10px] font-medium text-zinc-500">
                    {slot}
                  </span>
                </div>

                {/* Day columns */}
                {weekDays.map((day, dayIdx) => {
                  const dayStr = day.toISOString().slice(0, 10);
                  const key = `${dayStr}-${slotHour}`;
                  const items = contentByDayHour.get(key) ?? [];

                  return (
                    <button
                      key={`${dayIdx}-${slot}`}
                      className={cn(
                        "relative h-16 border-b border-l border-zinc-800/50 transition-colors hover:bg-zinc-800/30",
                        isToday(day) && "bg-violet-500/[0.02]"
                      )}
                      onClick={() => {
                        if (items.length > 0) {
                          onContentClick(items[0].id);
                        } else if (onSlotClick) {
                          const clickDate = new Date(day);
                          clickDate.setHours(slotHour, 0, 0, 0);
                          onSlotClick(clickDate);
                        }
                      }}
                    >
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className={cn(
                            "absolute inset-x-0.5 top-0.5 z-10 cursor-pointer rounded border px-1.5 py-0.5 text-left transition-opacity hover:opacity-90",
                            platformColors[item.platform]
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            onContentClick(item.id);
                          }}
                        >
                          <div className="flex items-center gap-1">
                            {platformIcons[item.platform]}
                            <span className="truncate text-[10px] font-medium">
                              {item.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[9px] opacity-70">
                            <Clock className="h-2.5 w-2.5" />
                            {item.time}
                          </div>
                        </div>
                      ))}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-4 border-t border-zinc-800 pt-3">
        {(["instagram", "tiktok", "x"] as const).map((platform) => (
          <div key={platform} className="flex items-center gap-2">
            <div className={cn("h-3 w-3 rounded-full", platformDotColors[platform])} />
            <span className="text-xs text-zinc-400">
              {platform === "x" ? "X" : platform.charAt(0).toUpperCase() + platform.slice(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
