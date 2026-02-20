import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { XIcon } from "./XIcon";
import { Sparkles, Plus, MessageCircle, Clock, Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGenerateContent } from "@/hooks/use-content";
import { toast } from "sonner";
import type { ContentTone } from "@/lib/types";

interface XPostGenerateModalProps {
  trigger?: React.ReactNode;
}

/** Tone mapping: form value -> backend German tone */
const toneMap: Record<string, ContentTone> = {
  motivational: "motivierend",
  educational: "informativ",
  entertaining: "unterhaltsam",
  controversial: "provokant",
};

export function XPostGenerateModal({ trigger }: XPostGenerateModalProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [isThread, setIsThread] = useState(false);
  const [threadCount, setThreadCount] = useState(3);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [tone, setTone] = useState("motivational");

  const generateMutation = useGenerateContent();

  const handleGenerate = () => {
    const mappedTone = toneMap[tone] ?? ("motivierend" as ContentTone);
    generateMutation.mutate(
      {
        platform: "x_post",
        topic: topic || undefined,
        tone: mappedTone,
      },
      {
        onSuccess: () => {
          toast.success("X Post is being generated!");
          setOpen(false);
          setTopic("");
        },
        onError: (err) => {
          toast.error(`Error: ${err.message}`);
        },
      }
    );
  };

  const toneOptions = [
    { value: "motivational", label: "Motivational" },
    { value: "educational", label: "Educational" },
    { value: "entertaining", label: "Entertaining" },
    { value: "controversial", label: "Controversial" },
    { value: "storytelling", label: "Storytelling" },
    { value: "professional", label: "Professional" },
    { value: "casual", label: "Casual" },
  ];

  const bestTimes = [
    { time: "08:00", label: "Morning - High Engagement" },
    { time: "12:00", label: "Midday - Lunch Break" },
    { time: "18:00", label: "Evening - Peak Time" },
    { time: "21:00", label: "Late Night - Active Users" },
  ];

  const content = (
    <div className="space-y-6">
      {/* Topic input */}
      <div className="space-y-2">
        <Label className="text-zinc-300">Topic (optional)</Label>
        <Textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Productivity tips for entrepreneurs, Mindset hacks, Success habits..."
          className="min-h-[80px] border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500"
        />
        <p className="text-xs text-zinc-500">
          Leave empty to let the AI decide based on your persona
        </p>
      </div>

      {/* Thread toggle */}
      <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-5 w-5 text-zinc-400" />
            <div>
              <p className="text-sm font-medium text-white">Create Thread</p>
              <p className="text-xs text-zinc-500">Multiple connected posts</p>
            </div>
          </div>
          <Switch checked={isThread} onCheckedChange={setIsThread} />
        </div>

        {isThread ? (
          <div className="space-y-2 pt-2">
            <Label className="text-zinc-400">Number of tweets in thread</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 border-zinc-700 p-0"
                onClick={() => setThreadCount(Math.max(2, threadCount - 1))}
              >
                -
              </Button>
              <span className="w-12 text-center text-white">{threadCount}</span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 border-zinc-700 p-0"
                onClick={() => setThreadCount(Math.min(10, threadCount + 1))}
              >
                +
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Hashtags toggle */}
      <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <div>
          <p className="text-sm font-medium text-white">Include Hashtags</p>
          <p className="text-xs text-zinc-500">AI suggests relevant hashtags</p>
        </div>
        <Switch checked={includeHashtags} onCheckedChange={setIncludeHashtags} />
      </div>

      {/* Tone selector */}
      <div className="space-y-2">
        <Label className="text-zinc-300">Tone</Label>
        <Select value={tone} onValueChange={setTone}>
          <SelectTrigger className="border-zinc-700 bg-zinc-800 text-white">
            <SelectValue placeholder="Choose tone" />
          </SelectTrigger>
          <SelectContent className="border-zinc-700 bg-zinc-900">
            {toneOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Best posting times */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-zinc-300">
          <Clock className="h-4 w-4" />
          Recommended Posting Time
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {bestTimes.map((time) => (
            <button
              key={time.time}
              className="rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-left transition-colors hover:border-zinc-700 hover:bg-zinc-800"
            >
              <p className="text-sm font-medium text-white">{time.time}</p>
              <p className="text-xs text-zinc-500">{time.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <Button
        onClick={handleGenerate}
        disabled={generateMutation.isPending}
        className="w-full gap-2 bg-black text-white hover:bg-zinc-900"
      >
        {generateMutation.isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Generate X Post
          </>
        )}
      </Button>
    </div>
  );

  const defaultTrigger = (
    <Button className="gap-2 bg-black text-white hover:bg-zinc-900">
      <XIcon className="h-4 w-4" />
      <Plus className="h-4 w-4" />
      New X Post
    </Button>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger ?? defaultTrigger}</DrawerTrigger>
        <DrawerContent className="border-zinc-800 bg-zinc-950 px-4 pb-8">
          <DrawerHeader className="px-0">
            <DrawerTitle className="flex items-center gap-2 text-white">
              <XIcon className="h-5 w-5" />
              Generate X Post
            </DrawerTitle>
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? defaultTrigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-zinc-800 bg-zinc-950 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <XIcon className="h-5 w-5" />
            Generate X Post
          </DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
