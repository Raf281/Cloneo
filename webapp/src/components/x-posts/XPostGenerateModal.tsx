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
import { Sparkles, Plus, Trash2, MessageCircle, Clock } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface XPostGenerateModalProps {
  trigger?: React.ReactNode;
  onGenerate?: (config: GenerateConfig) => void;
}

interface GenerateConfig {
  topic: string;
  isThread: boolean;
  threadCount: number;
  includeHashtags: boolean;
  tone: string;
}

export function XPostGenerateModal({ trigger, onGenerate }: XPostGenerateModalProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [isThread, setIsThread] = useState(false);
  const [threadCount, setThreadCount] = useState(3);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [tone, setTone] = useState("motivational");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate generation
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsGenerating(false);
    setOpen(false);
    onGenerate?.({
      topic,
      isThread,
      threadCount,
      includeHashtags,
      tone,
    });
  };

  const toneOptions = [
    { value: "motivational", label: "Motivierend" },
    { value: "educational", label: "Lehrreich" },
    { value: "entertaining", label: "Unterhaltsam" },
    { value: "controversial", label: "Kontrovers" },
    { value: "storytelling", label: "Storytelling" },
    { value: "professional", label: "Professionell" },
    { value: "casual", label: "Locker" },
  ];

  const bestTimes = [
    { time: "08:00", label: "Morgens - Hohes Engagement" },
    { time: "12:00", label: "Mittags - Pausenzeit" },
    { time: "18:00", label: "Abends - Peak-Zeit" },
    { time: "21:00", label: "Spat abends - Aktive User" },
  ];

  const content = (
    <div className="space-y-6">
      {/* Topic input */}
      <div className="space-y-2">
        <Label className="text-zinc-300">Thema (optional)</Label>
        <Textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="z.B. Produktivitats-Tipps fur Unternehmer, Mindset-Hacks, Erfolgsgewohnheiten..."
          className="min-h-[80px] border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500"
        />
        <p className="text-xs text-zinc-500">
          Leer lassen, um die KI basierend auf deiner Persona entscheiden zu lassen
        </p>
      </div>

      {/* Thread toggle */}
      <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-5 w-5 text-zinc-400" />
            <div>
              <p className="text-sm font-medium text-white">Thread erstellen</p>
              <p className="text-xs text-zinc-500">Mehrere zusammenhangende Posts</p>
            </div>
          </div>
          <Switch checked={isThread} onCheckedChange={setIsThread} />
        </div>

        {isThread ? (
          <div className="space-y-2 pt-2">
            <Label className="text-zinc-400">Anzahl Tweets im Thread</Label>
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
          <p className="text-sm font-medium text-white">Hashtags einbeziehen</p>
          <p className="text-xs text-zinc-500">KI schlagt relevante Hashtags vor</p>
        </div>
        <Switch checked={includeHashtags} onCheckedChange={setIncludeHashtags} />
      </div>

      {/* Tone selector */}
      <div className="space-y-2">
        <Label className="text-zinc-300">Tonalitat</Label>
        <Select value={tone} onValueChange={setTone}>
          <SelectTrigger className="border-zinc-700 bg-zinc-800 text-white">
            <SelectValue placeholder="Tonalitat wahlen" />
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
          Empfohlene Posting-Zeit
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
        disabled={isGenerating}
        className="w-full gap-2 bg-black text-white hover:bg-zinc-900"
      >
        {isGenerating ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Generiere...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            X Post generieren
          </>
        )}
      </Button>
    </div>
  );

  const defaultTrigger = (
    <Button className="gap-2 bg-black text-white hover:bg-zinc-900">
      <XIcon className="h-4 w-4" />
      <Plus className="h-4 w-4" />
      Neuer X Post
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
              X Post generieren
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
            X Post generieren
          </DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
